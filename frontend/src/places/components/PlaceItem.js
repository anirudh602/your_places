import React, { useState , useContext} from "react";
import Button from "../../shared/FormElements/Button";
import Card from "../../shared/UIElements/Card";
import Modal from "../../shared/UIElements/Modal";
import Map from "../../shared/UIElements/Map";
import {AuthContext} from "../../shared/Context/auth-context"
import "./PlaceItem.css";
import { useHttpClient } from "../../shared/util/http-hook";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../../shared/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/UIElements/ErrorModal";
const PlaceItem = (props) => {
  const pid = props.id;
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const history = useHistory();
  const {isLoading , error, sendRequest , clearError} = useHttpClient();

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const openConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };
  console.log(pid)
  const confirmDeleteHandler = async () => {
    closeConfirmModal();
    try{
    const req = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${pid}` , 'DELETE' , {} , {
      Authorization : `Bearer ${auth.token}`
    });
    console.log(props.onDelete)
    props.onDelete(pid);
    }
    catch(error){
      console.log("!!!!");
    }
  };

  

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <ErrorModal error = {error} onClear = {clearError}/>}
      {!isLoading && <React.Fragment><Modal
        onCancel={closeMapHandler}
        show={showMap}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE </Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16}></Map>
        </div>
      </Modal>
      <Modal
        show = {showConfirmModal}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button onClick={closeConfirmModal} inverse>
              Cancel
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and delete this place?</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              View on Map
            </Button>
            {auth.userId === props.creatorId && <React.Fragment><Button to={`/places/${props.id}`}>Edit</Button>
            <Button danger onClick={openConfirmModal}>
              Delete
            </Button> </React.Fragment>}
          </div>
        </Card>
      </li> </React.Fragment>}
    </React.Fragment>
  );
};

export default PlaceItem;
