const express = require('express');
const { 
    createTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask
} = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');



const router = express.Router();

router.get("/", protect, getAllTasks);
router.get("/:id", protect, getTask);
router.patch("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.post("/create", protect, createTask);


module.exports = router;