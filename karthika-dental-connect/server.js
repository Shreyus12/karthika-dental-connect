const express = require("express");

const colors = require("colors");

const morgan = require("morgan");

const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require ('path')


dotenv.config();

connectDB();
// rest object

const app = express();

// middlewares

app.use(express.json());

app.use(morgan("dev"));

// routes

app.use('/api/v1/user', require("./routes/userRoutes"))

app.use('/api/v1/admin', require("./routes/adminRoutes"))

app.use('/api/v1/doctor', require("./routes/doctorRoutes"))

app.use(express.static(path.join(__dirname, "./karthika-dental-connect/build")))

app.get('*', function(req,res){
    res.sendFile(path.join(__dirname, "./karthika-dental-connect/build/index.html"))
})

//port

const port = process.env.PORT || 8080;

//listen port

app.listen(port, () => {
    console.log(`server running in  ${process.env.NODE_MODE} Mode on port ${process.env.PORT} `.bgCyan.white);

})





