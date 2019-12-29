import { useMachine } from "@xstate/react";
import React from "react";
import { fetchMachine } from "../../services/fetch";

const apiCall = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve([1, 2, 3]), 2000);
  });

export const Fetcher = () => {
  const [state, dispatch] = useMachine(fetchMachine, {
    services: {
      fetchData: apiCall
    }
  });

  return (
    <>
      <div>{state.value}</div>
      {state.matches("successful") && <div>{state.context.data}</div>}

      {state.matches("failed") && (
        <button onClick={() => dispatch({ type: "RETRY" })}>Retry</button>
      )}
      {state.matches("successful") && (
        <button onClick={() => dispatch({ type: "REFRESH" })}>Refresh</button>
      )}
    </>
  );
};
