import React from "react";
import { assign, Machine } from "xstate";

type Validator = { check: (value: string) => boolean; message: string };

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

interface Props {
  initialValue?: string;
  validators?: Validator[];
  onChange(value: string): void;
  value: string;
  children: React.ReactElement;
}

// const createValidator = validators => async ctx => {
//   if (!validators) {
//     return true;
//   }
//   const validated = await validators.filter(v => v.check(ctx.value));
//   if (validated.length) {
//     const errors = validated.map(v => v.message);
//     throw errors;
//   }
//   return true;
// };

export const createFieldMachine = ({ value, validators }) =>
  Machine(
    {
      initial: "untouched",
      context: {
        value,
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
              onEntry: ["setError", "logInvalid"]
            },
            valid: {
              onEntry: ["clearError", "logValid"]
            }
          }
        }
      }
    },
    {
      actions: {
        logValidating: () => {
          console.log("validating");
        },
        logValid() {
          console.log("valid");
        },
        logInvalid() {
          console.log("invalid");
        },
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
      },
      services: {
        validate: createValidator(validators)
      }
    }
  );
