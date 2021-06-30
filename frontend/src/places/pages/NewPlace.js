import React , {useContext} from "react";
import Input from "../../shared/FormElements/Input";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validator";
import "./PlaceForm.css";
import Button from './../../shared/FormElements/Button'
import {useForm} from '../../shared/util/form-hook'
import { useHttpClient } from "../../shared/util/http-hook";
import ErrorModal from "../../shared/UIElements/ErrorModal";
import { AuthContext } from "../../shared/Context/auth-context";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import { useHistory } from "react-router-dom";
import ImageUpload from "../../shared/FormElements/ImageUpload";
const NewPlace = () => {
  const auth = useContext(AuthContext);
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [state , inputHandler] = useForm({
    title: {
      value: "",
      isValid: false,
    },
    description: {
      value: "",
      isValid: false,

    },
    address: {
      value: "",
      isValid: false,

    },
    image: {
      value: "",
      isValid: false,
    }
  } , false);

  const history = useHistory();


  const placeInputHandler = async (e) => {
    e.preventDefault();
    console.log("H" , auth.userId)

    const formData = new FormData();
    console.log(state.inputs)
    formData.append("title" , state.inputs.title.value);
    formData.append("description" , state.inputs.description.value);
    formData.append("address" , state.inputs.address.value);
    formData.append("image" , state.inputs.image.value);
   

    try{
      console.log(process.env.REACT_APP_BACKEND_URL)
      const response = await sendRequest(process.env.REACT_APP_BACKEND_URL + "/places", "POST" , formData , {
        Authorization : `Bearer ${auth.token}`
      });
      console.log(response);
      console.log("Kya yahan aaya");
      history.push('/')


    }
    catch(error){

    }


  }
 


  return (
    <React.Fragment>
      <ErrorModal error = {error} onClear = {clearError} />
    <form className="place-form" onSubmit = {placeInputHandler}>
      {isLoading && <LoadingSpinner asOverlay />}
      <Input
        id = "title"
        onInput={inputHandler}
        element="input"
        type="text"
        label="Title"
        error="Please enter valid text"
        validators={[VALIDATOR_REQUIRE()]}
      />
      <Input
        id = "description"
        onInput={inputHandler}
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(4)]}
        error="Please enter atleast 4 characters"
      />
      <Input
        id = "address"
        onInput={inputHandler}
        element = "input"
        type = "text"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        error="Please enter a valid address"
      />
      <ImageUpload center id = "image" onInput = {inputHandler}/>
      <Button disabled = {!state.isValid}>ADD PLACE</Button>
    </form>
    </React.Fragment>
  );
};

export default NewPlace;
