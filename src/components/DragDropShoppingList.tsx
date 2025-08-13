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
import { CheckCircle2, Circle, Edit3, Info, Trash2, GripVertical } from 'lucide-react';
import { ShoppingListItem } from '@/types/shoppingList';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import useDndSensors from '@/hooks/useDndSensors';

interface DragDropShoppingListProps {
  items: ShoppingListItem[];
  onToggleItem: (itemId: string) => void;
  onEditItem: (item: ShoppingListItem) => void;
  onRemoveItem: (itemId: string) => void;
  onProductLinkClick: (productId: string) => void;
  onReorder: (itemIds: string[]) => void;
  isProcessing: boolean;
  showCompleted?: boolean;
}

interface SortableItemProps {
  item: ShoppingListItem;
  onToggleItem: (itemId: string) => void;
  onEditItem: (item: ShoppingListItem) => void;
  onRemoveItem: (itemId: string) => void;
  onProductLinkClick: (productId: string) => void;
  isProcessing: boolean;
  isDragging?: boolean;
}

const SortableItem: React.FC<SortableItemProps> = ({
  item,
  onToggleItem,
  onEditItem,
  onRemoveItem,
  onProductLinkClick,
  isProcessing,
  isDragging = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCurrentlyDragging = isDragging || isSortableDragging;
  const isCompleted = item.purchased;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center justify-between p-3 rounded-lg transition-all duration-200 border
        ${isCurrentlyDragging 
          ? 'shadow-lg bg-white border-blue-300 scale-105 z-50' 
          : isCompleted
            ? 'hover:bg-gray-50 opacity-75 border-gray-100 bg-white'
            : 'hover:bg-gray-50 border-gray-100 bg-white hover:shadow-md cursor-grab active:cursor-grabbing'
        }
      `}
      {...attributes}
    >
      <div className="flex items-center space-x-3 flex-1">
        {/* Drag Handle */}
        <div
          {...listeners}
          className={`
            flex items-center justify-center w-6 h-6 rounded cursor-grab active:cursor-grabbing touch-none select-none
            ${isCurrentlyDragging 
              ? 'text-blue-600' 
              : isCompleted 
                ? 'text-gray-400 hover:text-gray-500'
                : 'text-gray-400 hover:text-gray-600'
            }
            transition-colors duration-200
          `}
        >
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Checkbox */}
        <button
          onClick={() => onToggleItem(item.id)}
          className={`
            transition-colors duration-200
            ${isCompleted 
              ? 'text-green-600 hover:text-gray-400' 
              : 'text-gray-400 hover:text-green-600'
            }
          `}
          disabled={isProcessing}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>

        {/* Item Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`font-medium ${isCompleted ? 'text-gray-600' : 'text-gray-900'}`}>
              {item.name}
            </span>
            {item.quantity && (
              <span className={`text-sm px-2 py-1 rounded ${
                isCompleted 
                  ? 'text-gray-400 bg-gray-50' 
                  : 'text-gray-500 bg-gray-100'
              }`}>
                {item.quantity} {item.unit || ''}
              </span>
            )}
            {/* Product Link Icon */}
            {item.productId && item.slug && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onProductLinkClick(item.productId!)}
                    className={`transition-colors p-1 ${
                      isCompleted 
                        ? 'text-blue-400 hover:text-blue-600' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    <Info className="h-5 w-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver detalles del producto</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {item.notes && (
            <p className={`text-sm mt-1 ${isCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
              {item.notes}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-1">
        <button
          onClick={() => onEditItem(item)}
          className="text-gray-400 hover:text-blue-600 transition-colors p-1"
          disabled={isProcessing}
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button
          onClick={() => onRemoveItem(item.id)}
          className="text-gray-400 hover:text-red-600 transition-colors p-1"
          disabled={isProcessing}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const DragDropShoppingList: React.FC<DragDropShoppingListProps> = ({
  items,
  onToggleItem,
  onEditItem,
  onRemoveItem,
  onProductLinkClick,
  onReorder,
  isProcessing,
  showCompleted = false
}) => {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const sensors = useDndSensors();

  const filteredItems = items.filter(item => showCompleted ? item.purchased : !item.purchased);
  const activeItem = activeId ? items.find(item => item.id === activeId) : null;

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
      const oldIndex = filteredItems.findIndex(item => item.id === active.id);
      const newIndex = filteredItems.findIndex(item => item.id === over.id);
      
      const reorderedItems = arrayMove(filteredItems, oldIndex, newIndex);
      const allItemIds = items.map(item => {
        const reorderedItem = reorderedItems.find(r => r.id === item.id);
        return reorderedItem ? item.id : item.id;
      });
      
      // Create the full ordered list: reordered section + other section
      const reorderedIds = reorderedItems.map(item => item.id);
      const otherIds = items
        .filter(item => showCompleted ? !item.purchased : item.purchased)
        .map(item => item.id);
      
      const finalOrder = showCompleted 
        ? [...otherIds, ...reorderedIds] 
        : [...reorderedIds, ...otherIds];
      
      onReorder(finalOrder);
    }

    setActiveId(null);
  }

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={filteredItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              onToggleItem={onToggleItem}
              onEditItem={onEditItem}
              onRemoveItem={onRemoveItem}
              onProductLinkClick={onProductLinkClick}
              isProcessing={isProcessing}
            />
          ))}
        </div>
      </SortableContext>
      
      <DragOverlay>
        {activeItem ? (
          <SortableItem
            item={activeItem}
            onToggleItem={onToggleItem}
            onEditItem={onEditItem}
            onRemoveItem={onRemoveItem}
            onProductLinkClick={onProductLinkClick}
            isProcessing={isProcessing}
            isDragging={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DragDropShoppingList;