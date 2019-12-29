import React from "react";
import { Input } from "../components/FormInput";

export default {
  title: "FormInput",
  component: Input
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

export const FormInput = () => <Input />;

export const FormInputWithValidators = () => <Input validators={validators} />;

export const FormInputWithInitialValue = () => (
  <Input initialValue="Hello" validators={validators} />
);
