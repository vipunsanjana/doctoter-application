const express = require("express");
const admin = require("../db/firebase");
const router = express.Router();
const authMiddleware = require("../middlewares/middleware");
const multer = require('multer');
const firestore = admin.firestore();
const moment = require('moment');
const doctorsCollection = firestore.collection('doctors');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// router.post("/create-doctor",authMiddleware,  async (req, res) => {
//     try {
//       const { name, description, price, from, to,date } = req.body;
  
     
//       switch (true) {
//         case !name:
//           return res.status(500).send({ error: "Name is Required" });
//         case !description:
//           return res.status(500).send({ error: "Description is Required" });
//         case !price:
//           return res.status(500).send({ error: "Price is Required" });
//         case !from:
//           return res.status(500).send({ error: "from is Required" });
//         case !to:
//           return res.status(500).send({ error: "to is Required" });
//         case !date:
//           return res.status(500).send({ error: "date is Required" });
  
//       }
  
      
//       const doctorSnapshot = await doctorsCollection.doc().get();
//       const doctorId = doctorSnapshot.id;
  
  
//       await doctorsCollection.doc(doctorId).set({
//         name,
//         description,
//         price,
//         from,
//         to,
//         date,
//         isbook: false, 
//       });
      
//       res.status(200).send({ message: "Doctor Created Successfully.", success: true });
  
//     } catch (error) {
//       console.log(error);
//       res.status(500).send({
//         success: false,
//         error,
//         message: "Error in creating doctor",
//       });
//     }
//   });

  router.post("/create-doctor", authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, from, to, date } = req.body;

    if (!req.file) {
      return res.status(400).send({ error: "Image is Required" });
    }
    
    const imageData = req.file.buffer;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !from:
        return res.status(500).send({ error: "From is Required" });
      case !to:
        return res.status(500).send({ error: "To is Required" });
      case !date:
        return res.status(500).send({ error: "Date is Required" });

    }

    const doctorSnapshot = await doctorsCollection.doc().get();
    const doctorId = doctorSnapshot.id;

    const adjustedFrom = moment(from).subtract(2, 'hours').format('HH:mm:ss');


    const base64Image = imageData.toString('base64');

    await doctorsCollection.doc(doctorId).set({
      name,
      description,
      price,
      from,
      to,
      date,
      adjustedFrom,
      image: {
        data: base64Image,
        contentType: req.file.mimetype,
      },
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


  

router.get("/get-all-doctors",authMiddleware, async (req, res) => {
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



router.post("/update-doctor-profile", authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { userId, name, description, price, from, to, date } = req.body;

   
    if (!req.file) {
      return res.status(400).send({ error: "Image is Required" });
    }


    const imageData = req.file.buffer;

  

    switch (true) {
      case !userId:
        return res.status(500).send({ error: "User ID is Required" });
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !from:
        return res.status(500).send({ error: "From is Required" });
      case !to:
        return res.status(500).send({ error: "To is Required" });
      case !date:
        return res.status(500).send({ error: "Date is Required" });
    }

    const doctorRef = doctorsCollection.doc(userId);
    const doctorSnapshot = await doctorRef.get();

    if (!doctorSnapshot.exists) {
      return res.status(404).send({ error: "Doctor not found" });
    }

    const adjustedFrom = moment(from).subtract(2, 'hours').format('HH:mm:ss');
    const base64Image = imageData.toString('base64');

    await doctorRef.update({
      name,
      description,
      price,
      from,
      to,
      date,
      adjustedFrom,
      image: {
        data: base64Image,
        contentType: req.file.mimetype,
      },
      isbook: false,
    });

    res.status(200).send({ message: "Doctor profile updated successfully.", success: true });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error updating doctor profile",
    });
  }
});


router.delete("/delete-doctor/:userId", authMiddleware, isAdminMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).send({ error: "User ID is Required" });
    }

    const doctorRef = doctorsCollection.doc(userId);
    const doctorSnapshot = await doctorRef.get();

    if (!doctorSnapshot.exists) {
      return res.status(404).send({ error: "Doctor not found" });
    }


    await doctorRef.delete();

    res.status(200).send({ message: "Doctor deleted successfully.", success: true });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error deleting doctor",
    });
  }
});

function isAdminMiddleware(req, res, next) {

  const userRole = req.user.role; 

  if (userRole !== 'admin') {
    return res.status(403).send({ error: "Permission denied. Admin access required." });
  }


}



module.exports = router;
