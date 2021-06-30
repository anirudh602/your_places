import React, { useEffect , useState} from 'react'
import ErrorModal from '../../shared/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/util/http-hook';
import UserList from '../components/UserList'



const Users = () => {

    const {isLoading , error , sendRequest , clearError} = useHttpClient();
    const [data , setData] = useState([]);

    useEffect(() => {
        
        const getUsers = async () => {
            
            try{
                console.log(1);
                const response = await sendRequest(process.env.REACT_APP_BACKEND_URL + "/users");
               
                console.log(response)
               
                setData(response.users);
                console.log("d", data)
            } catch(error){
                console.log(error)
            }
        }
        
      
        getUsers();
        

        
        


    } , [sendRequest])
 
    const errorHandler = () => {
        clearError();
    }



    return (
        <React.Fragment>
            <ErrorModal error = {error}   onClear = {errorHandler}/>
            {isLoading && <div className = "center"><LoadingSpinner/></div>}
            {!isLoading && data.length > 0 && <UserList items={data} />}

        </React.Fragment>
    )
}



export default Users