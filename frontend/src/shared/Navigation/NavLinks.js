import React , {useContext} from "react";
import { NavLink } from "react-router-dom";
import './NavLinks.css'
import {AuthContext} from "../Context/auth-context"

const NavLinks = () => {

  const context = useContext(AuthContext);

  return(
  <ul className = "nav-links">
    <li>
    <span className = "abc">
        <NavLink to = "/" exact>ALL USERS</NavLink></span>
    </li>
    {context.isLoggedIn && <li>
        <NavLink to = {`/${context.userId}/places`}>MY PLACES</NavLink>
    </li>}
    {context.isLoggedIn && <li>
        <NavLink to = "/places/new">ADD PLACE</NavLink>

    </li>}
    {!context.isLoggedIn && <li>
        <NavLink to = "/auth">{context.isLoggedIn ? null : "LOGIN"}</NavLink>
    </li>}
    {context.isLoggedIn && <button onClick = {context.logout}>LOGOUT</button>}
  </ul>)
};

export default NavLinks;
