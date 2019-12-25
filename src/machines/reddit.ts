import { assign, Machine } from "xstate";

type Post = any;

export interface SubredditContext {
  subreddit: string | null;
  posts: Post[] | null;
  lastUpdated: Date | null;
}

export interface SubredditState {
  states: {
    loading: {};
    loaded: {};
    failed: {};
  };
}

export type SubredditEvent = { type: "RETRY" } | { type: "REFRESH" };

function invokeFetchSubreddit(context: SubredditContext) {
  const { subreddit } = context;

  return fetch(`https://www.reddit.com/r/${subreddit}.json`)
    .then(response => response.json())
    .then(json => json.data.children.map((child: any) => child.data));
}

export const createSubredditMachine = (subreddit: string) => {
  return Machine<SubredditContext, SubredditState, SubredditEvent>({
    id: "subreddit",
    initial: "loading",
    context: {
      subreddit, // subreddit name passed in
      posts: null,
      lastUpdated: null
    },
    // @ts-ignore
    states: {
      loading: {
        invoke: {
          id: "fetch-subreddit",
          src: invokeFetchSubreddit,
          onDone: {
            target: "loaded",
            actions: assign({
              posts: (_: any, event: { data: any }) => event.data,
              lastUpdated: () => Date.now()
            })
          },
          onError: "failed"
        }
      },
      loaded: {
        on: {
          REFRESH: "loading"
        }
      },
      failed: {
        on: {
          RETRY: "loading"
        }
      }
    }
  });
};

interface RedditContext {
  subreddit: string | null;
}

interface RedditState {
  states: {
    idle: {};
    selected: {};
  };
}

type RedditEvent = { type: "SELECT"; name: string };

export const redditMachine = Machine<RedditContext, RedditState, RedditEvent>({
  id: "reddit",
  initial: "idle",
  context: {
    subreddit: null
  },
  states: {
    idle: {},
    selected: {}
  },
  on: {
    SELECT: {
      target: ".selected",
      actions: assign({
        subreddit: (context, event: RedditEvent) => event.name
      })
    }
  }
});
