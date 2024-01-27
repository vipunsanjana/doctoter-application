import React, { useState } from 'react';
import axios from 'axios';
import {  useNavigate, } from 'react-router-dom';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const handleLogin = async () => {
    
    try {
      const response = await axios.post('http://localhost:3001/api/user/login', { email, password });
      const { success, message, data } = response.data;

      if (success) {
        // Store the token in local storage or state for future requests
        localStorage.setItem('token', data);

        // Redirect or update the UI as needed
        console.log('Login successful!');
        console.log("success");
        navigate("/all-doctor");
        
      } else {
        setErrorMessage(message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('An error occurred while logging in.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <label>Email:</label>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
