import React from "react";
import { Input } from "../components/FormInput";

export default {
  title: "FormInput",
  component: Input
};

const validations = [
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

export const FormInput = () => <Input validations={validations} />;
