# Plan de Mejoras UX - Product Search Dropdown

## Análisis de Requerimientos

### 1. Handle Enter key in product search
**Problema**: Al presionar Enter en el input de búsqueda, se debería comportar igual que hacer click en un producto
**Acción**: Añadir handleKeyDown que seleccione el primer resultado o crear custom item

### 2. Make button always visible
**Problema**: El botón de añadir en el dropdown solo aparece en hover
**Acción**: Hacer los botones siempre visibles con opacity normal

### 3. Fix focus on modal close
**Problema**: Al cerrar modal, no retorna focus al input de búsqueda
**Acción**: Añadir data-search-input al input y focus después de cerrar modal

### 4. Add hover effect to item rows
**Problema**: Falta feedback visual en hover de las filas
**Acción**: Añadir sombra sutil en hover a toda la fila

### 5. Modal focus on save button
**Problema**: Al abrir modal, debería hacer focus en botón guardar
**Acción**: Añadir prop focusOnSave a BaseEditModal

## Plan de Implementación

### Paso 1: Remover error bloqueante
- Limpiar src/main.tsx

### Paso 2: Mejorar ProductSearchDropdown
- Añadir handleKeyDown para Enter
- Hacer botones siempre visibles (remover opacity-0)
- Añadir data-search-input al input
- Añadir hover effect a filas

### Paso 3: Mejorar BaseEditModal
- Añadir props focusOnSave y onAfterClose
- Implementar auto-focus en save button
- Implementar callback después de cerrar

### Paso 4: Integrar cambios en ShoppingListDetailPage
- Usar nuevas props del modal
- Implementar focus return al input

## Archivos a Modificar
1. `src/main.tsx` - Remover error
2. `src/components/ProductSearchDropdown.tsx` - UX improvements  
3. `src/components/BaseEditModal.tsx` - Focus management
4. `src/pages/ShoppingListDetailPage.tsx` - Integration

## Testing Plan
- Verificar Enter key funciona
- Verificar botones siempre visibles
- Verificar hover effects
- Verificar focus management
- Verificar modal focus en save button