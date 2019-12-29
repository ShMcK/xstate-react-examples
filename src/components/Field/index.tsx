import { useMachine } from "@xstate/react";
import React from "react";
import { assign, Machine } from "xstate";

type Validator = { check: (value: string) => boolean; message: string };

interface Props {
  initialValue?: string;
  validators?: Validator[];
  onChange(value: string): void;
  value: string;
  children: React.ReactElement;
}

const createValidator = validators => async ctx => {
  if (!validators) {
    return true;
  }
  const validated = await validators.filter(v => v.check(ctx.value));
  if (validated.length) {
    const errors = validated.map(v => v.message);
    throw errors;
  }
  return true;
};

const fieldMachine = Machine(
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
            onEntry: ["setError"]
          },
          valid: {
            onEntry: ["clearError"]
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

export const Field = (props: Props) => {
  const [current, send] = useMachine(fieldMachine, {
    context: {
      value: props.value || props.initialValue || ""
    },
    services: {
      validate: createValidator(props.validators)
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    send({ type: "UPDATE", value });
    props.onChange(value);
  };

  return React.cloneElement(props.children, {
    onChange: handleChange,
    value: current.context.value,
    current
  });
};

export { NumberInput, TextInput } from "./Inputs";
