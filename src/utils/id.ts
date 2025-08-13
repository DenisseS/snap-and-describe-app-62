export function generateListId(name: string): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substr(2, 4);
  const normalizedName = name
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '')
  .substring(0, 15);

  return `${normalizedName}-${timestamp}-${randomSuffix}`;
}

export function generateItemId(): string {
  return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}