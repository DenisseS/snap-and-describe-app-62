
import { DataState, UserProfile } from '@/types/userData';
import SessionService from './SessionService';
import { UserJsonData } from '@/types/dropbox-auth';
import { USER_PROFILE_EVENTS, UserProfileEvent } from "@/constants/events";

type EventListener = (data?: any) => void;

class UserDataService {
  private static instance: UserDataService;
  private sessionService: SessionService | null = null;
  
  // Constante para el archivo de usuario
  private static readonly USER_FILE_PATH = '/user.json';
  
  // Sistema de eventos reactivo
  private eventListeners: Map<UserProfileEvent, Set<EventListener>> = new Map();

  private constructor() {
    // Inicializar event listeners
    this.eventListeners.set(USER_PROFILE_EVENTS.UPDATED, new Set());
    this.eventListeners.set(USER_PROFILE_EVENTS.SYNC_START, new Set());
    this.eventListeners.set(USER_PROFILE_EVENTS.SYNC_END, new Set());
    this.eventListeners.set(USER_PROFILE_EVENTS.ERROR, new Set());
  }

  public static getInstance(): UserDataService {
    if (!UserDataService.instance) {
      UserDataService.instance = new UserDataService();
    }
    return UserDataService.instance;
  }

  public setDropboxService(service: SessionService): void {
    if (!this.sessionService) {
      this.sessionService = service;
      console.log('📊 UserDataService: SessionService configured');
    }
  }

  // Sistema de eventos
  public addEventListener(event: UserProfileEvent, listener: EventListener): void {
    this.eventListeners.get(event)?.add(listener);
  }

  public removeEventListener(event: UserProfileEvent, listener: EventListener): void {
    this.eventListeners.get(event)?.delete(listener);
  }

  private emitEvent(event: UserProfileEvent, data?: any): void {
    console.log(`📊 UserDataService: Emitting event ${event}`, data);
    this.eventListeners.get(event)?.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`📊 UserDataService: Error in event listener for ${event}:`, error);
      }
    });
  }

  // Método para obtener información del usuario (unificado como UserProfile)
  public async getUserInfo(): Promise<UserProfile | null> {
    console.log('📊 UserDataService: Getting user info...');
    
    if (!this.sessionService) {
      console.log('📊 UserDataService: SessionService not configured');
      return null;
    }

    const result = await this.sessionService.getFile(UserDataService.USER_FILE_PATH);
    
    if (!result.data) {
      // Si no hay archivo, crear uno por defecto
      await this.createDefaultUserFile();
      const newResult = await this.sessionService.getFile(UserDataService.USER_FILE_PATH);
      return this.transformUserJsonToUserProfile(newResult.data);
    }

    return this.transformUserJsonToUserProfile(result.data);
  }

  // Método para actualizar información del usuario
  public async updateUserInfo(userInfo: UserProfile): Promise<boolean> {
    console.log('📊 UserDataService: Updating user info...', userInfo);
    
    if (!this.sessionService) {
      console.log('📊 UserDataService: SessionService not configured');
      return false;
    }

    // Obtener datos actuales para preservar estructura
    const currentResult = await this.sessionService.getFile(UserDataService.USER_FILE_PATH);
    const currentData: UserJsonData = currentResult.data || {
      profile: { name: "Usuario", edad: 30 }
    };

    // Actualizar con nueva información
    const updatedData: UserJsonData = {
      ...currentData,
      profile: {
        ...currentData.profile,
        name: userInfo.name
      },
      allergies: userInfo.allergies,
      favorites: userInfo.favorites
    };

    await this.sessionService.updateFile(UserDataService.USER_FILE_PATH, updatedData);
    return true;
  }

  // Crear archivo de usuario por defecto
  private async createDefaultUserFile(): Promise<void> {
    if (!this.sessionService) return;
    
    const defaultData: UserJsonData = {
      profile: {
        name: "Usuario",
        edad: 30
      }
    };
    
    await this.sessionService.updateFile(UserDataService.USER_FILE_PATH, defaultData);
  }

  // Transformar UserJsonData a UserProfile
  private transformUserJsonToUserProfile(data: UserJsonData): UserProfile {
    return {
      name: data.profile.name,
      allergies: data.allergies || {},
      favorites: data.favorites || {}
    };
  }

  // Método principal para obtener perfil de usuario
  public async getUserProfile(): Promise<{
    data: UserProfile | null;
    state: DataState;
  }> {
    console.log('📊 UserDataService: Getting user profile...');
    
    try {
      const userInfo = await this.getUserInfo();
      
      if (userInfo) {
        const profile: UserProfile = { 
          name: userInfo.name,
          allergies: userInfo.allergies || {},
          favorites: userInfo.favorites || {}
        };
        
        console.log('📊 UserDataService: Profile loaded successfully');
        
        return {
          data: profile,
          state: DataState.READY
        };
      }
    } catch (error) {
      console.error('📊 UserDataService: Error fetching user profile:', error);
    }

    return {
      data: null,
      state: DataState.ERROR
    };
  }

  // Update optimista para perfil completo
  public async updateUserProfile(profile: UserProfile, onUpdate?: (profile: UserProfile) => void): Promise<{
    success: boolean;
    state: DataState;
  }> {
    console.log('📊 UserDataService: Updating profile...', profile);
    
    try {
      this.emitEvent('profile-sync-start');
      
      // Actualizar usando getUserInfo/updateUserInfo (ahora ambos usan UserProfile)
      const userInfo: UserProfile = profile;

      // Emitir evento de actualización optimista
      this.emitEvent(USER_PROFILE_EVENTS.UPDATED, profile);

      const success = await this.updateUserInfo(userInfo);

      if (success) {
        onUpdate?.(profile);
        this.emitEvent('profile-sync-end');
        console.log('📊 UserDataService: Profile updated successfully');
        return { success: true, state: DataState.READY };
      } else {
        await this.handleSyncError(onUpdate);
        return { success: false, state: DataState.ERROR };
      }
    } catch (error) {
      console.error('📊 UserDataService: Error updating user profile:', error);
      await this.handleSyncError(onUpdate);
      return { success: false, state: DataState.ERROR };
    }
  }

  // Manejo de errores con rollback
  private async handleSyncError(onUpdate?: (profile: UserProfile) => void): Promise<void> {
    console.log('📊 UserDataService: Sync failed, pulling real data from Dropbox...');
    
    try {
      const realData = await this.getUserInfo();
      
      if (realData) {
        const realProfile: UserProfile = realData;
        
        this.emitEvent(USER_PROFILE_EVENTS.UPDATED, realProfile);
        this.emitEvent(USER_PROFILE_EVENTS.ERROR, 'Sync failed, rolled back to server data');
        onUpdate?.(realProfile);
        console.log('📊 UserDataService: Rollback completed');
      }
    } catch (pullError) {
      console.error('📊 UserDataService: Error during rollback:', pullError);
      this.emitEvent(USER_PROFILE_EVENTS.ERROR, pullError);
    }
  }

  public clearUserCache(): void {
    console.log('📊 UserDataService: Clearing user data cache...');
    
    const keys = Object.keys(localStorage);
    const userKeys = keys.filter(key => key.startsWith('USER_'));
    
    userKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log(`📊 UserDataService: Cache cleared: ${userKeys.length} keys removed`);
  }
}

export default UserDataService;
