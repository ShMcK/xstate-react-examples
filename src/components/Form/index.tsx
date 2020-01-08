import { useMachine } from "@xstate/react";
import React from "react";
import { assign, Machine, spawn } from "xstate";
import { fieldMachine } from "./FormField";

const createFormMachine = machines =>
  Machine({
    id: "form",
    initial: "untouched",
    context: {},
    // @ts-ignore
    entry: assign(machines),
    states: {
      untouched: {},
      invalid: {
        on: {
          VALID: "valid"
        }
      },
      valid: {
        onEntry: "log",
        on: {
          SUBMIT: "submitting",
          INVALID: "invalid"
        }
      },
      submitting: {
        invoke: {
          id: "onSubmit",
          src: "onSubmit",
          onDone: "submitted",
          onError: "invalid"
        }
      },
      submitted: {}
    }
  });

interface Props {
  initialValues: any;
  onSubmit: any;
  children: any;
}

const useForm = ({ props, initialValues }) => {
  const assignMachines = {};

  const form = {};
  const items = Object.keys(initialValues);

  for (const item of items) {
    assignMachines[item] = () => spawn(fieldMachine, { name: "email" });
  }

  const [current, send] = useMachine(createFormMachine(assignMachines), {
    current: props.initialValues || {},
    services: {
      onSubmit: props.onSubmit
    }
  });

  for (const item of items) {
    form[item] = {};
    form[item].onChange = e => {
      e.preventDefault();
      const value = e.target.value;
      current.context["email"].send({ type: "UPDATE", value }, { to: item });
      setValues({ [item]: value });
    };
  }

  const handleSubmit = e => {
    e.preventDefault();
    send({ type: "SUBMIT" });
  };

  const [values, setValues] = React.useState(initialValues);

  return {
    handleSubmit,
    values,
    form
  };
};

export const Form = (props: Props) => {
  const initialValues = {
    email: ""
  };

  const { handleSubmit, values, form } = useForm({ props, initialValues });

  return (
    <>
      {/* <div>State:{JSON.stringify(current.value)}</div>
      <div>Context:{JSON.stringify(current.context)}</div> */}
      <form onSubmit={handleSubmit}>
        <input
          type="string"
          onChange={form.email.onChange}
          value={values.email}
        />
      </form>
    </>
  );
};
