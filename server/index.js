// Importing required modules
const express = require('express'); // Importing the Express.js framework
const cors = require('cors'); // Importing Cross-Origin Resource Sharing middleware
const mongoose = require('mongoose'); // Importing Mongoose for MongoDB interactions
require('dotenv').config(); // Loading environment variables from .env file
const upload = require('express-fileupload');

const bodyParser = require('body-parser')




//user routes import
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const {notFound,errorHandler} = require('./middleware/errorMiddleware')



// Creating an instance of the Express application
const app = express();

// Middleware setup
// Middleware to parse incoming JSON payloads
app.use(express.json({ extended: true }));

// Middleware to parse incoming URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json())

// CORS middleware configuration
// Allowing requests from http://localhost with credentials (such as cookies)
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Note: The value "http://localhost:" in the cors middleware should be completed with a port number,
// such as "http://localhost:3000" or "http://localhost:8080".


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });


 


app.use(upload()); // Use express-fileupload middleware
app.use('/uploads', express.static(__dirname + '/uploads'));




app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);






app.use(notFound)
app.use(errorHandler)



const PORT = process.env.PORT || 7000;
const URL = process.env.MONGOURL;

mongoose.connect(URL).then(()=>{
    console.log('Db connected successfully');
    app.listen(PORT,()=>{
        console.log(`Server is running on port: ${PORT}`);
         
    })
}).catch(error=> console.log(error));




