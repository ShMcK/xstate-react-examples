import { useMachine } from "@xstate/react";
import React from "react";
import { Machine } from "xstate";

const pending = {
  on: {
    "": [
      {
        cond: "hasToken",
        target: "loggedIn"
      },
      {
        cond: "hasUser",
        target: "login"
      },
      "register"
    ]
  }
};

const register = {
  type: "parallel",
  states: {
    email: {
      initial: "untouched",
      states: {
        untouched: {},
        error: {},
        valid: {}
      }
    },
    password: {
      initial: "untouched",
      states: {
        untouched: {},
        error: {},
        valid: {}
      }
    }
  }
};

const login = {
  type: "parallel",
  states: {
    email: {},
    password: {}
  }
};

const authMachine = Machine(
  {
    id: "auth",
    initial: "pending",
    states: {
      pending,
      register,
      // login,
      loggedIn: {}
    }
  },
  {
    guards: {
      hasToken() {
        return false;
      },
      hasUser() {
        return false;
      }
    }
  }
);

export const Auth = () => {
  const [current, send] = useMachine(authMachine);
  return (
    <div>
      <div>{current.value}</div>
    </div>
  );
};
