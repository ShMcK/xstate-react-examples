import { assign, Machine, spawn } from "xstate";

type Post = any;

export interface SubredditContext {
  subreddit: string | null;
  posts: Post[] | null;
  lastUpdated: string | null;
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
  subreddits: { [name: string]: any };
  subreddit: any | null;
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
    subreddits: {},
    subreddit: null
  },
  states: {
    idle: {},
    selected: {}
  },
  on: {
    SELECT: {
      target: ".selected",
      actions: assign((context, event) => {
        // Use the existing subreddit actor if one doesn't exist
        let subreddit = context.subreddits[event.name];

        if (subreddit) {
          return {
            ...context,
            subreddit
          };
        }

        // Otherwise, spawn a new subreddit actor and
        // save it in the subreddits object
        subreddit = spawn(createSubredditMachine(event.name));

        return {
          subreddits: {
            ...context.subreddits,
            [event.name]: subreddit
          },
          subreddit
        };
      })
    }
  }
});
