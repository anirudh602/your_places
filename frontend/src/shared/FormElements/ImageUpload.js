import React, { useRef , useState, useEffect} from "react";
import Button from "./Button";

import "./ImageUpload.css";
const ImageUpload = (props) => {


  const [file, setFile] = useState(null);
  const [valid , setValid] = useState(false);
  const [url , setUrl] = useState();


  const filePickerRef = useRef();

  useEffect(() => {
      if(!file){
          return;
      }
      const fileReader = new FileReader();
      fileReader.onload = () => {
          setUrl(fileReader.result);
      }
      fileReader.readAsDataURL(file);
  } , [file]);

  const clickHandler = async (event) => {
    
      let currValid = valid;
      let fff;
    if(event.target.files && event.target.files.length == 1){
        await setFile(event.target.files[0]);
        fff = event.target.files[0];
        await setValid(true);
        currValid = true;
    }
    else{
        await setValid(false);
        currValid = false;
    } 
    console.log(props.id, file, valid)
    props.onInput(props.id, fff, currValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        style={{ display: "none" }}
        accept=".jpg , .png , .jpeg"
        type="file"
        ref={filePickerRef}
        onChange={clickHandler}
      ></input>
      <div className={`image-upload ${props.center && `center`} `}>
        <div className="image-upload__preview">
          {url && <img src={url} alt="preview" />}
          {!url && <p>Please pick and image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
