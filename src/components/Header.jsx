import React, { useState } from 'react';

function Header(){
    const [isOpen, setIsOpen] = useState(false);

    function toggleMenu() {
        setIsOpen(!isOpen);
    }
    

    return(
        <header>
            <div className="name">
                <h1>Portfolio</h1>
            </div>
            <nav className={`nav-menu ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li>Home</li>
                    <li>About</li>
                    <li>Experience</li>
                    <li>Portfolio</li>
                </ul>
            </nav>
            <div className="burger" onClick={toggleMenu}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>
        </header>
    )
}

export default Header;