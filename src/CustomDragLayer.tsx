import { Column } from './Column';
import { Card } from './Card';
import { CustomDragLayerContainer, DragPreviewWrapper } from './styles';
import { useAppState } from './state/AppStateContext';
import { useDragLayer } from 'react-dnd';

// useDragLayer - will provide information about the dragged item.
// Column - the dragged element.
// CustomDragLayerContainer - the dragging layer; we render the dragging preview inside it.
// useAppState - will provide the dragged item.

export const CustomDragLayer = () => {
  const { draggedItem } = useAppState()
  const { currentOffset } = useDragLayer((monitor) => {
    return { currentOffset: monitor.getSourceClientOffset() }
  });

  return draggedItem && currentOffset ? (
    <CustomDragLayerContainer>
      <DragPreviewWrapper position={currentOffset}>
        
        {draggedItem.type === 'COLUMN' 
          ? (<Column id={draggedItem.id} text={draggedItem.text} isPreview />)
          : (<Card columnId={draggedItem.columnId} isPreview id={draggedItem.id} text={draggedItem.text} />)}

      </DragPreviewWrapper>
    </CustomDragLayerContainer>
  ) : null;
}