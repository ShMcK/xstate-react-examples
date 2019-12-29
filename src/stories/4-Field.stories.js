import React from "react";
import { Field, NumberInput, TextInput } from "../components/Field";

export default {
  title: "FormField",
  component: Field
};

const validators = [
  {
    check: value => !value.length,
    message: "Required"
  },
  {
    check: value => value.length <= 3,
    message: "Too short"
  },
  {
    check: value => !value.includes("@"),
    message: 'Must include "@" symbol'
  }
];

export const FormFieldString = () => (
  <Field>
    <TextInput />
  </Field>
);

export const FormFieldCheckbox = () => (
  <Field>
    <input type="checkbox" />
  </Field>
);

export const FormFieldWithValidators = () => (
  <Field validators={validators}>
    <TextInput />
  </Field>
);

export const FormFieldWithInitialValue = () => (
  <Field initialValue="Hello" validators={validators}>
    <TextInput />
  </Field>
);

export const FormFieldNumber = () => (
  <Field
    initialValue={0}
    validators={[{ check: value => value > 3, message: "Too High" }]}
  >
    <NumberInput />
  </Field>
);
