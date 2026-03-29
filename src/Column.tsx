import { ColumnContainer, ColumnTitle } from './styles';
import React, { FC, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { AddNewItem } from './AddNewItem';
import { useAppState } from './state/AppStateContext';
import { Card } from './Card';
import { addTask, moveList, moveTask, setDraggedItem } from './state/actions';
import { useItemDrag } from './utils/useItemDrag'
import { isHidden } from './utils/isHidden'
import { DragItem, CardDragItem } from './DragItem';

// Represents one group of tasks.
// Contains a task list and an option to add a new task.
export const Column: FC<ColumnProps> = ({ text, id, isPreview }: ColumnProps) => {
  const { draggedItem, getTasksByListId, dispatch } = useAppState();
  const tasks = getTasksByListId(id);
  const ref = useRef<HTMLDivElement>(null);
  const { drag } = useItemDrag({ type: "COLUMN", id, text });

  const [, drop] = useDrop({
    accept: ['COLUMN', 'CARD'],
    hover(item: DragItem) {
      if (item.type === 'COLUMN') {
        if (!draggedItem) return;
        if (draggedItem.type === "COLUMN") {
          if (draggedItem.id === id) return;
          dispatch(moveList(draggedItem.id, id));
        }
      } else {
        const cardDraggedItem = draggedItem as CardDragItem;
        if (cardDraggedItem.columnId === id) return;
        if (tasks.length) return;
        dispatch(moveTask(cardDraggedItem.id, null, cardDraggedItem.columnId, id));
        dispatch(setDraggedItem({ ...cardDraggedItem, columnId: id }));
      }
    }
  });

  drag(drop(ref));

  return (
    // We need a ref to specify the drag target. We know it will be a div element.
    // We manually provide HTMLDivElement type to useRef call, then provide it
    // as ref prop to ColumnContainer.
    <ColumnContainer 
  title={text}   // 👈 ADD THIS
  isPreview={isPreview} 
  ref={ref} 
  isHidden={isHidden(draggedItem, "COLUMN", id, isPreview)}
>
      <ColumnTitle>{text}</ColumnTitle>
      
      {tasks.map((task) => {
  return (
    <Card 
  id={task.id} 
  columnId={id} 
  text={task.text}
  description={task.description}
  dueDate={task.dueDate} 
  labels={task.labels} 
  members={task.members}   
  completed={task.completed}  
  key={task.id} 
/>
  );
})}
      <AddNewItem 
        toggleButtonText='+ Add another task'
        onAdd={(text, description, dueDate) =>dispatch(addTask(text, id, description, dueDate))}
  dark
/>
    </ColumnContainer>
  );
}

type ColumnProps = {
  text: string;
  id: string;
  isPreview?: boolean;
}