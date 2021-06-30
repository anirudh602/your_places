import React from "react";
import Button from "../../shared/FormElements/Button";
import Card from "../../shared/UIElements/Card";
import PlaceItem from './PlaceItem'
import './PlaceList.css'

const PlaceList = (props) => {
  if (!props.items || props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe add a place?</h2>
          <Button to = "/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

 console.log(props)
  return (
    <ul className = "place-list">
      {props.items.map((place) => {
        return (
          <PlaceItem
            key={place.id}
            id={place.id}
            image={`${process.env.REACT_APP_ASSET_URL}/${place.image}`}
            title={place.title}
            description={place.description}
            address={place.address}
            creatorId={place.creator}
            coordinates={place.location}
            onDelete = {props.onDelete}
          />
        );
      })}
    </ul>
  );
};

export default PlaceList;
