const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const auth = require('../middleware/auth');

router.post('/complete/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );

    const user = await User.findById(req.user.id);
    const today = new Date().toISOString().split('T')[0];
    const lastActive = user.lastActive?.toISOString().split('T')[0];

    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastActive === yesterdayStr) {
        user.streak += 1;
      } else {
        user.streak = 1;
      }
      user.lastActive = new Date();
      await user.save();
    }

    res.json({ task, streak: user.streak });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/all', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:date', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id, date: req.params.date });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, date, plannedMinutes } = req.body;
    const task = await Task.create({ user: req.user.id, title, date, plannedMinutes });
    res.json(task);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;