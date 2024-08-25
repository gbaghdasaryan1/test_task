const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
});

router.post('/', authMiddleware, async (req, res) => {
    const { title, description } = req.body;
    const task = new Task({ title, description, user: req.user.id });
    await task.save();
    res.status(201).json(task);
});

router.put('/:id', authMiddleware, async (req, res) => {
    const { title, description, completed } = req.body;
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { title, description, completed },
        { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
});

router.delete('/:id', authMiddleware, async (req, res) => {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
});

module.exports = router;
