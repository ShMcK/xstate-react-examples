import React from "react";

export const NumberInput = props => (
  <>
    <div>Input: {JSON.stringify(props.current.value)}</div>
    <input
      type="number"
      value={props.current.context.value}
      onChange={props.onChange}
    />
    {props.current.matches({ touched: "invalid" }) && (
      <div>{props.current.context.errors[0]}</div>
    )}
  </>
);

export const TextInput = props => (
  <>
    <div>Input: {JSON.stringify(props.current.value)}</div>
    <input
      type="text"
      value={props.current.context.value}
      onChange={props.onChange}
    />
    {props.current.matches({ touched: "invalid" }) && (
      <div>{props.current.context.errors[0]}</div>
    )}
  </>
);
