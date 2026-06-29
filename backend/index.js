const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
require('dotenv').config();

const app=express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json());

app.get('/', (req, res)=>{
    res.send('Study planner API is running!');
});

const authRoutes = require('./routes/auth');
const taskRoutes=require('./routes/tasks');
const noteRoutes=require('./routes/notes');
const timetableRoutes = require('./routes/timetable');
app.use('/api/timetable', timetableRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);



mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('MongoDB connected!');
        app.listen(5000, ()=>{
            console.log('Server running on port 5000');
        });
    })
    .catch((err)=>console.log(err));
