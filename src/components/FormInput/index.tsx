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
        target: "touched",
        actions: "updateValue"
      }
    },
    states: {
      untouched: {},
      touched: {
        initial: "pending",
        states: {
          pending: {
            after: {
              500: [
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
      updateValue: assign((_, event) => ({
        // @ts-ignore
        value: event.value
      })),
      clearError: assign((_, event) => ({
        error: ""
      }))
    }
  }
);

interface Props {
  validations: { check: (value: string) => boolean; message: string }[];
}

export const Input = ({ validations }: Props) => {
  const [current, send] = useMachine(inputMachine, {
    actions: {
      setError: assign((ctx, event) => ({
        error: validations.filter(({ check }) => !check(ctx.value))[0].message
      }))
    },
    guards: {
      validate(ctx, f, g) {
        return !validations.filter(({ check }) => !check(ctx.value)).length;
      }
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    send({ type: "UPDATE", value: e.target.value });
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
