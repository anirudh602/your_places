import React from 'react'
import Card from '../../shared/UIElements/Card'
import UserItem from './UserItem'

import './UserList.css'

const UserList = (props) => {
    console.log(props.items.length)
    if(props.items.length === 0){
        return <div className = "center">
            <Card>
            <h2>No users found</h2>
            </Card>
        </div>
    }


    return (
        <div>
            <ul className = "users-list">
               { props.items.map((user) => {
                    return <UserItem key = {user.id} id = {user.id} name = {user.name} places = {user.places.length} image = {user.image} />
                })}
            </ul>
            
        </div>
    )
}


export default UserList