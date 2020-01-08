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

export const fieldMachine = Machine(
  {
    initial: "untouched",
    context: {
      value: "",
      errors: []
    },
    on: {
      UPDATE: {
        target: "pending",
        actions: "updateValue"
      }
    },
    states: {
      untouched: {},
      pending: {
        after: {
          300: "validating"
        }
      },
      validating: {
        onEntry: "logValidating",
        invoke: {
          id: "validate",
          src: () => Promise.resolve(),
          onDone: "valid",
          onError: {
            target: "invalid"
          }
        }
      },
      invalid: {
        // onEntry: ["logInvalid", "setError", "sendInvalid"],
      },
      valid: {
        // onEntry: ["logValid", "clearError", "sendValid"],
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
      updateValue: assign((_, event) => {
        console.log("event", event);
        return {
          // @ts-ignore
          value: event.value
        };
      }),
      clearError: assign((_, event) => ({
        errors: []
      })),
      setError: assign((ctx, event) => ({
        errors: event.data
      }))
    }
  }
);
