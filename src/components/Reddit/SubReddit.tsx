import { useService } from "@xstate/react";
import React from "react";

interface Props {
  service: any;
}

export const SubReddit = ({ service }: Props) => {
  const [current, send]: [any, any, any] = useService(service);

  if (current.matches("failure")) {
    return (
      <div>
        Failed to load posts.{" "}
        <button onClick={_ => send("RETRY")}>Retry?</button>
      </div>
    );
  }

  const { subreddit, posts, lastUpdated } = current.context;

  return (
    <section
      //   data-machine={subredditMachine.id}
      data-state={current.toStrings().join(" ")}
    >
      {current.matches("loading") && <div>Loading posts...</div>}
      {posts && (
        <>
          <header>
            <h2>{subreddit}</h2>
            <small>
              Last updated: {lastUpdated}{" "}
              <button onClick={_ => send("REFRESH")}>Refresh</button>
            </small>
          </header>
          <ul>
            {posts.map((post: any) => {
              return <li key={post.id}>{post.title}</li>;
            })}
          </ul>
        </>
      )}
    </section>
  );
};
