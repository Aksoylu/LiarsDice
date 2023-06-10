import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faCircleInfo, faEye, faDice, faLanguage } from '@fortawesome/free-solid-svg-icons';

import "./navBar.css";
const Navbar: React.FC = () => {
    
    const [isMenuOpen, setMenuOpen] = useState(false);

    const handleMouseEnter = () => {
      setMenuOpen(true);
    };
  
    const handleMouseLeave = () => {
      setMenuOpen(false);
    };

    
  return (
    <div>
        <nav className="navbar">
            <div className="navbar-logo"><FontAwesomeIcon icon={faDice} /> Liar's Dice</div>
            <ul className={`navbar-menu`}>
                <li className="navbar-menu-item"
                    onMouseEnter={handleMouseEnter}
                ><FontAwesomeIcon icon={faEye} /> Players
                
                {isMenuOpen && (
                    <ul className="navbar-submenu" onMouseLeave={handleMouseLeave}>
                        <li>Submenu Item 1</li>
                        <li>Submenu Item 2</li>
                        <li>Submenu Item 3</li>
                    </ul>
                )}
                </li>
                <li className="navbar-menu-item" ><FontAwesomeIcon icon={faCircleInfo} /> How to play</li>
                <li className="navbar-menu-item"><FontAwesomeIcon icon={faLanguage} /> Language</li>

                <li className="navbar-menu-item"><FontAwesomeIcon icon={faRightFromBracket} /> Exit Room</li>
            </ul>
        
        </nav>
    </div>
    
  );
};

export default Navbar;
