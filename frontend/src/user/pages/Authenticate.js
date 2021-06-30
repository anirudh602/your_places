import React, { useState, useContext } from "react";
import "./Authenticate.css";
import Button from "../../shared/FormElements/Button";
import Input from "../../shared/FormElements/Input";
import { useForm } from "../../shared/util/form-hook";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validator";
import Card from "../../shared/UIElements/Card";
import { AuthContext } from "../../shared/Context/auth-context";

import ErrorModal from "../../shared/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/util/http-hook";
import ImageUpload from "../../shared/FormElements/ImageUpload";

const Authenticate = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);

  const switchLoginMode = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...state.inputs,
          name: undefined,
          image: undefined
        },
        state.inputs.email.isValid && state.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...state.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: "",
            isValid: false
          }
        },
        false
      );
    }

    setIsLoginMode((p) => !p);
  };

  const [state, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(state.inputs)

    if (isLoginMode) {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL+"/users/login",
          "POST",
          JSON.stringify({
            email: state.inputs.email.value,
            password: state.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );

        auth.login(response.id , response.token);
      } catch (error) {}



    } else {
      try {
        console.log(1)
        console.log(state.inputs.email.value);
        const formData = new FormData();
        console.log(formData)
        formData.append('name' , state.inputs.name.value);
        formData.append('email' , state.inputs.email.value);
       
        console.log(formData)
        formData.append('password' , state.inputs.password.value);
        console.log(formData)
        formData.append('image' , state.inputs.image.value);
        console.log(state.inputs.image.value )
        console.log(formData)

        const response = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          formData
        );
        console.log(response)
        auth.login(response.id , response.token);
      } catch (error) {}

    }
  };

  const ErrorHandler = () => {
    clearError();
  };

  return (
    <React.Fragment>
      {<ErrorModal error={error} onClear={ErrorHandler} />}

      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={submitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              onInput={inputHandler}
              type="text"
              element="input"
              label="Your Name"
              error="Please enter your name"
              validators={[VALIDATOR_REQUIRE()]}
            />
          )}
          <Input
            id="email"
            onInput={inputHandler}
            type="email"
            element="input"
            label="Email"
            error="Please enter valid email"
            validators={[VALIDATOR_EMAIL()]}
          />

          <Input
            id="password"
            type="password"
            element="input"
            label="Password"
            error="Please enter valid password"
            validators={[VALIDATOR_MINLENGTH(8)]}
            onInput={inputHandler}
          />
          {!isLoginMode && <ImageUpload center id = "image" onInput = {inputHandler}/>}
          <Button disabled={!state.isValid}>
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>

        <Button inverse onClick={switchLoginMode}>
          Switch to {isLoginMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Authenticate;
