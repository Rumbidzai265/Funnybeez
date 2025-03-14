import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="nav-link">Index</Link>
            <Link to="/FarmSales" className="nav-link">Farm Sales</Link>
        </nav>
    );
};

export default Navbar;