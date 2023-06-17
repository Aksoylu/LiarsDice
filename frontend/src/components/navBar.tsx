import React from 'react';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faCircleInfo, faEye, faDice, faLanguage } from '@fortawesome/free-solid-svg-icons';

import "./navBar.css";

const MySwal = withReactContent(Swal);
const {getTranslationInstance} = require("../translations/translate");


const pushModal = () => {
  MySwal.fire({
    title: <p>Hello World</p>,
    didOpen: () => {
      // `MySwal` is a subclass of `Swal` with all the same instance & static methods
      MySwal.showLoading()
    },
  }).then(() => {
    return MySwal.fire(<p>Shorthand works too</p>)
  })
}


const Navbar: React.FC = () => {
 
  return (
    <div>
        <nav className="navbar">
            <div className="navbar-logo"><FontAwesomeIcon icon={faDice} /> Liar's Dice</div>
            <ul className={`navbar-menu`}>
                
                <li className="navbar-menu-item" onClick={pushModal}><FontAwesomeIcon icon={faCircleInfo} /> How to play</li>
                <li className="navbar-menu-item"><FontAwesomeIcon icon={faLanguage} /> Language</li>
                <li className="navbar-menu-item"><FontAwesomeIcon icon={faRightFromBracket} /> Exit Room</li>
            </ul>
        
        </nav>
    </div>
    
  );
};

export default Navbar;
