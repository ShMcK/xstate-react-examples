import { assign, Machine } from "xstate";

interface Context {
  data: any | null;
  error: Error | null;
}

interface State {
  states: {
    pending: {};
    failed: {};
    successful: {};
  };
}

type Event =
  | { type: "FETCH" }
  | { type: "REFRESH" }
  | { type: "RETRY" }
  | { type: "RESOLVE"; data: any }
  | { type: "REJECT"; error: Error };

export const fetchMachine = Machine<Context, State, Event>(
  {
    id: "fetch",
    initial: "pending",
    context: {
      data: null,
      error: null
    },
    states: {
      pending: {
        invoke: {
          src: "fetchData",
          onDone: { target: "successful", actions: ["setData"] },
          onError: { target: "failed", actions: ["setError"] }
        }
      },
      failed: {
        on: {
          RETRY: "pending"
        }
      },
      successful: {
        on: {
          REFRESH: "pending"
        }
      }
    }
  },
  {
    actions: {
      setData: assign((ctx, event: any) => ({
        data: event.data
      })),
      setError: assign((ctx, event: any) => ({
        error: event.data
      }))
    }
  }
);
