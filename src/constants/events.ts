export const USER_PROFILE_EVENTS = {
  UPDATED: 'profile-updated',
  SYNC_START: 'profile-sync-start',
  SYNC_END: 'profile-sync-end',
  ERROR: 'profile-error'
} as const;

export type UserProfileEvent = typeof USER_PROFILE_EVENTS[keyof typeof USER_PROFILE_EVENTS];
