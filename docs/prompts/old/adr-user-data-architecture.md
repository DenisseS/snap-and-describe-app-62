
# ADR: Arquitectura Centralizada de Datos de Usuario y Autenticación

**Estado:** Aceptado  
**Fecha:** 2025-01-XX  
**Contexto:** Sistema de gestión de datos de usuario con Dropbox como backend  

## Resumen Ejecutivo

Se implementó una arquitectura centralizada para el manejo de datos de usuario que combina autenticación OAuth, gestión de caché inteligente y sincronización de datos con enfoque cache-first. Esta arquitectura establece patrones reutilizables para futuras extensiones como favoritos y alérgenos.

## Contexto y Problemática

### Problema Original
- Múltiples componentes accedían directamente a `DropboxService` creando acoplamiento
- Falta de cache consistente causaba llamadas redundantes a la API
- Estados de sincronización dispersos y difíciles de manejar
- Ausencia de optimistic updates generaba UX lenta
- Limpieza de datos inconsistente en login/logout

### Requerimientos Clave
1. **Performance**: Acceso instantáneo a datos del usuario
2. **Consistencia**: Single source of truth para datos de usuario
3. **Escalabilidad**: Arquitectura extensible para nuevos tipos de datos
4. **Robustez**: Manejo de errores con rollback automático
5. **UX**: Sincronización invisible para el usuario

## Decisión Arquitectónica

### 1. Patrón de Capas Centralizado

```
┌─────────────────────────────────────┐
│           UI Components             │
├─────────────────────────────────────┤
│          useUserData Hook           │
├─────────────────────────────────────┤
│        UserDataContext              │
├─────────────────────────────────────┤
│        UserDataService              │
├─────────────────────────────────────┤
│     Cache Layer (localStorage)      │
├─────────────────────────────────────┤
│         DropboxService              │
└─────────────────────────────────────┘
```

### 2. Estados de Sincronización Simplificados

**DataSyncState** (5 estados en lugar de 8+):
- `IDLE`: Sin datos, sin actividad
- `CACHED`: Datos en cache, sin sync activo
- `SYNCING`: Cache disponible + sync en background
- `UPDATING`: Update optimista en progreso
- `ERROR`: Error con rollback aplicado

**Principio**: Menos estados = menor complejidad cognitiva y menos bugs

### 3. Estrategia Cache-First

```typescript
// Patrón implementado
const getUserProfile = async () => {
  1. Obtener del cache inmediatamente
  2. Si existe y es fresco (< 5min) → Retornar
  3. Si existe pero obsoleto → Retornar + Background sync
  4. Si no existe → Fetch remoto + Cache
}
```

**Beneficios**:
- UX instantáneo (cache primero)
- Sync invisible (usuario no ve spinners)
- Freshness configurable por tipo de dato

### 4. Autenticación Centralizada

**DropboxAuthContext** como único punto de verdad:
- Maneja estado de autenticación (`AuthState`)
- Integra con `UserDataService` para limpieza automática
- Provee instancia única de `DropboxService`

**Integración con Datos**:
```typescript
// Cleanup automático en transiciones de auth
useEffect(() => {
  if (authState === AuthState.AUTHENTICATED) {
    // Login exitoso → Limpiar cache + Cargar datos frescos
    UserDataService.clearUserCache();
    loadUserProfile();
  } else if (authState === AuthState.IDLE) {
    // Logout → Limpiar cache + Reset estado
    UserDataService.clearUserCache();
    resetUserState();
  }
}, [authState]);
```

### 5. Optimistic Updates con Rollback

**Flujo de Actualización**:
1. Update optimista en estado local
2. Persistir en cache inmediatamente
3. Sync remoto en background
4. Si falla → Rollback automático + Toast de error
5. Si éxito → Confirmar estado

**Implementación**:
```typescript
const updateUserProfile = async (profile) => {
  // 1. Optimistic update
  setState({ profile, state: UPDATING });
  
  // 2. Backup para rollback
  const backup = getCachedData();
  
  // 3. Remote sync
  const success = await remoteUpdate(profile);
  
  if (!success) {
    // 4. Rollback automático
    setState({ profile: backup.data, state: ERROR });
    showErrorToast();
  }
};
```

## Principios de Diseño Implementados

