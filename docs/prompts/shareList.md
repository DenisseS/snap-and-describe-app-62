Perfecto. Con tus respuestas, preparo un ADR detallado y un plan ejecutable de implementación, optimizando para mínimo código y máxima reutilización de tu arquitectura actual (SessionService + Remote/LocalShoppingListProvider + SW Queue). Incluyo riesgos, alternativas y pruebas.

ADR: Compartir listas de compras Dropbox entre cuentas (Alice ↔ Bob) con edición colaborativa y deep-link de aceptación
- Estado: Propuesto
- Fecha: 2025-08-12
- Decisores: Equipo Nutri Scan
- Contexto
    - Arquitectura actual:
        - Persistencia en Dropbox vía SessionService (DropboxAPI/DropboxFileManagerService + TokenManager) con cache local y “background sync” basado en metadatos.
        - Providers de listas: LocalShoppingListProvider y RemoteShoppingListProvider. El remoto:
            - Lee/escribe user-shopping-lists.json (metadatos) y shopping-list-{id}.json (contenido).
            - Sincroniza vía SessionService.getFile(...).syncHandler y sube snapshots con la cola del SW ('shopping-lists').
        - Cola en SW (public/sw/queue.js) + procesador Dropbox (public/sw/dropbox.js) que sube shopping-list-{id}.json a Dropbox con overwrite.
        - Pathing actual: DropboxAPI y SW usan una carpeta fija “/NutriInfo” como “namespace” para archivos:
            - /NutriInfo/user-shopping-lists.json
            - /NutriInfo/shopping-list-{id}.json
    - Objetivo:
        - Alice comparte su lista (archivo en Dropbox) con Bob (otra cuenta). Bob edita con su propio token (file members) el mismo archivo y puede haber una tercera persona que comparte la lista con Alice y Bob.
        - Flujo de compartir: Modal de compartir → enqueue en SW (invitar por email usando la API de Dropbox) → generar un “Nutri Scan URL” (deep link) → Bob abre el link, autentica si hace falta, se registra la referencia a la lista remota en su perfil y se navega al detalle (sin polling).
        - Sincronización bidireccional: cambios de Bob se reflejan en Alice y viceversa mediante el mecanismo de sync/snapshots existente y del detalle de la lista de compras.
        - Restricciones: Bob no puede borrar la lista compartida, solo “desvincular”. Alice puede revocar miembros. Si Alice borra el archivo, Bob es notificado y se elimina la referencia.
    - Alcance de permisos Dropbox:
        - La app ya está configurada como “Full Dropbox” (no App Folder).
        - Se añadirán scopes sharing.read y sharing.write.
        - Nota sobre paths: Aunque ya no usamos el “App Folder” permission, seguir usando una carpeta “/NutriInfo”, revisa la constante APP_FOLDER_PATH donde esta el app en la raíz como namespace reduce cambios (mínimo código) y mantiene compatibilidad.

Decisión
- Persistencia y paths
    - Mantendremos el namespace “/NutriInfo” como carpeta en la raíz del Dropbox (no es App Folder permission, solo una carpeta). Esto minimiza cambios en DropboxAPI.buildDropboxPath y en el procesador del SW.
- Modelo de datos (metadatos)
    - En user-shopping-lists.json
        - Unificamos listas locales y remotas en el mismo objeto shoppingLists.
        - Nuevos campos por lista:
            - origin: 'local' | 'remote'
            - shared: boolean (derivado: sharedWith?.length > 0)
            - sharedWith?: string[] (solo en listas de dueño)
            - syncRef?: { path: string; fileId?: string; ownerEmail?: string }
        - Listas remotas (en el perfil de Bob) incluirán origin='remote' + syncRef.path (p. ej., '/shopping-list-.json'). y campos que sea necesario para poder identificar/modificar/syncronizar con la lista remota.
