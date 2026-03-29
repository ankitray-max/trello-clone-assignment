import { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { useAppState } from '../state/AppStateContext';
import { DragItem } from '../DragItem';
import { setDraggedItem } from '../state/actions';
import { getEmptyImage } from 'react-dnd-html5-backend';

export const useItemDrag = (item: DragItem) => {
  const { dispatch } = useAppState();
  const [, drag, preview] = useDrag({
    type: item.type, // this is either CARD or COLUMN.
    // When we start dragging, we store the item in our app state
    // by dispatching the setDraggedItem action.
    item: () => {
      dispatch(setDraggedItem(item)); 
      return item;
    },
    // After dragging, we reset draggedItem in the app state to null.
    end: () => dispatch(setDraggedItem(null))
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview]);

  return { drag }
}