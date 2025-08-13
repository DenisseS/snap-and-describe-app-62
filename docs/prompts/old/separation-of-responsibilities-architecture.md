# Arquitectura de Separación de Responsabilidades (SSAR)

## Resumen de Cambios Implementados

### 🎯 Objetivo Principal
Eliminar las 4+ llamadas duplicadas a `getUserInfo` y establecer una arquitectura limpia con responsabilidades bien definidas.

## ✅ Cambios Realizados

### 1. Unificación de Tipos
- **ELIMINADO**: Tipo `UserInfo` de `dropbox-auth.ts`
- **UNIFICADO**: Solo se usa `UserProfile` como tipo unificado
- **REFACTORIZADO**: UserDataService ahora maneja solo UserProfile
- **ELIMINADO**: Transformaciones innecesarias entre tipos

### 2. Creación de UserDataContext
- **NUEVO**: `src/contexts/UserDataContext.tsx` dedicado exclusivamente a datos de usuario
- **MIGRADO**: Responsabilidades de datos de usuario desde AuthContext
- **OPTIMIZADO**: Una sola fuente de verdad para perfil de usuario
- **IMPLEMENTADO**: Carga optimizada - una sola llamada por sesión de autenticación

### 3. Refactorización de AuthContext
- **REDUCIDO**: AuthContext ahora solo maneja tokens, login/logout, authState
- **ELIMINADO**: Carga de datos de usuario de AuthContext (ahora en UserDataContext)
- **MANTENIDO**: Coordinación simple - AuthContext notifica cambios de estado
- **CONSERVADO**: Merge de shopping lists después de autenticación exitosa

### 4. Optimización de Hooks
- **CREADO**: `useUserData` como hook principal para consumir UserDataContext
- **DEPRECADO**: `useUserProfile` ahora es un wrapper de compatibilidad
- **ELIMINADO**: useEffect problemático con dependencias circulares
- **SIMPLIFICADO**: UserDataContext maneja la coordinación basada en authState

### 5. Limpieza y Optimización
- **ELIMINADO**: Código duplicado y transformaciones innecesarias
- **OPTIMIZADO**: Dependencias de useEffect reducidas
- **VERIFICADO**: No hay dependencias circulares
- **MANTENIDO**: Todas las funcionalidades existentes (incluyendo merge de recetas)

## 🔄 Flujo Optimizado Implementado

### Antes (4+ llamadas a getUserInfo):
1. AuthContext.refreshUserInfo() → getUserInfo()
2. useUserProfile.loadProfile() → getUserProfile() → getUserInfo()
3. Componente X.useEffect() → getUserInfo()
4. Componente Y.useEffect() → getUserInfo()

### Después (1 llamada por sesión):
1. Usuario se autentica → AuthContext.refreshUserInfo() → getUserInfo() (ÚNICA LLAMADA)
2. AuthContext transforma a UserProfile y actualiza userInfo
3. UserDataContext recibe userInfo y lo expone como profile
4. useUserData consume desde UserDataContext (sin llamadas adicionales)
5. Actualizaciones van a través de UserDataContext → se propagan a todos los consumidores

## 🏗️ Arquitectura Resultante

```
AuthContext (Solo autenticación)
├── authState: AuthState
├── userInfo: UserProfile (transformado de getUserInfo)
├── sessionService: SessionService
└── login/logout/refreshUserInfo

UserDataContext (Solo datos de usuario)
├── profile: UserProfile (recibido de AuthContext.userInfo)
├── state: DataState
├── updateProfile()
├── refetch()
└── clearCache()

Hooks/Componentes
├── useAuth() → Para estado de autenticación
├── useUserData() → Para datos de usuario
└── useUserProfile() → Wrapper de compatibilidad (deprecado)
```

## 📊 Beneficios Logrados

### Performance
- **4+ llamadas** → **1 llamada** a getUserInfo por sesión
- Eliminación de dependencias circulares en useEffect
- Arquitectura más simple y predecible
- Mejor performance y menos re-renders

### Mantenibilidad
- Responsabilidades claramente separadas
- AuthContext: solo autenticación
- UserDataContext: solo datos de usuario
- Código más fácil de entender y mantener

### Funcionalidad Preservada
- ✅ Merge de shopping lists mantenido
- ✅ Updates optimistas mantenidos
- ✅ Sistema de eventos reactivo mantenido
- ✅ Manejo de errores con rollback mantenido
- ✅ Cache management mantenido

## 🔧 Migración para Desarrolladores

### Para usar datos de usuario:
```typescript
// ❌ Antes (deprecado)
import { useUserProfile } from '@/hooks/useUserProfile';
const { profile, state, update } = useUserProfile();

// ✅ Ahora (recomendado)
import { useUserData } from '@/hooks/useUserData';
const { profile, state, updateProfile } = useUserData();
```

### Para autenticación:
```typescript
// ✅ Sin cambios
import { useAuth } from '@/contexts/AuthContext';
const { authState, login, logout } = useAuth();
```

## 🎉 Resultado Final

La arquitectura SSAR ha eliminado exitosamente las llamadas duplicadas mientras mantiene toda la funcionalidad existente. El código es ahora más eficiente, mantenible y tiene una separación de responsabilidades clara.