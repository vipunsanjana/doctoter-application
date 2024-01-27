const express = require("express");
const app = express();
const cors = require('cors');
app.use(express.json());
const userRouter = require("./routes/userRoute");
const adminRouter = require("./routes/adminRoutes");
// const doctorRouter = require("./routes/doctorsRoute");

app.use(cors());

app.use('/api/user',userRouter);
app.use('/api/admin',adminRouter);
// app.use('/api/doctor',doctorRouter);

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Node server started at ${port}`);
})