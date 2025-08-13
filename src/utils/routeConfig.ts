// Route configuration for static vs dynamic pages
export const STATIC_ROUTES = [
  '/',
  '/blog',
  '/explore',
  '/support'
] as const;

export const DYNAMIC_ROUTES = [
  '/favorites',
  '/shopping-lists',
  '/camera',
  '/recipes',
  '/auth/callback'
] as const;

// Routes that require parameters but should be pre-rendered
export const PARAMETRIZED_STATIC_ROUTES = [
  '/blog/:slug',
  '/legal/:slug',
  '/product/:productSlug'
] as const;

export type StaticRoute = typeof STATIC_ROUTES[number];
export type DynamicRoute = typeof DYNAMIC_ROUTES[number];
export type ParametrizedStaticRoute = typeof PARAMETRIZED_STATIC_ROUTES[number];

export const isStaticRoute = (pathname: string): boolean => {
  // Check exact static routes
  if (STATIC_ROUTES.includes(pathname as StaticRoute)) {
    return true;
  }
  
  // Check parametrized static routes
  return PARAMETRIZED_STATIC_ROUTES.some(route => {
    const routePattern = route.replace(/:[\w]+/g, '[^/]+');
    const regex = new RegExp(`^${routePattern}$`);
    return regex.test(pathname);
  });
};

export const isDynamicRoute = (pathname: string): boolean => {
  return !isStaticRoute(pathname);
};