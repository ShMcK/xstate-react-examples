import { useMachine } from "@xstate/react";
import React from "react";
import { fetchMachine } from "../../machines/fetch";

export const Fetcher = () => {
  const [fetchState, sendToFetch] = useMachine(fetchMachine, {
    actions: {
      fetchData: (ctx, event) => {
        return new Promise((resolve, reject) => {
          setTimeout(resolve, 2000);
        })
          .then(() => {
            sendToFetch({ type: "RESOLVE", data: [1, 2, 3] });
          })
          .catch(error => {
            sendToFetch({ type: "REJECT", error: error.message });
          });
      }
    }
  });

  return (
    <>
      <div>{fetchState.value}</div>
      <div>{JSON.stringify(fetchState.context)}</div>
      <button onClick={() => sendToFetch({ type: "FETCH" })}>Fetch</button>
    </>
  );
};
