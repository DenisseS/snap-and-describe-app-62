import React from 'react';
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ShoppingCart, Calendar, Trash2, GripVertical } from 'lucide-react';
import { ShoppingList } from '@/types/shoppingList';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useTranslation } from 'react-i18next';
import useDndSensors from '@/hooks/useDndSensors';

interface DragDropShoppingListsPageProps {
  lists: Record<string, ShoppingList>;
  onListClick: (listId: string) => void;
  onDeleteList: (listId: string) => void;
  onReorder: (listIds: string[]) => void;
  isDeleting: string | null;
  formatDate: (dateString: string) => string;
}

interface SortableListItemProps {
  list: ShoppingList;
  listId: string;
  onListClick: (listId: string) => void;
  onDeleteList: (listId: string) => void;
  isDeleting: string | null;
  formatDate: (dateString: string) => string;
  isDragging?: boolean;
}

const SortableListItem: React.FC<SortableListItemProps> = ({
  list,
  listId,
  onListClick,
  onDeleteList,
  isDeleting,
  formatDate,
  isDragging = false
}) => {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: listId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCurrentlyDragging = isDragging || isSortableDragging;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white rounded-lg p-4 shadow-sm border border-gray-200 transition-all duration-200
        ${isCurrentlyDragging 
          ? 'shadow-lg border-blue-300 scale-105 z-50' 
          : 'hover:shadow-md hover:border-gray-300 cursor-grab active:cursor-grabbing'
        }
      `}
      {...attributes}
    >
      <div className="flex items-center justify-between">
        {/* Drag Handle */}
        <div
          {...listeners}
          className={`
            flex items-center justify-center w-6 h-6 rounded cursor-grab active:cursor-grabbing mr-3 touch-none select-none
            ${isCurrentlyDragging 
              ? 'text-blue-600' 
              : 'text-gray-400 hover:text-gray-600'
            }
            transition-colors duration-200
          `}
        >
          <GripVertical className="h-4 w-4" />
        </div>

        <div 
          className="flex-1 cursor-pointer"
          onClick={() => onListClick(listId)}
        >
          <h3 className="font-semibold text-gray-900 mb-1">{list.name}</h3>
          {list.description && (
            <p className="text-sm text-gray-600 mb-2">{list.description}</p>
          )}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <ShoppingCart className="h-3 w-3" />
              <span>{list.itemCount || 0} {t('items', 'artículos')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(list.updatedAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <div className="text-sm font-medium text-green-600">
              {list.completedCount || 0}/{list.itemCount || 0}
            </div>
            <div className="text-xs text-gray-500">
              {t('completed', 'completados')}
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={isDeleting === listId}
              >
                {isDeleting === listId ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('deleteList', 'Eliminar Lista')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('deleteListConfirmation', '¿Estás seguro de que deseas eliminar esta lista de compras? Esta acción no se puede deshacer.')}
                  <br />
                  <br />
                  <strong>{list.name}</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('cancel', 'Cancelar')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDeleteList(listId)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {t('delete', 'Eliminar')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

const DragDropShoppingListsPage: React.FC<DragDropShoppingListsPageProps> = ({
  lists,
  onListClick,
  onDeleteList,
  onReorder,
  isDeleting,
  formatDate
}) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const sensors = useDndSensors();

  const listEntries = Object.entries(lists);
  
  const ordered = listEntries
  .filter(([, l]) => typeof l.order === 'number')
  .sort(([, a], [, b]) => (a.order! - b.order!));
  const unordered = listEntries.filter(([, l]) => typeof l.order !== 'number');
  const sortedListEntries = [...ordered, ...unordered];
  
  const activeList = activeId ? lists[activeId] : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id !== over.id) {
      const listIds = sortedListEntries.map(([listId]) => listId);
      const oldIndex = listIds.findIndex(id => id === active.id);
      const newIndex = listIds.findIndex(id => id === over.id);
      
      const reorderedIds = arrayMove(listIds, oldIndex, newIndex);
      onReorder(reorderedIds);
    }

    setActiveId(null);
  }

  if (sortedListEntries.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortedListEntries.map(([listId]) => listId)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {sortedListEntries.map(([listId, list]) => (
            <SortableListItem
              key={listId}
              list={list}
              listId={listId}
              onListClick={onListClick}
              onDeleteList={onDeleteList}
              isDeleting={isDeleting}
              formatDate={formatDate}
            />
          ))}
        </div>
      </SortableContext>
      
      <DragOverlay>
        {activeList && activeId ? (
          <SortableListItem
            list={activeList}
            listId={activeId}
            onListClick={onListClick}
            onDeleteList={onDeleteList}
            isDeleting={isDeleting}
            formatDate={formatDate}
            isDragging={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DragDropShoppingListsPage;