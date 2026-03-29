import React, { createContext, useContext, useReducer, useEffect, useRef } from "react";
import { appStateReducer, AppState } from "./appStateReducer";
import { Action } from "./actions";
import { load, save } from "../api";
import produce from "immer";

type AppStateContextProps = {
  lists: AppState["lists"];
  draggedItem: AppState["draggedItem"];
  dispatch: React.Dispatch<Action>;
  getTasksByListId(id: string): any[];
};

const AppStateContext = createContext<AppStateContextProps>(
  {} as AppStateContextProps
);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [state, dispatch] = useReducer(
    produce(appStateReducer),
    {
      lists: [],
      draggedItem: null
    }
  );

  // ✅ LOAD data from backend
  useEffect(() => {
    const fetchData = async () => {
      const data = await load();
      dispatch({ type: "SET_STATE", payload: data });
    };
    fetchData();
  }, []);

  // 🔥 FIX: prevent save on first load
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return; // 🚫 skip first render
    }

    //save(state as AppState);
  }, [state]);

  const getTasksByListId = (listId: string) => {
    return (state as AppState).lists.find(list => list.id === listId)?.tasks || [];
  };

  return (
    <AppStateContext.Provider
      value={{
        lists: (state as AppState).lists,
        draggedItem: (state as AppState).draggedItem,
        dispatch,
        getTasksByListId
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  return useContext(AppStateContext);
};