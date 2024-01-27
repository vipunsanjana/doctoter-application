import React, { useState } from 'react';
import axios from 'axios';

const AppointmentPage = () => {
  const [patientEmail, setPatientEmail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [messageText, setMessageText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:3001/api/user/book-appointment', {
        patientEmail,
        date,
        time,
      });
  
      if (response.data.success) {
        setMessageText(response.data.message);
        // Optionally, you can redirect or perform other actions after successful booking
      } else {
        setMessageText(response.data.message);
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      console.log('Response data:', error.response.data); // Log the response data for more details
      setMessageText('Error booking appointment. Please try again later.');
    }
  };
  

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Book an Appointment</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Patient Email:
          <input type="email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} required />
        </label>
        <br />
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <br />
        <label>
          Time:
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Book Appointment</button>
      </form>
      <p>{messageText}</p>
    </div>
  );
};

export default AppointmentPage;
