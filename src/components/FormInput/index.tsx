import { useMachine } from "@xstate/react";
import React from "react";
import { assign, Machine } from "xstate";

const inputMachine = Machine(
  {
    initial: "untouched",
    context: {
      value: "",
      error: ""
    },
    on: {
      UPDATE: {
        actions: "updateValue"
      }
    },
    states: {
      untouched: {
        on: {
          CHANGE: "touched"
        }
      },
      touched: {
        initial: "pending",
        on: {
          CHANGE: "touched.pending"
        },
        states: {
          pending: {
            after: {
              300: [
                {
                  cond: "validate",
                  target: "valid"
                },
                {
                  target: "invalid"
                }
              ]
            }
          },
          invalid: {
            onEntry: "setError"
          },
          valid: {
            onEntry: "clearError"
          }
        }
      }
    }
  },
  {
    actions: {
      updateValue: assign((_, event: any) => ({
        value: event.value
      })),
      setError: assign((_, event: any) => ({
        error: "Error"
      })),
      clearError: assign((_, event: any) => ({
        error: ""
      }))
    }
  }
);

export const Input = () => {
  const [current, send] = useMachine(inputMachine, {
    guards: {
      validate(e, f, g) {
        return e.value.length > 3;
      }
    }
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    send({ type: "UPDATE", value: e.target.value });
    send({ type: "CHANGE" });
  };
  return (
    <>
      <div>{JSON.stringify(current.value)}</div>
      <input
        type="text"
        onChange={handleChange}
        value={current.context.value}
      />
      {current.matches({ touched: "invalid" }) && (
        <div>{current.context.error}</div>
      )}
    </>
  );
};