- Compartir e invitaciones
    - Alice añade miembros vía “add_file_member” (Dropbox Sharing API). Esto se hará  mediante una nueva cola del SW “dropbox-sharing”.
    - Modal ShareListModal: ver miembros actuales (list_file_members), añadir por email (enqueue invitar), revocar (enqueue remove_file_member).
    - Generación de “Nutri Scan URL”: deep link interno (ej., /share/accept?listId=...&path=/shopping-list-...&owner=alice@example.com). Se muestra para copiar/enviar a Bob.
- Aceptación del enlace
    - Nueva ruta /share/accept:
        - Si Bob no está autenticado, lo guiamos a login y, tras login, continuamos.
        - Registra la referencia remota en su user-shopping-lists.json: crea entrada con id=listId, origin='remote', syncRef.path=..., ownerEmail.
        - Navega automáticamente a /shopping-lists/{listId}.
- Sincronización y edición
    - El RemoteShoppingListProvider:
        - Para getListData/list snapshots: si la lista tiene origin='remote' y syncRef.path, usará ese path; si no, usa el prefijo default.
        - En colas de subida (snapshots): sigue usando 'shopping-lists' con resourceKey = listId, y en el procesador, construye path con el syncRef.path si existe, o el default.
    - Sin polling: se utiliza el sync handler ya existente (SessionService.performBackgroundSync).
- Borrado y desvinculación
    - Bob no puede delete: verá opción “Desvincular”. Implementa: eliminar su entrada de shoppingLists y limpiar caché local.
    - Si el archivo no existe o se revocó acceso:
        - Al sincronizar/forzar refresh: si 409/403 → mostrar modal “La lista compartida fue eliminada o el acceso fue revocado” y eliminar la referencia de shoppingLists y caché local.
    - Alice sí puede borrar su lista; el efecto en Bob será el modal anterior al siguiente sync.
- Seguridad y privacidad
    - Riesgo de exponer file_id en el deep link:
        - file_id no es secreto por sí mismo y no otorga acceso sin token Dropbox válido ni membresía. No es adivinable (no secuencial).
        - Datos sensibles en el link: owner email. Podemos opcionalmente omitir ownerEmail del link y resolverlo desde Dropbox tras aceptación si lo prefieres. excluir.
    - El deep link no expone tokens ni rutas físicas internas de Dropbox fuera del namespace previsto.


Diseño detallado

1) Cambios de modelo y tipos
- src/types/shoppingList.ts
    - Extender interface ShoppingList:
        - origin?: 'local' | 'remote'
        - shared?: boolean
        - sharedWith?: string[]
        - syncRef?: { path: string; fileId?: string; ownerEmail?: string }
- Estructura de user-shopping-lists.json (perfil del usuario)
    - {
      "shoppingLists": {
      "": {
      "id": "",
      "name": "...",
      "description": "...",
      "createdAt": "...",
      "updatedAt": "...",
      "itemCount": 12,
      "completedCount": 4,
      "order": 0,
      "origin": "local" | "remote",
      "shared": true | false,
      "sharedWith": ["bob@example.com"],        // solo dueño
      "syncRef": {
      "path": "/shopping-list-.json",
      "fileId": "id:xxxx",                    // opcional
      "ownerEmail": "alice@example.com"       // opcional en Bob
      }
      }
      }
      }

2) Dropbox API (nuevas capacidades)
- src/services/dropbox/DropboxAPI.ts
    - Nuevos métodos:
        - addFileMember({ accessToken, file, email, access_level='editor' })
            - POST /2/sharing/add_file_member con { file, members: [{ member: { '.tag': 'email', email }, access_level }] }
        - listFileMembers({ accessToken, file })
            - POST /2/sharing/list_file_members con { file }
        - removeFileMember({ accessToken, file, email })
            - POST /2/sharing/remove_file_member_2 con { file, member: { '.tag': 'email', email }, leave_a_copy: false }
- src/services/dropbox/DropboxFileManagerService.ts
    - Mantener lectura/escritura JSON como hasta ahora (reusar).
    - Añadir métodos thin wrappers para llamar DropboxAPI sharing.* (o crear DropboxSharingService pequeño si prefieres).
