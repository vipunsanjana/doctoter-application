const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require('moment');
const router = express.Router();
const admin = require("../db/firebase");
const authMiddleware = require("../middlewares/middleware");

const firestore = admin.firestore();
const adminsCollection = firestore.collection('admin');
const appointmentsCollection = firestore.collection('appointments');
const doctorsCollection = firestore.collection('doctors');


router.post("/register",  async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminSnapshot = await adminsCollection.doc(email).get();

    if (adminSnapshot.exists) {
      return res.status(400).send({ message: "admin Already Exists.", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await adminsCollection.doc(email).set({
      email,
      password: hashedPassword,
      role: 'admin', 
    });

    res.status(200).send({ message: "admin Registered Successfully.", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "admin Registration Error.", success: false, error });
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
      const secretKey = process.env.key || "jhhhhhhg";
      const token = jwt.sign({ id: adminSnapshot.id, email }, secretKey, {
        expiresIn: "1d",
      });
      

      res.status(200).send({ message: "Login Successful.", success: true, data: token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error Logging In.", success: false, error });
  }
});


router.get("/get-all-doctors", async (req, res) => {
  try {
      const snapshot = await doctorsCollection.get();

      if (snapshot.empty) {
          res.status(404).send({ message: "No doctors found.", success: false });
          return;
      }

      const doctors = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
      }));

      res.status(200).send({ message: "Doctors fetched successfully.", success: true, data: doctors });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error fetching doctors.", success: false, error: error.message });
  }
});




router.post("/check-booking-availability", async (req, res) => {
  try {
      const date = req.body.date;
      const fromTime = moment(req.body.time, 'HH:mm').clone().subtract(0, 'hours').format("HH:mm");
      const toTime = moment(req.body.time, 'HH:mm').clone().add(1/3, 'hours').format("HH:mm");
      const doctorId = req.body.doctorId;

      const snapshot = await appointmentsCollection
          .where('doctorId', '==', doctorId)
          .where('date', '==', date)
          .where('time', '>=', fromTime)
          .where('time', '<=', toTime)
          .where('isbook', '!=', false)
          .get();

      const doctorSnapshot = await doctorsCollection
        .where('from', '<=', fromTime)
        .where('to', '>=', to)
        .where('isbook', '==', false)
        .get();

      if (!snapshot.empty && !doctorSnapshot.empty) {
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
    const { address, location, phone_number, full_name, date, time } = req.body;

   
    const appointmentRef = await appointmentsCollection.add({
      address,
      phone_number,
      location,
      full_name,
      date,
      time,
      isBook: true,
      
    });

    const appointmentId = appointmentRef.id;

    res.status(200).send({ message: "Appointment registered successfully.", success: true, appointmentId });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Appointment registration error.", success: false, error });
  }
});



module.exports = router;
