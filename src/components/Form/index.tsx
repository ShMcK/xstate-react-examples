import { useMachine } from "@xstate/react";
import React from "react";
import { assign, Machine, spawn } from "xstate";
import { createFieldMachine } from "./FormField";

const createFormMachine = machines =>
  Machine({
    id: "form",
    initial: "valid",
    context: {},
    // @ts-ignore
    entry: assign(machines),
    states: {
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

const useForm = ({ schema, onSubmit }) => {
  const initialValues = {};
  const assignMachines = {};

  const items = Object.keys(schema);

  for (const item of items) {
    const value = schema[item].value;
    initialValues[item] = value;
    assignMachines[item] = () =>
      spawn(
        createFieldMachine({
          value,
          validators: schema[item].validators
        }),
        { name: "email" }
      );
  }

  const [values, setValues] = React.useState(initialValues);

  const [current, send] = useMachine(createFormMachine(assignMachines), {
    current: initialValues || {},
    services: {
      onSubmit
    }
  });

  const form = {};

  for (const item of items) {
    form[item] = {};
    form[item].onChange = e => {
      e.preventDefault();
      const value = e.target.value;
      current.context[item].send({ type: "UPDATE", value }, { to: item });
      setValues({ [item]: value });
    };
  }

  const handleSubmit = e => {
    e.preventDefault();
    send({ type: "SUBMIT" });
  };

  return {
    handleSubmit,
    values,
    form,
    current
  };
};

export const Form = (props: Props) => {
  const schema = {
    email: {
      value: "",
      validators: [
        {
          check: value => value.length < 3,
          message: "Too short"
        }
      ]
    },
    password: {
      value: "",
      validators: []
    }
  };

  const { handleSubmit, values, form, current } = useForm({
    onSubmit: props.onSubmit,
    schema
  });

  console.log(current.context.email.state.context);

  return (
    <>
      <div>State:{JSON.stringify(current.value)}</div>
      <div>Context:{JSON.stringify(current.context)}</div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="string"
            onChange={form.email.onChange}
            value={current.context.email.state.context.value}
          />
          {current.context.email.state.context.errors.length ? (
            <div>{current.context.email.state.context.errors[0]}</div>
          ) : null}
        </div>
        <div>
          <input
            type="password"
            onChange={form.password.onChange}
            value={current.context.password.state.context.value}
          />
        </div>
      </form>
    </>
  );
};
