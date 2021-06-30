import React , {useState} from "react";
import { Link } from "react-router-dom";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import "./MainNavigation.css";
import SideDrawer from "./SideDrawer";
import "../UIElements/Backdrop"
import Backdrop from "../UIElements/Backdrop";


export const MainNavigation = (props) => {
  const [drawerIsOpen , setDrawerisOpen] = useState(0);

  const openDrawerHandler = () => {
    setDrawerisOpen(1);
  }

  const closeDrawerHandler = () => {
    setDrawerisOpen(0);
  }



  return (
    <React.Fragment>
      <SideDrawer show = {drawerIsOpen} onClick = {closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      {drawerIsOpen ? <Backdrop onClick = {closeDrawerHandler}/> : null}
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick = {openDrawerHandler}>
          <span />
          <span />
          <span />
        </button>

        <h1 className="main-navigation__title">
          <Link to="/"> YourPlaces </Link>
        </h1>

        <nav className="main-navigation__header-nav">
          {" "}
          <NavLinks></NavLinks>
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
