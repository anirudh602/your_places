import React, { useEffect , useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../shared/FormElements/Button";
import Input from "../../shared/FormElements/Input";
import "./PlaceForm.css";
import { useForm } from "../../shared/util/form-hook";
import ErrorModal from "../../shared/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner"
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validator";
import Card from "../../shared/UIElements/Card";
import { useHttpClient } from "../../shared/util/http-hook";

import {AuthContext} from '../../shared/Context/auth-context'

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const pid = useParams().pid;
  const history = useHistory();
  let x = pid;
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [loadedVal , setLoadedVal] = useState(null);
  console.log(pid);

  const [state, dispatch , setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {

    const getData = async () => {
      try{
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${pid}`);
        console.log("Yahan aaya?1")
        setLoadedVal(responseData.place)
        setFormData({
          title: {
            value: responseData.place.title,
            isValid: true,
          },
          description: {
            value: loadedVal.description,
            isValid: true,
          },
        }, true)
        console.log("Yahan aaya?")
      
      }
      catch(error){

      }
    }
    getData();


  } , [sendRequest , pid , setFormData]);
  
  

 
 
  if(!loadedVal && !error && !isLoading){
    return (
      <div className = "center">
        <Card>
        <h2>Place not found</h2>
        </Card>
      </div>
    )
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    try{
      const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${pid}` , 'PATCH' , JSON.stringify({
        title: state.inputs.title.value,
        description: state.inputs.description.value
      }) , {"Content-Type" : "application/json" , Authorization : `Bearer ${auth.token}`});

      
      history.push(`/${auth.userId}/places`)
    }
    catch(error){

    }


  }
  
  return (
    <React.Fragment>
      {error && <ErrorModal onClear = {clearError} error = {error} />}
      {isLoading && <div className = "center"><LoadingSpinner/></div>}
    {!isLoading && loadedVal && <form className="place-form" onSubmit = {submitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        value= {loadedVal.title}
        valid={true}
        error="Please enter valid text"
        onInput={dispatch}
        validators={[VALIDATOR_REQUIRE()]}
      ></Input>
      <Input
        id="description"
        element="textarea"
        label="Description"
        value={loadedVal.description}
        valid={true}
        error="Please enter atleast 5 characters"
        onInput={dispatch}
        validators={[VALIDATOR_MINLENGTH(5)]}
      ></Input>
      <Button type="submit" disabled={!state.isValid}>
        UPDATE PLACE
      </Button>
    </form>}
    </React.Fragment>
  );
};

export default UpdatePlace;
