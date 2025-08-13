# Fix Shopping Lists Multiple Merge Issue

## Problem
The `getFile` method was being called 3 times per page reload when opening shopping lists. This was caused by the merge operation in `useShoppingLists.ts` being triggered multiple times due to the `useEffect` dependency on `[authState, sessionService]`.

## Root Cause
- The `useShoppingLists.ts` hook had a `useEffect` that called `service.mergeLocalListsWithRemote()` every time `authState` or `sessionService` changed
- The `AuthContext.tsx` already had the merge logic in `refreshUserInfo()` function  
- This caused duplicate merge operations on every page reload

## Solution
1. **Removed intentional error** in `App.tsx` (line 22)
2. **Simplified useShoppingLists.ts useEffect** to only call `loadLists()` when authenticated or idle
3. **Kept merge logic centralized** in `AuthContext.tsx` where it belongs

## Code Changes

### src/App.tsx
- Removed the throw error statement

### src/hooks/useShoppingLists.ts
- Removed the merge logic from the useEffect
- Simplified to only load lists when auth state changes
- Merge now happens only once in AuthContext after successful authentication

## Effect on App
- **Performance improvement**: Eliminates redundant merge operations
- **Cleaner architecture**: Centralized merge logic in AuthContext
- **Better user experience**: Faster page loads without multiple API calls
- **Follows requirements**: No boolean states used, merge happens once per authentication

## Technical Details
- The merge operation now happens only in `AuthContext.refreshUserInfo()` after successful authentication
- The `useShoppingLists` hook simply loads the lists without attempting to merge
- This ensures the merge happens exactly once per authentication session, not on every page reload