import { useMachine } from "@xstate/react";
import React from "react";
import { redditMachine } from "../../machines/reddit";
import { SubReddit } from "./SubReddit";

const subreddits = ["frontend", "reactjs", "vuejs"];

export const Reddit = () => {
  const [current, send] = useMachine(redditMachine);
  const { subreddit } = current.context;

  return (
    <main>
      <header>
        <select
          onChange={e => {
            send("SELECT", { name: e.target.value });
          }}
        >
          {subreddits.map(subreddit => {
            return <option key={subreddit}>{subreddit}</option>;
          })}
        </select>
      </header>
      {subreddit && <SubReddit name={subreddit} key={subreddit} />}
    </main>
  );
};
