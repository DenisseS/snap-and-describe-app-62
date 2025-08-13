
# ADR: PWA Implementation for NutriScan

## Status
Accepted

## Context
NutriScan is a mobile-first nutrition scanning application that requires offline functionality, fast loading times, and native-like user experience. The application needs to work seamlessly across different devices and network conditions while maintaining up-to-date content.

## Decision
We have implemented a comprehensive PWA (Progressive Web App) solution with the following key components:

### 1. Service Worker Strategy
- **Simplified Network-First Strategy**: All requests (except static images) use network-first approach
    - Always attempts to fetch from network first to ensure fresh content
    - Updates cache with every successful network response
    - Falls back to cache only when network fails
    - Ensures users always get the latest content when online
- **Cache-First for Static Assets**: Only images and rarely-changing static assets use cache-first
- **Versioning System**: Implemented semantic versioning (v4) that only increments when SW logic changes
- **Legacy Cleanup**: Aggressive cleanup of old service workers and caches to prevent conflicts
- **Health Monitoring**: Built-in health check system for SW integrity verification

### 3. Install Prompt Management
- **Smart Prompting**: Only shows install prompt for new users after engagement
- **Platform-specific Instructions**: Tailored installation steps for iOS, Android, and Desktop
- **State Management**: Persistent tracking of installation status across sessions

### 4. Offline Capabilities
- **Network-First with Cache Fallback**: Ensures fresh content when online, fallback when offline
- **Background Sync**: Queues actions when offline for later synchronization
- **Graceful Degradation**: App remains functional with cached content when network fails

## Mobile-First Approach
The implementation prioritizes mobile experience through:
- **Standalone Display Mode**: Removes browser UI for native-like experience
- **Portrait Orientation Lock**: Optimized for mobile usage patterns
- **Touch-Optimized Navigation**: Bottom navigation for thumb-friendly access
- **Simplified Caching Strategy**: Reduces complexity while ensuring fresh content
- **Offline-First Mindset**: Core functionality works without network connectivity

## Service Worker Behavior
The current SW implementation (v4) follows these principles:

1. **Installation Phase**:
    - Caches critical static assets immediately
    - Uses `skipWaiting()` to activate immediately
    - Precaches essential static resources

2. **Activation Phase**:
    - Aggressively removes old caches (including legacy ones without versioning)
    - Attempts to unregister conflicting service workers
    - Takes immediate control with `clients.claim()`
    - Notifies clients of successful update

3. **Fetch Handling**:
    - **Network-First for Dynamic Content**: All HTML, JS, CSS, API requests use network-first
        - Always attempts network first
        - Updates cache with successful responses
        - Falls back to cache when network fails
    - **Cache-First for Static Images**: Only images and icons use cache-first for efficiency
    - **Simplified Logic**: Removed complex hybrid strategies for better maintainability

4. **Update Management**:
    - Version-aware updates (only when SW logic changes)
    - Client notification system for update status
    - Force update capability for critical fixes
    - Health check endpoint for debugging

## Implementation Details

### Key Files:
- `public/sw.js`: Main service worker with simplified caching logic
- `src/hooks/useServiceWorkerUpdates.ts`: React hook for SW lifecycle management
- `src/hooks/usePWA.ts`: Main PWA functionality hook
- `src/hooks/usePWAState.ts`: Install state management
- `src/components/PWAInstallPrompt.tsx`: Install prompt UI component
- `public/manifest.json`: PWA manifest configuration

### Caching Strategy:
- **Network-First**: HTML, CSS, JS, API calls, navigation components
    - Ensures content freshness when online
    - Automatic cache updates with successful network responses
    - Cache fallback for offline scenarios
- **Cache-First**: Images and static icons only
    - Reduces bandwidth for rarely-changing assets
    - Improves loading speed for visual assets

### Offline Strategy:
- All dynamic content attempts network first, falls back to cache
- Static assets serve from cache for immediate loading
- Background sync for deferred actions
- Graceful fallbacks for missing resources

## Consequences

### Positive:
- **Content Freshness**: Users always get the latest content when online
- **Better User Experience**: Simplified strategy reduces complexity and potential issues
- **Reduced Conflicts**: Aggressive cleanup prevents legacy SW issues
- **Maintainable**: Clear, simple caching logic is easier to debug and maintain
- **Mobile Optimized**: Tailored for mobile-first usage patterns
- **Reliable Updates**: Version-aware updates prevent unnecessary cache invalidation

### Negative:
- **Slightly Higher Network Usage**: Network-first approach may increase data usage
- **Initial Load Dependency**: First-time loads require network connectivity
- **Storage Usage**: Cache still consumes device storage (but cleaned regularly)

### Monitoring:
- Service worker version tracking
- Network request success/failure rates
- Cache hit/miss ratios for different asset types
- Installation success rates
- Update completion rates

## Implementation Status
- ✅ Service Worker with simplified network-first strategy
- ✅ Version management and legacy cleanup
- ✅ PWA install prompt system
- ✅ Offline functionality for cached content
- ✅ Mobile-first manifest configuration
- ✅ Health monitoring and debugging tools

## Next Steps
1. Monitor network usage and cache performance
2. Implement user feedback collection for PWA experience
3. Consider selective pre-caching for critical user paths
4. Evaluate adding push notification capabilities
5. Optimize cache storage limits and cleanup policies