### 1. **Separation of Concerns**
- **UI**: Solo renderizado y eventos de usuario
- **Context**: Gestión de estado reactivo
- **Service**: Lógica de negocio y cache
- **API**: Comunicación con Dropbox

### 2. **Single Responsibility**
- `UserDataService`: Solo manejo de datos de usuario
- `DropboxAuthContext`: Solo autenticación
- `useUserData`: Solo interface con UI
- `DropboxService`: Solo comunicación API

### 3. **Inversión of Control**
- Servicios se inyectan vía Context
- Componentes dependen de abstracciones
- Fácil testing y mocking

### 4. **Cache Consistency**
- Prefijos estandardizados (`USER_`, `DROPBOX_`)
- Timestamps para validación de freshness
- Cleanup automático en transiciones de auth

### 5. **Error Handling**
- Rollback automático en updates
- Toast notifications consistentes
- Logs estructurados para debugging

## Patrones de Extensibilidad

### Para Favoritos (Próxima Implementación)

```typescript
// Estructura preparada
interface UserFavorite {
  id: string;
  state: 'like' | 'dislike';
  timestamp: number;
}

// Métodos ya planificados
const getUserFavorites = async (): Promise<UserFavorite[]>
const updateFavorite = async (productId: string, state: 'like' | 'dislike')
const getFavoriteState = (productId: string): 'like' | 'dislike' | null
```

### Para Alérgenos

```typescript
// Estructura preparada
interface UserAllergy {
  allergenId: string;
  enabled: boolean;
  timestamp: number;
}

// Métodos ya planificados
const getUserAllergies = async (): Promise<string[]>
const updateAllergy = async (allergenId: string, enabled: boolean)
const hasAllergy = (allergenId: string): boolean
```

## Implementación Técnica

### Cache Layer
```typescript
// Configuración centralizada
const CACHE_FRESHNESS_MS = 5 * 60 * 1000; // 5 minutos
const CACHE_KEYS = {
  USER_PROFILE: 'USER_PROFILE',
  USER_FAVORITES: 'USER_FAVORITES',
  USER_ALLERGIES: 'USER_ALLERGIES'
};
```

### State Management
```typescript
// Estado unificado
interface UserDataState {
  profile: UserProfile | null;
  profileState: DataSyncState;
  // Extensible para futuros datos
  favorites?: UserFavorite[];
  favoritesState?: DataSyncState;
}
```

### API Integration
```typescript
// Integración con Dropbox
class UserDataService {
  private dropboxService: DropboxService;
  
  setDropboxService(service: DropboxService) {
    this.dropboxService = service;
  }
  
  // Métodos que usan la instancia inyectada
}
```

## Beneficios Conseguidos

### Performance
- **Tiempo de respuesta**: 0ms para datos en cache
- **Requests reducidos**: Solo refresh cuando es necesario
- **UX fluido**: No spinners en operaciones frecuentes

### Mantenibilidad
- **Código centralizado**: Un lugar para lógica de datos
- **Tipos consistentes**: TypeScript en toda la pila
- **Testing**: Mocking fácil por capas separadas

### Escalabilidad
- **Nuevos datos**: Solo agregar al enum y métodos
- **Nuevos backends**: Solo cambiar la implementación del service
- **Nuevos features**: Reutilizar patrones existentes

## Riesgos y Mitigaciones

### Riesgo: Cache Stale
- **Mitigación**: Timestamps y freshness configurable
- **Fallback**: Background sync siempre activo

### Riesgo: Conflictos de Datos
- **Mitigación**: Remote wins siempre
- **Principio**: Simplicity over complexity

### Riesgo: Errores de Sync
- **Mitigación**: Rollback automático + User feedback
- **Logging**: Structured logs para debugging

## Conclusiones

Esta arquitectura establece una base sólida para el manejo de datos de usuario con los siguientes logros:

1. **Rendimiento óptimo** con cache-first strategy
2. **Código mantenible** con separation of concerns
3. **Arquitectura extensible** para favoritos y alérgenos
4. **UX consistente** con optimistic updates
5. **Robustez** con manejo de errores automático

Los patrones implementados pueden replicarse para cualquier nuevo tipo de dato de usuario, manteniendo consistencia y calidad en toda la aplicación.

## Referencias

- Implementación: `src/services/UserDataService.ts`
- Context: `src/contexts/UserDataContext.tsx`
- Hook: `src/hooks/useUserData.ts`
- Tipos: `src/types/userData.ts`
