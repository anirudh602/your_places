import React from 'react';
import ReactDOM from 'react-dom';

import './Backdrop.css'

const Backdrop = (props) => {
    const el = <div className = "backdrop" onClick = {props.onClick}></div>
    return ReactDOM.createPortal(el , document.getElementById('backdrop-hook'));

}


export default Backdrop;