import { useMachine } from "@xstate/react";
import React from "react";
import { assign, Machine } from "xstate";

const createValidator = validators => async ctx => {
  if (!validators || !validators.length) {
    return true;
  }
  const validated = await validators.filter(v => v.check(ctx.value));
  if (validated.length) {
    const errors = validated.map(v => v.message);
    throw errors;
  }
  return true;
};

const inputMachine = Machine(
  {
    initial: "untouched",
    context: {
      value: "",
      errors: []
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
              300: "validating"
            }
          },
          validating: {
            invoke: {
              id: "validate",
              src: "validate",
              onDone: "valid",
              onError: {
                target: "invalid"
              }
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
        errors: []
      })),
      setError: assign((ctx, event) => ({
        errors: event.data
      }))
    }
  }
);

interface Props {
  validators: { check: (value: string) => boolean; message: string }[];
}

export const Input = ({ validators }: Props) => {
  const [current, send] = useMachine(inputMachine, {
    services: {
      validate: createValidator(validators)
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    send({ type: "UPDATE", value: e.target.value });
  };

  return (
    <>
      <div>State: {JSON.stringify(current.value)}</div>
      <input
        type="text"
        onChange={handleChange}
        value={current.context.value}
      />
      {current.matches({ touched: "invalid" }) && (
        <div>{current.context.errors[0]}</div>
      )}
    </>
  );
};
