import { ShoppingList, ShoppingListData } from "@/types/shoppingList";
import SessionService from "@/services/SessionService";
import { GenericShoppingListProvider } from "./GenericShoppingListProvider";
import { SHOPPING_LIST_CACHE_KEYS } from "@/constants/cacheKeys";

export class LocalShoppingListProvider extends GenericShoppingListProvider {
  constructor (sessionService: SessionService) {
    super(sessionService);
  }

  protected async getListsDetails (): Promise<{ lists: Record<string, ShoppingList> }> {
    const data = this.sessionService.getLocalFile(SHOPPING_LIST_CACHE_KEYS.LOCAL_SHOPPING_LISTS);
    return data || { lists: {} };
  }

  protected async saveListsDetails (metadata: { lists: Record<string, ShoppingList> }): Promise<void> {
    this.sessionService.setLocalFile(SHOPPING_LIST_CACHE_KEYS.LOCAL_SHOPPING_LISTS, metadata);
  }

  protected async getListData (listId: string): Promise<ShoppingListData | null> {
    return this.sessionService.getLocalFile(`${SHOPPING_LIST_CACHE_KEYS.LOCAL_LIST_DATA_PREFIX}${listId}`);
  }

  protected async saveListData (listId: string, data: ShoppingListData): Promise<void> {
    this.sessionService.setLocalFile(`${SHOPPING_LIST_CACHE_KEYS.LOCAL_LIST_DATA_PREFIX}${listId}`, data);
  }

  protected async createListData (listId: string, data: ShoppingListData): Promise<void> {
    await this.saveListData(listId, data);
  }

  protected async deleteListData (listId: string): Promise<void> {
    this.sessionService.clearCache(`${SHOPPING_LIST_CACHE_KEYS.LOCAL_LIST_DATA_PREFIX}${listId}`);
  }
}
