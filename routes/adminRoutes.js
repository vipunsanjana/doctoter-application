const express = require("express");
const admin = require("../db/firebase");
const router = express.Router();
const authMiddleware = require("../middlewares/middleware");

const firestore = admin.firestore();
const doctorsCollection = firestore.collection('doctors');




router.post("/create-doctor",  async (req, res) => {
    try {
      const { name, description, price, from, to,date } = req.body;
  
     
      switch (true) {
        case !name:
          return res.status(500).send({ error: "Name is Required" });
        case !description:
          return res.status(500).send({ error: "Description is Required" });
        case !price:
          return res.status(500).send({ error: "Price is Required" });
        case !from:
          return res.status(500).send({ error: "from is Required" });
        case !to:
          return res.status(500).send({ error: "to is Required" });
        case !date:
          return res.status(500).send({ error: "date is Required" });
  
      }
  
      
      const doctorSnapshot = await doctorsCollection.doc().get();
      const doctorId = doctorSnapshot.id;
  
    //   if (doctorSnapshot.exists) {
    //     return res.status(400).send({ message: "Doctor Already Exists.", success: false });
    //   }
  
  
      await doctorsCollection.doc(doctorId).set({
        name,
        description,
        price,
        from,
        to,
        date,
        isbook: false, 
      });
      
      res.status(200).send({ message: "Doctor Created Successfully.", success: true });
  
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in creating doctor",
      });
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

module.exports = router;
