import { __DEV__ } from "./utils";
import { Reducer } from "./types";

const INITIALIZE_STATE_FROM_STORAGE = Symbol();

export const persisterCreator = function persisterCreator(
  Storage: any,
  key: string,
  mapStateToPersist: (state: {}) => any,
) {
  return {
    persist(state: object, action: { type: any }) {
      if (action.type !== INITIALIZE_STATE_FROM_STORAGE) {
        Storage.setItem(
          key,
          JSON.stringify(mapStateToPersist ? mapStateToPersist(state) : state),
        );
      }
    },

    async setToState(storeRef: any) {
      try {
        const storedState = await Storage.getItem(key);

        if (!storedState) {
          return;
        }

        const stateObject = JSON.parse(storedState);

        const { dispatch } = storeRef.current;
        const mappedState = mapStateToPersist
          ? mapStateToPersist(stateObject)
          : stateObject;

        dispatch({
          type: INITIALIZE_STATE_FROM_STORAGE,
          payload: mappedState,
        });
      } catch (error) {
        if (__DEV__) {
          console.error(error);
        }
      }
    },
  };
};

export const persistReducer = (reducer: Reducer): Reducer => (
  state,
  action,
) => {
  if (action.type === INITIALIZE_STATE_FROM_STORAGE) {
    return { ...state, ...action.payload };
  }

  return reducer(state, action);
};