import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faCircleInfo, faEye, faDice, faLanguage } from '@fortawesome/free-solid-svg-icons';

import "./navBar.css";
const Navbar: React.FC = () => {
 
  return (
    <div>
        <nav className="navbar">
            <div className="navbar-logo"><FontAwesomeIcon icon={faDice} /> Liar's Dice</div>
            <ul className={`navbar-menu`}>
                
                <li className="navbar-menu-item" ><FontAwesomeIcon icon={faCircleInfo} /> How to play</li>
                <li className="navbar-menu-item"><FontAwesomeIcon icon={faLanguage} /> Language</li>
                <li className="navbar-menu-item"><FontAwesomeIcon icon={faRightFromBracket} /> Exit Room</li>
            </ul>
        
        </nav>
    </div>
    
  );
};

export default Navbar;
