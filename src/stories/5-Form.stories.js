import React from "react";
import { Field, TextInput } from "../components/Field";
import { Form } from "../components/Form";

export default {
  title: "Form",
  component: Form
};

const onSubmitSuccess = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), 2000);
  });

export const submitSuccess = () => (
  <Form onSubmit={onSubmitSuccess}>
    <Field>
      <TextInput />
    </Field>
    <button type="submit">Submit</button>
  </Form>
);

const onSubmitFail = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => reject("Something went wrong"), 2000);
  });

export const submitFail = () => (
  <Form onSubmit={onSubmitFail}>
    <Field>
      <TextInput />
    </Field>
    <button type="submit">Submit</button>
  </Form>
);
