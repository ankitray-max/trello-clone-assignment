import { useState, useEffect, ComponentType } from 'react';
import { AppState } from './state/appStateReducer';
import { load } from './api';

// This is a HOC (Higher Order Component), in which we create factory function
// that accepts a wrapped component as an argument, wraps it into another component
// that implements the desired behavior, then returns the construction.

// Here we want to accept AppStateProvider and inject the initialState prop containing
// loaded data into it. (Injector HOC)

// First we define a type that will represent the props that we are injecting.
type InjectedProps = {
  initialState: AppState;
}

type PropsWithoutInjected<TBaseProps> = Omit<TBaseProps, keyof InjectedProps>

// Then define a function that accepts a WrappedComponent. 
export function withInitialState<TProps>(
  WrappedComponent: ComponentType<PropsWithoutInjected<TProps> & InjectedProps>
) {
  return (props: PropsWithoutInjected<TProps>) => {
    const [initialState, setInitialState] = useState<AppState>({
      lists: [],
      draggedItem: null
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | undefined>();

    useEffect(() => {
      const fetchInitialState = async () => {
        try {
          const data = await load();
          setInitialState({
  lists: data.lists.map((list: any) => ({
    id: String(list.id),              // 👈 FIX TYPE
    text: list.text,
   tasks: list.tasks.map((task: any) => ({
  id: String(task.id),
  text: task.text,
  description: task.description,
  dueDate: task.dueDate,
  labels: task.labels || []  
}))
  })),
  draggedItem: null
});
        } catch (e) {
          setError(e);
        }

        setIsLoading(false);
      }
      
      fetchInitialState()
    }, []);

    if (isLoading) return (<div>Loading</div>); 
    if (error) return (<div>{error.message}</div>);

    return (
      <WrappedComponent {...props} initialState={initialState} />
    );
  }
}