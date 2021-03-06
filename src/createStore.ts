import { createContext, useContext } from "react";
import { useObserveContext, createObserveContext } from "./observe";
import { Reducer } from "./types";
export interface Store<S> {
  useState(nextObserveState?: (keyof S)[]): S;
  useDispatch(): (action: any, callback?: () => void) => void;
}

export interface PrivateStore<S> {
  useState(nextObserveState?: (keyof S)[]): S;
  useDispatch(): (action: any, callback?: () => void) => void;
  stateContext: React.Context<S>;
  dispatchContext: React.Context<(action: any, callback?: () => void) => void>;
  reducer: Reducer<S>;
  initialState: S;
}

/**
 * This function give you an store, use that in your components which want to
 * connect to store and provider
 */
export const createStore = <T extends { [x: string]: any }>({
  reducer,
  initialState,
}: {
  reducer: Reducer<T>;
  initialState: T;
}): Store<T> => {
  const stateContext = createObserveContext(initialState);
  const dispatchContext = createContext<(action: any, callback?: any) => void>(
    () => {},
  );

  const store: PrivateStore<T> = {
    stateContext,
    dispatchContext,
    reducer,
    initialState,
    useState: (nextObserveState?: (keyof T)[]): T => {
      return useObserveContext(stateContext, nextObserveState);
    },
    useDispatch: () => useContext(dispatchContext),
  };

  return store as Store<T>;
};
