import React, { useReducer, useEffect } from "react";
import { validate } from "../util/validator";
import "./Input.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {

  
  // console.log(props.id , validas)
  const [state, dispatch] = useReducer(inputReducer, {
    value: props.value || "",
    isValid: false || props.valid,
    isTouched: false,
  });

  const { id, onInput } = props;
  const { value, isValid } = state;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, onInput, value, isValid]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = (event) => {
    dispatch({ type: "TOUCH" });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        onBlur={touchHandler}
        placeholder={props.placeholder}
        value={state.value}
        onChange={changeHandler}
      />
    ) : (
      <textarea
        id={props.id}
        onBlur={touchHandler}
        rows={props.rows || 3}
        value={state.value}
        onChange={changeHandler}
      />
    );

  return (
    <div
      className={`form-control ${
        !state.isValid && state.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!state.isValid && state.isTouched && <p>{props.error}</p>}
    </div>
  );
};

export default Input;
