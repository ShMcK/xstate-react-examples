import { assign, Machine } from "xstate";

type Post = any;

export interface Context {
  subreddit: string | null;
  posts: Post[];
}

export interface State {
  states: {
    idle: {};
    selected: {
      states: {
        loading: {};
        loaded: {};
        failed: {};
      };
    };
  };
}

export type Event = { type: "SELECT"; name: string };

function invokeFetchSubreddit(context: Context) {
  const { subreddit } = context;

  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.json())
    .then(json => json.data.children.map((child: any) => child.data));
}

export const redditMachine = Machine<Context, State, Event>({
  id: "reddit",
  initial: "idle",
  context: {
    subreddit: null,
    posts: []
  },
  states: {
    idle: {},
    selected: {
      initial: "loading",
      states: {
        loading: {
          invoke: {
            id: "fetch-subreddit",
            src: invokeFetchSubreddit,
            onDone: {
              target: "loaded",
              actions: assign({
                posts: (context, event) => event.data
              })
            },
            onError: "failed"
          }
        },
        loaded: {},
        failed: {}
      }
    }
  },
  on: {
    SELECT: {
      target: ".selected",
      actions: assign({
        subreddit: (context, event) => event.name
      })
    }
  }
});
