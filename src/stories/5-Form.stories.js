import React from "react";
import { Form } from "../components/Form";
import { Input } from "../components/FormInput";

export default {
  title: "Form",
  component: Form
};

const onSubmitSuccess = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), 2000);
  });

const onSubmitFail = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => reject("Something went wrong"), 2000);
  });

export const submitSuccess = () => (
  <Form onSubmit={onSubmitSuccess}>
    <Input />
    <button type="submit">Submit</button>
  </Form>
);

export const submitFail = () => (
  <Form onSubmit={onSubmitFail}>
    <Input />
    <button type="submit">Submit</button>
  </Form>
);
