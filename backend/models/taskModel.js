const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a task name"]
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Please enter user id"]
    },
    startTime: {
        type: String,
        required: [true, "Please add a start time"]
    },
    endTime: {
        type: String,
        required: [true, "Please add an end time"]
    }
}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;