import { useMachine } from "@xstate/react";
import React from "react";
import { Machine } from "xstate";

const formMachine = Machine({
  initial: "ready",
  states: {
    ready: {
      on: {
        SUBMIT: "submitting"
      }
    },
    submitting: {
      invoke: {
        id: "onSubmit",
        src: "onSubmit",
        onDone: "submitted",
        onError: "failed"
      }
    },
    submitted: {},
    failed: {}
  }
});

interface Props {
  onSubmit: any;
  children: any;
}

export const Form = (props: Props) => {
  const [current, send] = useMachine(formMachine, {
    services: {
      onSubmit: props.onSubmit
    }
  });

  const handleSubmit = e => {
    e.preventDefault();
    send({ type: "SUBMIT" });
  };
  return (
    <>
      <div>Form:{JSON.stringify(current.value)}</div>
      <form onSubmit={handleSubmit}>{props.children}</form>
    </>
  );
};
