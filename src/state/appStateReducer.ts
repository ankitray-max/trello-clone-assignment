import { Action } from './actions';
import { nanoid } from 'nanoid';
import { findItemIndexById, moveItem } from '../utils/arrayUtils';
import { DragItem } from '../DragItem';

export const appStateReducer = (draft: AppState, action: Action): AppState | void => {
  switch (action.type) {

    case "ADD_LIST": {
      draft.lists.push({
        id: nanoid(),
        text: action.payload,
        tasks: []
      });
      break;
    }

    case "ADD_TASK": {
      const { text, listId, description, dueDate } = action.payload;

      const targetListIndex = findItemIndexById(draft.lists, listId);

      draft.lists[targetListIndex].tasks.push({
        id: nanoid(),
        text,
        description: description ? description : "",
        dueDate: dueDate ? dueDate : undefined,
        labels: [],
        completed: false,
        members: []
      });

      break;
    }

    case "MOVE_LIST": {
      const { draggedId, hoverId } = action.payload;
      const dragIndex = findItemIndexById(draft.lists, draggedId);
      const hoverIndex = findItemIndexById(draft.lists, hoverId);
      draft.lists = moveItem(draft.lists, dragIndex, hoverIndex);
      break;
    }

    case "UPDATE_TASK_TITLE": {
      const { id, title } = action.payload;

      draft.lists.forEach(list => {
        const task = list.tasks.find(t => t.id === id);
        if (task) {
          task.text = title;
        }
      });

      break;
    }

    case "UPDATE_TASK_DESCRIPTION": {
      const { id, description } = action.payload;

      draft.lists.forEach(list => {
        const task = list.tasks.find(t => t.id === id);
        if (task) {
          task.description = description;
        }
      });

      break;
    }

    case "TOGGLE_TASK": {
      const { id } = action.payload;

      draft.lists.forEach(list => {
        const task = list.tasks.find(t => t.id === id);
        if (task) {
          task.completed = !task.completed;
        }
      });

      break;
    }

    case "TOGGLE_MEMBER": {
      const { taskId, member } = action.payload;

      draft.lists.forEach(list => {
        const task = list.tasks.find(t => t.id === taskId);
        if (task) {
          if (!task.members) task.members = [];

          const exists = task.members.find(m => m.id === member.id);

          if (exists) {
            task.members = task.members.filter(m => m.id !== member.id);
          } else {
            task.members.push(member);
          }
        }
      });

      break;
    }

    case "MOVE_TASK": {
      const { draggedItemId, hoveredItemId, sourceColumnId, targetColumnId } = action.payload;
      const sourceListIndex = findItemIndexById(draft.lists, sourceColumnId);
      const targetListIndex = findItemIndexById(draft.lists, targetColumnId);
      const dragIndex = findItemIndexById(draft.lists[sourceListIndex].tasks, draggedItemId);
      const hoverIndex = hoveredItemId
        ? findItemIndexById(draft.lists[targetListIndex].tasks, hoveredItemId)
        : 0;

      const item = draft.lists[sourceListIndex].tasks[dragIndex];
      draft.lists[sourceListIndex].tasks.splice(dragIndex, 1);
      draft.lists[targetListIndex].tasks.splice(hoverIndex, 0, item);
      break;
    }

    case "TOGGLE_LABEL": {
      const { taskId, label } = action.payload;

      draft.lists.forEach(list => {
        const task = list.tasks.find(t => t.id === taskId);
        if (task) {
          if (!task.labels) task.labels = [];

          const exists = task.labels.find(l => l.id === label.id);

          if (exists) {
            task.labels = task.labels.filter(l => l.id !== label.id);
          } else {
            task.labels.push(label);
          }
        }
      });

      break;
    }

    case "DELETE_TASK": {
      const { id, listId } = action.payload;
      const listIndex = findItemIndexById(draft.lists, listId);

      draft.lists[listIndex].tasks = draft.lists[listIndex].tasks.filter(
        task => task.id !== id
      );

      break;
    }

    case "SET_DRAGGED_ITEM": {
      draft.draggedItem = action.payload;
      break;
    }

    // ✅🔥 ADD THIS (CRITICAL FIX)
    case "SET_STATE": {
      return {
        lists: action.payload.lists || [],
        draggedItem: null
      };
    }

    default: {
      break;
    }
  }
};

export type Task = {
  id: string;
  text: string;
  description?: string;
  dueDate?: string;
  labels?: { id: number; name: string; color: string }[];
  completed?: boolean;
  members?: { id: number; name: string }[];
};

export type List = {
  id: string;
  text: string;
  tasks: Task[];
};

export type AppState = {
  lists: List[];
  draggedItem: DragItem | null;
};