- Scopes y reauth:
    - src/services/dropbox/DropboxAuthService.ts (startAuth): añadir scopes sharing.read y sharing.write. Los usuarios deberán reautenticar.

3) Service Worker: nueva cola “dropbox-sharing”
- public/sw/dropbox.js
    - Registrar processor 'dropbox-sharing'.
        - Acciones soportadas: { type: 'invite', path, email } → add_file_member
          { type: 'remove', path, email } → remove_file_member
    - Adaptar el processor 'shopping-lists':
        - Si hay syncRef.path para ese listId (lo enviaremos en payload opcional), usarlo en lugar del default.
    - Mantener APP_FOLDER_PATH='/NutriInfo' y construir path por defecto: `${APP_FOLDER_PATH}/shopping-list-${id}.json`.

4) Providers y SessionService
- RemoteShoppingListProvider
    - getListData / saveListData:
        - Antes de construir el path por defecto, buscar el metadato de la lista (getListsDetails) y, si existe origin='remote' y syncRef.path, usar ese path en:
            - Lectura: this.sessionService.getFile(syncRef.path)
            - Fuerza refresh: sessionService.forceRemoteFetch(syncRef.path)
            - Borrado (solo dueño): sessionService.deleteFile(syncRef.path)
        - En el enqueue para snapshots:
            - QueueClient.enqueue('shopping-lists', listId, data) sin cambios; el processor resolverá path (si lo incluimos en payload o consultará un “mapa por listId” en metadatos; mínimo código: incluir en payload extra 'path' si origin='remote').
- SessionService
    - Sin cambios de interfaz pública.
    - Fallback de lectura (opcional): Si getFile('/NutriInfo/...') '. toast diciendo lista no encontrado (no olvidar traducciones).

5) UI/UX
- ShoppingListsPage
    - Añadir badge “Remota” (origin='remote') en las tarjetas.
    - Icono de “Compartida” si sharedWith?.length > 0 en listas del dueño.
- ShoppingListDetailPage
    - Botón “Compartir” junto a “Forzar actualización” → abre ShareListModal.
    - Para Bob en listas remotas: ocultar “Eliminar”; mostrar “Desvincular” con modal de confirmación.
    - Si durante sincronización forzada/normal detectamos 409/403 (archivo eliminado o acceso revocado), mostrar modal y eliminar referencia.
- ShareListModal (nuevo)
    - Lista miembros actuales (list_file_members).
    - Campo email para añadir → enqueue('dropbox-sharing', resourceKey=listId, payload={ type:'invite', path, email }).
    - Botón de copiar “Nutri Scan URL” construida localmente: /share/accept?listId=...&path=...&owner=...
    - Eliminar miembro → enqueue('dropbox-sharing', ..., { type:'remove', path, email }).
- ShareAcceptPage (nuevo)
    - Lee query params (listId, path, owner).
    - Si no autenticado, redirige a login; tras login, vuelve y registra referencia:
        - Lee user-shopping-lists.json → agrega lista si no existe: origin='remote', syncRef.path=path, syncRef.ownerEmail=owner; inicializa counts en 0.
        - Guarda y navega a /shopping-lists/{listId}.

6) Flujos de error y estados
- Invitación en cola:
    - La invitación puede tardar. El deep link funcionará y registrará la referencia, pero la primera lectura del archivo podría fallar hasta que Dropbox procese la membresía o hasta que la cola procese (si está offline).
    - UX: mensaje en detalle “Esperando permisos del propietario, intenta Forzar actualización más tarde”.
- Borrado o revocación por Alice:
    - En Bob: al próximo sync/force refresh → 409/403. Modal “La lista compartida fue eliminada por su propietaria o se revocó el acceso” y se borra la referencia local.
- Desvincular (Bob):
    - No borra el archivo. Solo elimina su entrada en user-shopping-lists y limpia caché local.

