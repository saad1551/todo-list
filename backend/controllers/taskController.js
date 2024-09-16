const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

const createTask = asyncHandler(async(req, res) => {
    const { name, startTime, endTime } = req.body;

    if ( !name || !startTime || !endTime ) {
        res.status(400);
        throw new Error("Please enter all fields");
    }

    const task = await Task.create({
        name,
        userId: req.user._id,
        startTime,
        endTime
    });

    if (!task) {
        res.status(500);
        throw new Error("Task could not be created");
    }


    res.status(201).json({
        id: task._id,
        name: task.name,
        userId: req.user._id,
        startTime: task.startTime,
        endTime: task.endTime
    });
});

const getAllTasks = asyncHandler(async(req, res) => {
    const userId = req.user._id;

    const tasks = await Task.find({userId});

    if (!tasks) {
        res.status(404);
        throw new Error("No tasks found");
    }

    res.send(tasks);
});

const getTask = asyncHandler(async(req, res) => {
    const userId = req.user._id;

    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
        res.status(404);
        throw new Error("Tast not found");
    }

    if (!task.userId.equals(userId)) {
        res.status(401);
        throw new Error("Not authorized");
    }

    res.status(200).json(task);
});

const updateTask = asyncHandler(async(req, res) => {
    const taskId = req.params.id;

    const { name, startTime, endTime } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
        res.status(404);
        throw new Error("Task not found");
    }

    if (!task.userId.equals(req.user._id)) {
        res.status(401);
        throw new Error("not authorized");
    }

    const updatedTask = await Task.findByIdAndUpdate(
        { _id: taskId },
        {
            name,
            startTime,
            endTime,
            userId: req.user._id
        },
        {
            new: true,
            runValidators: true
        }
    );

    res.status(201).json(updatedTask);
});

const deleteTask = asyncHandler(async(req, res) => {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
        res.status(404);
        throw new Error("Task not found");
    }

    if (!task.userId.equals(req.user._id)) {
        res.status(401);
        throw new Error("Not authorized");
    }

    await Task.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Successfully deleted task"});
});

module.exports = {
    createTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask
};