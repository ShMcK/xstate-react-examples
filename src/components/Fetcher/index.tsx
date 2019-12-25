import { createMachine } from "@xstate/fsm";
import { useMachine } from "@xstate/react/lib/fsm";
import React, { useEffect } from "react";
import { assign } from "xstate";

const context = {
  data: undefined
};

const fetchMachine = createMachine({
  id: "fetch",
  initial: "idle",
  context,
  states: {
    idle: {
      on: { FETCH: "loading" }
    },
    loading: {
      entry: ["load"],
      on: {
        RESOLVE: {
          target: "success",
          actions: assign({
            data: (context: any, event: any) => event.data
          })
        }
      }
    },
    success: {}
  }
});

export const Fetcher = ({
  onFetch = () => new Promise(res => res("some data"))
}) => {
  const [current, send] = useMachine<any, any>(fetchMachine);

  useEffect(() => {
    current.actions.forEach((action: any) => {
      if (action.type === "load") {
        onFetch().then(res => {
          send({ type: "RESOLVE", data: res });
        });
      }
    });
  }, [current, onFetch, send]);

  switch (current.value) {
    case "idle":
      return <button onClick={_ => send("FETCH")}>Fetch</button>;
    case "loading":
      return <div>Loading...</div>;
    case "success":
      return (
        <div>
          Success! Data: <div data-testid="data">{current.context.data}</div>
        </div>
      );
    default:
      return null;
  }
};
