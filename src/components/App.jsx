import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function App() {
    return(
        <Router>
            <Header/>
            <Footer/>
        </Router>
    )
}

export default App;