import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './signup';
import SignIn from './sigin';
import Massage from './massage';

/**
 * The main app component, which renders the main router with three routes:
 * "/" renders the SignUp component
 * "/signin" renders the SignIn component
 * "/Messages" renders the Massage component
 */
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/Messages" element={<Massage />} />
            </Routes>
        </Router>
    );
};

export default App;

