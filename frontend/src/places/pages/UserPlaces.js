import React, { useEffect, useState } from 'react'
import PlaceList from '../components/PlaceList'
import {useParams} from 'react-router-dom'
import { useHttpClient } from '../../shared/util/http-hook';
import ErrorModal from '../../shared/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';


const UserPlaces = () => {
    const id = useParams().uid;
    
    const [data , setData] = useState(null);


    const {isLoading, error , sendRequest , clearError} = useHttpClient();

    useEffect(() => {

        const getValue = async () => {
            try{
                const values = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${id}`);
             
                setData(values.places);
            }

            catch(error){

            }

        }

        getValue();



    } , [sendRequest])

    const onDelete = async (pid) => {
        
        try{
            const values = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${id}`);
         
            setData(values.places);
        }

        catch(error){

        }
        
    }



    return (
        <React.Fragment>
            <ErrorModal error = {error} onClear = {clearError} />
            {isLoading && <div className = "center"><LoadingSpinner asOverlay/></div>}
            {!isLoading  && !error && data && <PlaceList items = {data} onDelete = {onDelete} />}
        </React.Fragment>
    )
}

export default UserPlaces
