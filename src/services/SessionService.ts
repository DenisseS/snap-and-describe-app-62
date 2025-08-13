import { DropboxConfig, FileMetadata } from "../types/dropbox-auth";
import { TokenManager } from "./dropbox/TokenManager";
import { DropboxAPI } from "./dropbox/DropboxAPI";
import { DropboxAuthService } from "./dropbox/DropboxAuthService";
import { DropboxFileManagerService } from "./dropbox/DropboxFileManagerService";
import { SHOPPING_LIST_CACHE_KEYS } from "@/constants/cacheKeys.ts";

class SessionService {
  private tokenManager: TokenManager;
  private api: DropboxAPI;
  private authService: DropboxAuthService;
  private fileManager: DropboxFileManagerService;

  constructor (private config: DropboxConfig) {
    this.tokenManager = new TokenManager();
    this.api = new DropboxAPI(config);
    this.authService = new DropboxAuthService(config);
    this.fileManager = new DropboxFileManagerService(this.api);
  }

  // Métodos robustos para cache local (igual que LocalProvider)
  public getLocalFile (cacheKey: string): any | null {
    try {
      const data = localStorage.getItem(cacheKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading local cache ${cacheKey}:`, error);
      return null;
    }
  }

  public setLocalFile (cacheKey: string, data: any): void {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
      console.log(`📦 Local cache saved: ${cacheKey}`);
    } catch (error) {
      console.error(`Error saving local cache ${cacheKey}:`, error);
    }
  }

  public clearCache (cacheKey: string): void {
    try {
      localStorage.removeItem(cacheKey);
      console.log(`📦 Local cache removed: ${cacheKey}`);
    } catch (error) {
      console.error(`Error removing local cache ${cacheKey}:`, error);
    }
  }

  public clearLocalCache (pattern?: string): void {
    try {
      const keys = Object.keys(localStorage);
      const targetKeys = pattern
        ? keys.filter(key => key.includes(pattern))
        : keys.filter(key => key.startsWith("LOCAL_"));

      targetKeys.forEach(key => this.clearCache(key));
      console.log(`📦 Local cache cleared: ${targetKeys.length} keys removed`);
    } catch (error) {
      console.error("Error clearing local cache:", error);
    }
  }

  // Interceptor: asegurar token válido antes de cada llamada
  private async ensureValidToken (): Promise<string | null> {
    if (!this.tokenManager.hasToken()) {
      return null;
    }

    const tokenData = this.tokenManager.getToken();
    if (!tokenData) return null;

    if (!this.tokenManager.isTokenExpiringSoon()) {
      return tokenData.access_token;
    }

    console.log("🔐 Token expiring soon, attempting refresh...");

    if (!tokenData.refresh_token) {
      console.log("🔐 No refresh token available");
      console.error("🔐 FORCED LOGOUT - No refresh token available - User needs to re-authenticate");
      this.logout();
      return null;
    }

    const newTokenData = await this.api.refreshAccessToken(tokenData.refresh_token);

    if (newTokenData) {
      this.tokenManager.saveToken(newTokenData);
      console.log("🔐 Token refreshed successfully");
      return newTokenData.access_token;
    }

    console.error("🔐 FORCED LOGOUT - Token refresh failed - User needs to re-authenticate");
    this.logout();
    return null;
  }

  // Generar clave de cache basada en el archivo
  private getCacheKey (filePath: string): string {
    return `${SHOPPING_LIST_CACHE_KEYS.REMOTE_CACHE_PREFIX}${filePath.replace(/[^a-zA-Z0-9]/g, "_").toUpperCase()}`;
  }

  // Método mejorado con sincronización en background
  public async getFile (filePath: string): Promise<{
    data: any | null;
    fromCache: boolean;
    syncHandler?: (onUpdate: (data: any) => void, onSyncStatusChange: (isSyncing: boolean) => void) => void;
  }> {
    console.log(`📁 SessionService: Getting file ${filePath}...`);

    // 1. Obtener del cache inmediatamente
    const cachedData = this.getLocalFile(this.getCacheKey(filePath));

    if (cachedData) {
      console.log(`📁 SessionService: File ${filePath} found in cache`);

      // Si hay cache y estoy autenticado, proporcionar handler de sync
      if (this.isAuthenticated()) {
        return {
          data: cachedData,
          fromCache: true,
          syncHandler: (onUpdate, onSyncStatusChange) => {
            this.performBackgroundSync(filePath, onUpdate, onSyncStatusChange);
          }
        };
      }

      return {
        data: cachedData,
        fromCache: true
      };
    }

    // 2. Si no hay cache, cargar de remoto solo si está autenticado
    if (!this.isAuthenticated()) {
      console.log(`📁 SessionService: Not authenticated, returning null for ${filePath}`);
      return {
        data: null,
        fromCache: false
      };
    }

    // Cargar de remoto
    try {
      console.log(`📁 SessionService: Loading ${filePath} from Dropbox...`);
      const accessToken = await this.ensureValidToken();
      if (!accessToken) {
        return { data: null, fromCache: false };
      }

      const remoteData = await this.fileManager.getFile(accessToken, filePath);

      if (remoteData) {
        // Guardar en cache local
        this.setLocalFile(this.getCacheKey(filePath), remoteData);
        console.log(`📁 SessionService: ${filePath} loaded and cached`);
        return { data: remoteData, fromCache: false };
      }
    } catch (error) {
      console.error(`📁 SessionService: Error loading ${filePath}:`, error);
    }

    return { data: null, fromCache: false };
  }

  // Force fetch from Dropbox and override local cache immediately
  public async forceRemoteFetch (filePath: string): Promise<any | null> {
    console.log(`📁 SessionService: Force fetching ${filePath} from Dropbox...`);

    if (!this.isAuthenticated()) {
      console.warn("📁 SessionService: Not authenticated, cannot force fetch.");
      return null;
    }

    try {
      const accessToken = await this.ensureValidToken();
      if (!accessToken) {
        return null;
      }

      const remoteData = await this.fileManager.getFile(accessToken, filePath);
      // Guardar en cache local siempre, incluso si es null para limpiar estados corruptos
      this.setLocalFile(this.getCacheKey(filePath), remoteData);
      console.log(`📁 SessionService: Force fetched and cached ${filePath}`);
      return remoteData;
    } catch (error) {
      console.error(`📁 SessionService: Force fetch error for ${filePath}:`, error);
      return null;
    }
  }

  // Sincronización en background basada en metadata
  private async performBackgroundSync (
    filePath: string,
    onUpdate: (data: any) => void,
    onSyncStatusChange: (isSyncing: boolean) => void
  ): Promise<void> {
    console.log(`📁 SessionService: Starting background sync for ${filePath}...`);
    onSyncStatusChange(true);

    try {
      const accessToken = await this.ensureValidToken();
      if (!accessToken) {
        onSyncStatusChange(false);
        return;
      }
      console.log(`📁 SessionService: Changes detected, downloading ${filePath}...`);
      const remoteData = await this.fileManager.getFile(accessToken, filePath);
      onUpdate(remoteData);
    } catch (error) {
      console.error(`📁 SessionService: Background sync error for ${filePath}:`, error);
    } finally {
      onSyncStatusChange(false);
    }
  }

  // Simplified updateFile - fire-and-forget, NO optimistic update aquí
  public updateFile (filePath: string, data: any) {
    console.log(`📁 SessionService: Fire-and-forget update for ${filePath}...`);
    let promise;
    // Background sync (no await para el caller)
    if (this.isAuthenticated()) {
      promise = this.backgroundSync(filePath, data);
    }
    return promise;
  }

  // Background sync sin bloquear al caller
  private async backgroundSync (filePath: string, data: any): Promise<void> {
    try {
      const accessToken = await this.ensureValidToken();
      if (!accessToken) {
        console.log(`📁 SessionService: Cannot sync ${filePath} - no valid token`);
        return;
      }

      const success = await this.fileManager.updateFile(accessToken, filePath, data);

      if (success) {
        console.log(`📁 SessionService: Background sync successful for ${filePath}`);
      } else {
        console.error(`📁 SessionService: Background sync failed for ${filePath}`);
      }
    } catch (error) {
      console.error(`📁 SessionService: Background sync error for ${filePath}:`, error);
    }
  }

  public async deleteFile (filePath: string): Promise<boolean> {
    console.log(`📁 SessionService: Deleting file ${filePath}...`);

    // Limpiar cache local inmediatamente
    this.clearCache(this.getCacheKey(filePath));

    if (!this.isAuthenticated()) {
      console.log(`📁 SessionService: Not authenticated, only local cache cleared for ${filePath}`);
      return true;
    }

    try {
      const accessToken = await this.ensureValidToken();
      if (!accessToken) {
        return true; // Cache ya limpiado, no podemos acceder a Dropbox
      }

      const success = await this.fileManager.deleteFile(accessToken, filePath);
      console.log(`📁 SessionService: ${filePath} ${success ? "deleted successfully" : "delete failed"} from Dropbox`);
      return success;
    } catch (error) {
      console.error(`📁 SessionService: Error deleting ${filePath} from Dropbox:`, error);
      return true; // Cache ya limpiado, error en Dropbox no crítico
    }
  }

  // Start OAuth flow
  async startAuth (): Promise<void> {
    return this.authService.startAuth();
  }

  // Handle OAuth callback
  async handleCallback (code: string): Promise<boolean> {
    const codeVerifier = localStorage.getItem("dropbox_code_verifier");

    if (!codeVerifier) {
      console.log("No code verifier found, review if token was already saved");
      return true;
    }

    const tokenData = await this.api.exchangeCodeForToken(code, codeVerifier);

    if (tokenData) {
      this.tokenManager.saveToken(tokenData);
      localStorage.removeItem("dropbox_code_verifier");
      // Ensure fixed app folder exists at root on first auth
      try {
        await this.api.ensureAppFolder(tokenData.access_token);
      } catch (e) {
        console.error('📁 ensureAppFolder after auth failed:', e);
      }
      return true;
    }

    return false;
  }

  // Check if user is authenticated
  isAuthenticated (): boolean {
    return this.tokenManager.hasToken();
  }

  // Expose a method to obtain a fresh access token (no refresh token exposure)
  async getAccessToken (): Promise<string | null> {
    return this.ensureValidToken();
  }

  // Logout
  logout (): void {
    this.tokenManager.clearToken();
    // Clear ALL session cache on logout
    this.clearLocalCache("DROPBOX_FILE_");
  }
}

export default SessionService;
