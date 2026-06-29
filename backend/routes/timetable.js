const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const auth = require('../middleware/auth');


router.get('/', auth, async (req, res) => {
  try {
    let timetable = await Timetable.findOne({ user: req.user.id });
    if (!timetable) {
      timetable = await Timetable.create({ user: req.user.id, slots: [] });
    }
    res.json(timetable);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/slot', auth, async (req, res) => {
  try {
    const { day, startTime, endTime, subject, color } = req.body;
    let timetable = await Timetable.findOne({ user: req.user.id });
    if (!timetable) {
      timetable = await Timetable.create({ user: req.user.id, slots: [] });
    }
    timetable.slots.push({ day, startTime, endTime, subject, color });
    await timetable.save();
    res.json(timetable);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/slot/:slotId', auth, async (req, res) => {
  try {
    const timetable = await Timetable.findOne({ user: req.user.id });
    timetable.slots = timetable.slots.filter(
      slot => slot._id.toString() !== req.params.slotId
    );
    await timetable.save();
    res.json(timetable);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;