7) Seguridad
- file_id en URL:
    - No lo necesitamos para el mínimo código (usamos path). Si se quisiera agregar, el riesgo es bajo: no otorga acceso sin token Dropbox y membresía. Aún así, si prefieres, omitimos file_id del deep link.
- ownerEmail en URL:
    - No es crítico. Podemos omitirlo si lo prefieres; lo mantenemos opcional.

10) Métricas y observabilidad
- Logs existentes (🛒, 📁, SW Queue) ya ayudan. Añadir prefijos en el nuevo processor 'dropbox-sharing' y en ShareListModal para trazar user flows.




participant AliceApp as Alice App
participant SW as Service Worker
participant Dropbox as Dropbox API
participant BobApp as Bob App

    AliceApp->>AliceApp: Abrir ShareListModal
    AliceApp->>SW: enqueue('dropbox-sharing', {invite, path, email:bob})
    SW->>Dropbox: POST /2/sharing/add_file_member(file=path, bob@...)
    AliceApp->>AliceApp: Genera deep link /share/accept?listId&path&owner
    AliceApp->>Bob: Comparte URL por cualquier canal

    Bob->>BobApp: Abre /share/accept?listId&path&owner
    BobApp->>BobApp: Si no autenticado → login
    BobApp->>Dropbox: (N/A en registro) Guardar en user-shopping-lists.json referencia remota
    BobApp->>BobApp: Navega a /shopping-lists/{listId}
    BobApp->>Dropbox: getFile(path) (puede fallar si invitación no aplicada aún)
    Dropbox-->>BobApp: 200 (cuando ya tiene permisos) o 409/403 (antes)


Riesgo de seguridad al usar file_id en el deep link
- Qué es file_id: identificador opaco (“id:xxx”) no secuencial.
- Riesgo principal: divulgación de un identificador no sensible. Sin un token y permisos, no se puede leer ni modificar el archivo.
- Mitigación:
    - No necesario incluirlo; usamos path.
    - Si se incluye, no otorga acceso. Opcionalmente evitar ownerEmail o hashearlo en el query string si quieres menor exposición.


1) Backend de Dropbox (cliente y SW)
    - Añadir scopes sharing.read, sharing.write en DropboxAuthService.startAuth y preparar reauth.
    - DropboxAPI: métodos addFileMember, listFileMembers, removeFileMember.
    - SW: registrar 'dropbox-sharing' con acciones invite/remove; asegurar processor 'shopping-lists' soporta path explícito cuando el payload lo incluya.
    - Mantener APP_FOLDER_PATH='/NutriInfo'; opcional: fallback lectura sin prefijo en providers.
2) Modelo de datos y Providers
    - Extender ShoppingList con origin, shared, sharedWith, syncRef.
    - RemoteShoppingListProvider: resolver path por lista (syncRef.path si origin='remote'); en enqueue de snapshots incluir path en payload si origin='remote'.
    - Manejo de errores 409/403 en forceRefresh/get para listas remotas: mostrar modal y eliminar referencia.
3) UI
    - Badge “Remota” en ShoppingListsPage (origin='remote'); icono “Compartida” si sharedWith?.length>0.
    - ShoppingListDetailPage: botón “Compartir” (abre ShareListModal); para Bob, reemplazar “Eliminar” por “Desvincular” con modal.
    - ShareListModal: listar miembros (list_file_members), invitar por email (enqueue invite), revocar (enqueue remove), botón “Copiar enlace”.
4) Ruta de aceptación
    - Nueva página /share/accept: autenticación si aplica; registrar entrada en user-shopping-lists.json con origin='remote' + syncRef.path; navegar a detalle.
5) QA y pruebas
    - Tests unitarios DropboxAPI (sharing).
    - Tests e2e: compartir→aceptar; edición bidireccional; desvincular; borrado/revocación; offline.
6) Despliegue y reauth
    - Publicar; forzar reauth para compartir; comunicar a usuarios.

Implement the plan