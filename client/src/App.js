import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import RegistrationForm from './pages/RegistrationForm';
import AddDoctor from './pages/AddDoctor';
import AllDoctor from './pages/AllDoctor';
import AddAppin from './pages/AddAppin';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/add-doctor" element={<AddDoctor />} />
        <Route path="/all-doctor" element={<AllDoctor />} />
        <Route path="/add-appin" element={<AddAppin />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
