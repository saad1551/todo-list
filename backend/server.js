const express = require('express');
const errorHandler = require('./middleware/errorMiddleware');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoute');
const taskRouter = require('./routes/taskRoute');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


// Error Middleware
app.use(errorHandler);

app.get("/",(req, res) => {
    res.send("Home Page");
});

app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);


const PORT = 5000;

// connect to MongoDB and start server
mongoose
    .connect(
        process.env.MONGO_URI
    ).then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch((err) => {
        console.log(err);
    });
