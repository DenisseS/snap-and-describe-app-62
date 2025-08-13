
import { TokenData } from '../../types/dropbox-auth';

export class TokenManager {
  private tokenData: TokenData | null = null;
  
  constructor() {
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage() {
    const accessToken = localStorage.getItem('dropbox_access_token');
    const refreshToken = localStorage.getItem('dropbox_refresh_token');
    const expiresAt = localStorage.getItem('dropbox_expires_at');
    
    if (accessToken && expiresAt) {
      this.tokenData = {
        access_token: accessToken,
        refresh_token: refreshToken || undefined,
        expires_at: parseInt(expiresAt)
      };
    }
  }

  createTokenData(accessToken: string, refreshToken?: string, expiresIn?: number): TokenData {
    const expiresInSeconds = expiresIn || 14400; // 4 horas por defecto
    const expiresAt = Date.now() + (expiresInSeconds * 1000);
    
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt
    };
  }

  saveToken(tokenData: TokenData) {
    this.tokenData = tokenData;
    localStorage.setItem('dropbox_access_token', tokenData.access_token);
    localStorage.setItem('dropbox_expires_at', tokenData.expires_at.toString());
    
    if (tokenData.refresh_token) {
      localStorage.setItem('dropbox_refresh_token', tokenData.refresh_token);
    }
  }

  clearToken() {
    this.tokenData = null;
    localStorage.removeItem('dropbox_access_token');
    localStorage.removeItem('dropbox_refresh_token');
    localStorage.removeItem('dropbox_expires_at');
    localStorage.removeItem('dropbox_code_verifier');
  }

  getToken(): TokenData | null {
    return this.tokenData;
  }

  // Validar si el token está próximo a caducar (con 5 minutos de margen)
  isTokenExpiringSoon(): boolean {
    if (!this.tokenData) return true;
    
    const now = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutos en milisegundos
    return now >= (this.tokenData.expires_at - bufferTime);
  }

  hasToken(): boolean {
    return !!this.tokenData;
  }
}
