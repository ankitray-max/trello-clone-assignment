import { DragItem } from '../DragItem';

// Action creators:

export const addTask = (
  text: string,
  listId: string,
  description?: string,
  dueDate?: string
): AddTaskAction => ({
  type: "ADD_TASK",
  payload: {
    text,
    listId,
    description,   // 👈 MUST be here
    dueDate        // 👈 MUST be here
  }
});
export const addList = (text: string): Action => {
  return {
    type: "ADD_LIST",
    payload: text
  }
}

export const moveList = (draggedId: string, hoverId: string): Action => {
  return {
    type: "MOVE_LIST",
    payload: { draggedId, hoverId }
  }
}

export const moveTask = (
  draggedItemId: string,
  hoveredItemId: string | null,
  sourceColumnId: string,
  targetColumnId: string
): Action => {
  return {
    type: "MOVE_TASK",
    payload: { draggedItemId, hoveredItemId, sourceColumnId, targetColumnId }
  }
}

export const setDraggedItem = (draggedItem: DragItem | null): Action => {
  return {
    type: "SET_DRAGGED_ITEM",
    payload: draggedItem
  }
} 
export const deleteTask = (id: string, listId: string): DeleteTaskAction => ({
  type: "DELETE_TASK",
  payload: { id, listId }
});

export const updateTaskTitle = (id: string, title: string): UpdateTaskTitleAction => ({
  type: "UPDATE_TASK_TITLE",
  payload: { id, title }
});
// Action types:

interface AddListAction {
  type: "ADD_LIST";
  payload: string;
}

type AddTaskAction = {
  type: "ADD_TASK";
  payload: {
    text: string;
    listId: string;
    description?: string;
    dueDate?: string;
  };
};

interface MoveListAction {
  type: "MOVE_LIST";
  payload: { draggedId: string, hoverId: string }
}

interface MoveTaskAction {
  type: "MOVE_TASK";
  payload: { 
    draggedItemId: string;
    hoveredItemId: string | null;
    sourceColumnId: string;
    targetColumnId: string;
  }
}

interface SetDraggedItemAction {
  type: "SET_DRAGGED_ITEM";
  payload: DragItem | null
}
type UpdateTaskDescriptionAction = {
  type: "UPDATE_TASK_DESCRIPTION";
  payload: {
    id: string;
    description: string;
  };
};
type DeleteTaskAction = {
  type: "DELETE_TASK";
  payload: { id: string; listId: string };
};

type ToggleTaskAction = {
  type: "TOGGLE_TASK";
  payload: { id: string };
};
type ToggleMemberAction = {
  type: "TOGGLE_MEMBER";
  payload: {
    taskId: string;
    member: { id: number; name: string };
  };
};
type ToggleLabelAction = {
  type: "TOGGLE_LABEL";
  payload: {
    taskId: string;
    label: { id: number; name: string; color: string };
  };
};
type SetStateAction = {
  type: "SET_STATE";
  payload: {
    lists: any[];
    draggedItem: any;
  };
};
type UpdateTaskTitleAction = {
  type: "UPDATE_TASK_TITLE";
  payload: { id: string; title: string };
};
 // type Action will resolve to one of the given types:
export type Action =
  | AddListAction
  | AddTaskAction
  | MoveListAction
  | MoveTaskAction
  | SetDraggedItemAction
  | UpdateTaskDescriptionAction
  | DeleteTaskAction
  | UpdateTaskTitleAction
  | ToggleMemberAction
  | ToggleLabelAction
  | SetStateAction
  | ToggleTaskAction;