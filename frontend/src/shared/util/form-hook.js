import  {useReducer, useCallback} from "react";


export const useForm = (initial_input , intial_valid) => {
  
  const formReducer = (state, action) => {
    let formIsValid = true;
    
    switch (action.type) {
      case "INPUT_CHANGE":
        for (const ind in state.inputs) {
          if(!state.inputs[ind]) continue;
          if (ind === action.id) {
            formIsValid = formIsValid && action.isValid;
          } else formIsValid = formIsValid && state.inputs[ind].isValid;
        }

        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.id]: { value: action.value, isValid: action.isValid },
          },
          isValid: formIsValid,
        };

      case "SET_DATA":
        return{
          inputs: action.inputs,
          isValid: action.validity
        }
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(formReducer , {
    inputs: initial_input,
    isValid : intial_valid,
  });


  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({type : "INPUT_CHANGE" , id: id , value: value , isValid: isValid})
  },[]);


  const setData = useCallback((inputData , formValidity) => {

    dispatch({type: "SET_DATA" , inputs: inputData , validity : formValidity })
  },[])


  return [state, inputHandler , setData];
};


