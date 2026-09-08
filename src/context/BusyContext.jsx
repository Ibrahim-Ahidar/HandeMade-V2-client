/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useReducer } from "react";

const BusyContext = createContext(null);

const initialState = { active: false, message: null };

function busyReducer(state, action) {
  switch (action.type) {
    case "START":
      return { active: true, message: action.message ?? null };
    case "STOP":
      return initialState;
    default:
      return state;
  }
}

export function BusyProvider({ children }) {
  const [state, dispatch] = useReducer(busyReducer, initialState);

  const startBusy = useCallback((message) => {
    dispatch({ type: "START", message });
  }, []);

  const stopBusy = useCallback(() => {
    dispatch({ type: "STOP" });
  }, []);

  const value = useMemo(
    () => ({
      active: state.active,
      message: state.message,
      startBusy,
      stopBusy,
    }),
    [state.active, state.message, startBusy, stopBusy]
  );

  return <BusyContext.Provider value={value}>{children}</BusyContext.Provider>;
}

export function useBusy() {
  const ctx = useContext(BusyContext);
  if (!ctx) {
    throw new Error("useBusy must be used within BusyProvider");
  }
  return ctx;
}
