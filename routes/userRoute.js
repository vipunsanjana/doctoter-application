const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const admin = require("../db/firebase");
const authMiddleware = require("../middlewares/middleware");

const firestore = admin.firestore();
const adminsCollection = firestore.collection('users');
const appointmentsCollection = firestore.collection('appointments');


router.post("/register",  async (req, res) => {
  try {
    const { email, password } = req.body;

    const userSnapshot = await usersCollection.doc(email).get();

    if (userSnapshot.exists) {
      return res.status(400).send({ message: "User Already Exists.", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await usersCollection.doc(email).set({
      email,
      password: hashedPassword,
      role: 'patient', 
    });

    res.status(200).send({ message: "Patient Registered Successfully.", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "User Registration Error.", success: false, error });
  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminSnapshot = await adminsCollection.doc(email).get();

    if (!adminSnapshot.exists) {
      return res.status(200).send({ message: "Admin Does not Exist.", success: false });
    }

    const userData = adminSnapshot.data();
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(200).send({ message: "Password is Incorrect.", success: false });
    } else {
      const token = jwt.sign({ id: adminSnapshot.id, email }, process.env.key, {
        expiresIn: "1d",
      });

      res.status(200).send({ message: "Login Successful.", success: true, data: token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error Logging In.", success: false, error });
  }
});



router.post("/check-booking-availability", authMiddleware, async (req, res) => {
  try {
      const date = req.body.date;
      const fromTime = moment(req.body.time, 'HH:mm').clone().subtract(1, 'hours').format("HH:mm");
      const toTime = moment(req.body.time, 'HH:mm').clone().add(1, 'hours').format("HH:mm");
      const doctorId = req.body.doctorId;

      const snapshot = await appointmentsCollection
          .where('doctorId', '==', doctorId)
          .where('date', '==', date)
          .where('time', '>=', fromTime)
          .where('time', '<=', toTime)
          .where('isbook', '!=', false)
          .get();

      if (!snapshot.empty) {
          return res.status(200).send({ message: "Appointments not available.", success: false });
      } else {
          return res.status(200).send({ message: "Appointments available.", success: true });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error checking appointment availability.", success: false, error: error.message });
  }
});



router.post("/book-appointment", async (req, res) => {
  try {
    const { patientEmail, doctorId, date, time } = req.body;


    // Check if the doctor exists
    const doctorSnapshot = await usersCollection.doc(doctorId).get();
    if (!doctorSnapshot.exists) {
      return res.status(400).send({ message: "Invalid doctor.", success: false });
    }

    // Check appoiabilityntmenty
    const fromTime = moment(time, 'HH:mm').clone().subtract(1, 'hours').format("HH:mm");
    const toTime = moment(time, 'HH:mm').clone().add(1, 'hours').format("HH:mm");

    const existingAppointments = await appointmentsCollection
      .where('doctorId', '==', doctorId)
      .where('date', '==', date)
      .where('time', '>=', fromTime)
      .where('time', '<=', toTime)
      .get();

    if (!existingAppointments.empty) {
      return res.status(200).send({ message: "Appointments not available.", success: false });

    }
    const momentTime = moment(time, 'HH:mm');
    const cometimes = momentTime.clone().subtract(2, 'hours').format("HH:mm");


  
    const appointmentData = {
      patientEmail,
      doctorId,
      date,
      time,
      status: "pending",
      cometime: cometimes,
    };

    const appointmentRef = await appointmentsCollection.add(appointmentData);

    res.status(200).send({ message: "Appointment booked successfully.", success: true, appointmentId: appointmentRef.id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error booking appointment.", success: false, error: error.message });
  }
});



module.exports = router;
