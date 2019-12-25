import { assign, Machine } from "xstate";

interface Context {
  data: any | null;
  error: string | null;
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
  | { type: "RESOLVE"; data: any }
  | { type: "REJECT"; error: string };

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
        onEntry: ["fetchData"],
        on: {
          RESOLVE: { target: "successful", actions: ["setData"] },
          REJECT: { target: "failed", actions: ["setError"] }
        }
      },
      failed: {
        on: {
          FETCH: "pending"
        }
      },
      successful: {
        on: {
          FETCH: "pending"
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
        error: event.error
      }))
    }
  }
);
