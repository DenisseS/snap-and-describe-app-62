- cuando escriba PING, responde con la menor cantidad de tokens posible, si puedes usar 0,01 o menos mucho mejor.

Luego cuando estes implementado codigo, ten en cuenta lo siguiente:
- Si haces un refactor y dejas cosas deprecadas, no parar el refactor hasta eliminar todas los lugares donde ya no se deberia usar el metodo deprecado
- Alguna pregunta sobre el plan, que cosas añadirias o que quitarías? Hay mejores metodologias
- Evitar a toda costa conjunto de booleanos para representar un estado. Avoid boolean states.

- Reutilizar la logica sobre crear una similar (si hay un metodo que suma 2+2, y necesito sumar 3+3 en lugar de crear mi metodo de nuevoSumar, uso el anterio y hago parametrizable los parametros x+y)
- Sigue patrones, si tengo que crear un metodo de borrar y veo un metodo de crear trato de seguir su patron.
- prohibido usar usarMemo
- Evitar usar efectos o use href y si lo usan que no tenga muchas variables que cambie el efecto para evitar dependencias ciclicas
  React Hooks Best Practices
  Minimize useEffect dependencies: Avoid cyclic dependencies by keeping effects simple
  Reduce effect reactivity: Don't make effects dependent on too many variables
  Use: don't overused it, only when we need to fetch something after a user reaction, don't use it while loding page

- Para las cosas async evitar los race condition, no poner cosas que sean tan dependientes de otras, llevar de manera modular el manejo de datos

- Usa el layout y no hagas header custom, todos deberia usar el mismo layout y en caso cada pagina añadir su h1 pero el navigation header reutilizar el layout de la app.

Async Operations & Race Conditions
Modular data handling: Keep async operations independent and modular
Avoid tight coupling: Don't make operations overly dependent on each other
Implement proper error boundaries: Handle errors gracefully with rollback mechanisms
Use optimistic updates: Implement optimistic UI patterns for better UX

Clean imports: Remove unused imports and variables
TypeScript strict: Maintain strict TypeScript configuration
No compilation errors: Always ensure successful builds before completing features
Consistent naming: Use descriptive, consistent naming conventions

Translation management: Add translations for all new user-facing text
Consistent i18n pattern: Follow established translation patterns


Use SessionService when need to CRUD files or cache related with the current sesion, follow the same pattern and reuse this logic (when possible)
Optimistic updates: Update local state immediately, sync in background
Error handling with rollback: Revert to server state on sync failures
Cache management: Intelligent caching with metadata tracking
Authentication handling: Graceful degradation when offline


Development Workflow
Feature completion: Only mark features complete when build succeeds
Documentation updates: Update documentation with each significant change
Change tracking: Maintain detailed change logs in docs/prompts

- Has un resumen al final de los cambios que has hecho y extiende en un docs/prompts con los cambios que has hecho en forma de plan y que efecto tienen en la app.

## Routing Architecture & Static Site Generation

### Route Types
- **Static Routes**: Pre-rendered at build time for SEO (/, /blog, /legal, /explore)
- **Dynamic Routes**: SPA fallback for user features (/favorites, /shopping-lists, /camera, /recipes)

### Adding New Routes - Required Steps:
1. **Route Classification**: Determine if static (public) or dynamic (auth-required)
2. **SEO Integration**: For static routes, add SEOHead component with proper meta tags
3. **Route Config**: Update src/utils/routeConfig.ts with route type
4. **Sitemap**: Static routes auto-added to sitemap.xml via generateSitemap.js
5. **Vercel Config**: Update vercel.json rewrites if needed for static routes
6. **Translation**: Add i18n keys for new routes in src/i18n/
7. **Navigation**: Update navigation components if route should be accessible from menu

### Static Route Template:
```typescript
// For SEO-optimized static pages
import { SEOHead } from '@/components/SEOHead';

const MyStaticPage = () => (
  <>
    <SEOHead 
      title="Page Title"
      description="Page description"
      canonical="/my-route"
      structuredData={generatePageSchema()}
    />
    <Layout>
      <h1>Page Content</h1>
    </Layout>
  </>
);
```

### Build Process:
- `npm run build:static`: Generates sitemap, builds static assets, creates redirects
- Static pages served directly by CDN, dynamic routes fallback to SPA
- All routes maintain existing functionality while improving SEO for public pages

### Environment Configuration (NEW):
All URL-dependent functionality now uses environment variables for deployment flexibility:
- **VITE_SITE_URL**: Base URL for the application (required for production)
- **VITE_CDN_URL**: Optional CDN URL for static assets (defaults to VITE_SITE_URL)
- **VITE_DROPBOX_CLIENT_ID**: Dropbox OAuth client ID

### URL Configuration Pattern:
```typescript
// ❌ WRONG - Hardcoded URLs
const siteUrl = 'https://myapp.com';
const redirectUri = 'https://myapp.com/auth/callback';

// ✅ CORRECT - Use envConfig utilities
import { getSiteUrl, getAuthRedirectUri, getFullUrl } from '@/utils/envConfig';

const siteUrl = getSiteUrl();
const redirectUri = getAuthRedirectUri();
const fullUrl = getFullUrl('/some-path');
```

### Deployment Checklist:
1. Set VITE_SITE_URL in Vercel environment variables
2. Ensure all URL dependencies use envConfig utilities
3. Test sitemap.xml generation with correct URLs
4. Verify OAuth redirects work with environment URL