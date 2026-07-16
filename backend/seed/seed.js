const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '../.env' });

const connectDB = require('../config/db');
const BodyMeasurement = require('../models/BodyMeasurement');
const FitnessGoal = require('../models/FitnessGoal');
const ProgressPhoto = require('../models/ProgressPhoto');
const User = require('../models/User');
const WorkoutPlan = require('../models/WorkoutPlan');

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const addMonths = (date, months) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

const demoUsers = [
  {
    user: {
      name: 'Demo User',
      email: 'demo@bodyvision.local',
      password: 'Demo12345',
      gender: 'male',
      age: 22,
      height: 178,
      currentWeight: 82,
      activityLevel: 'moderate'
    },
    goal: {
      desiredWeight: 76,
      desiredBodyFatPercentage: 16,
      desiredWaist: 80,
      desiredChest: 100,
      desiredHips: 100,
      targetDate: addMonths(new Date(), 4),
      goalType: 'weight_loss',
      isActive: true
    },
    measurements: [
      { weight: 87, bodyFatPercentage: 24, chest: 104, waist: 96, hips: 106, shoulders: 119, arm: 35, thigh: 62 },
      { weight: 85.6, bodyFatPercentage: 23.2, chest: 103, waist: 94, hips: 105, shoulders: 119, arm: 35, thigh: 61 },
      { weight: 84.4, bodyFatPercentage: 22.4, chest: 102, waist: 92, hips: 104, shoulders: 118, arm: 34.5, thigh: 60.5 },
      { weight: 83.2, bodyFatPercentage: 21.6, chest: 101, waist: 90, hips: 103, shoulders: 118, arm: 34, thigh: 60 },
      { weight: 82, bodyFatPercentage: 20.8, chest: 101, waist: 88, hips: 102, shoulders: 118, arm: 34, thigh: 59.5 }
    ]
  },
  {
    user: {
      name: 'Maria Fitness',
      email: 'maria@bodyvision.local',
      password: 'Demo12345',
      gender: 'female',
      age: 24,
      height: 166,
      currentWeight: 58.5,
      activityLevel: 'active'
    },
    goal: {
      desiredWeight: 62,
      desiredBodyFatPercentage: 20,
      desiredWaist: 67,
      desiredChest: 91,
      desiredHips: 96,
      targetDate: addMonths(new Date(), 5),
      goalType: 'muscle_gain',
      isActive: true
    },
    measurements: [
      { weight: 56.8, bodyFatPercentage: 22.5, chest: 87, waist: 69, hips: 93, shoulders: 100, arm: 27, thigh: 52 },
      { weight: 57.1, bodyFatPercentage: 22.2, chest: 88, waist: 69, hips: 93.5, shoulders: 101, arm: 27.5, thigh: 52.5 },
      { weight: 57.7, bodyFatPercentage: 21.8, chest: 89, waist: 68.5, hips: 94, shoulders: 101.5, arm: 28, thigh: 53 },
      { weight: 58.1, bodyFatPercentage: 21.5, chest: 89.5, waist: 68, hips: 94.5, shoulders: 102, arm: 28.2, thigh: 53.5 },
      { weight: 58.5, bodyFatPercentage: 21.2, chest: 90, waist: 68, hips: 95, shoulders: 102.5, arm: 28.5, thigh: 54 }
    ]
  },
  {
    user: {
      name: 'Alex Balance',
      email: 'alex@bodyvision.local',
      password: 'Demo12345',
      gender: 'other',
      age: 31,
      height: 172,
      currentWeight: 70.2,
      activityLevel: 'light'
    },
    goal: {
      desiredWeight: 70,
      desiredBodyFatPercentage: 19,
      desiredWaist: 78,
      desiredChest: 96,
      desiredHips: 98,
      targetDate: addMonths(new Date(), 3),
      goalType: 'maintenance',
      isActive: true
    },
    measurements: [
      { weight: 70.6, bodyFatPercentage: 19.8, chest: 95, waist: 79, hips: 99, shoulders: 109, arm: 31, thigh: 56 },
      { weight: 70.4, bodyFatPercentage: 19.6, chest: 95, waist: 78.8, hips: 98.8, shoulders: 109, arm: 31, thigh: 56 },
      { weight: 70.5, bodyFatPercentage: 19.5, chest: 95.5, waist: 78.6, hips: 98.6, shoulders: 109.5, arm: 31.2, thigh: 56 },
      { weight: 70.1, bodyFatPercentage: 19.3, chest: 95.5, waist: 78.3, hips: 98.4, shoulders: 109.5, arm: 31.2, thigh: 55.8 },
      { weight: 70.2, bodyFatPercentage: 19.1, chest: 96, waist: 78, hips: 98, shoulders: 110, arm: 31.5, thigh: 55.8 }
    ]
  }
];

const seed = async () => {
  await connectDB();

  const demoEmails = [
    ...demoUsers.map((item) => item.user.email),
    'admin@bodyvision.local'
  ];

  const oldUsers = await User.find({ email: { $in: demoEmails } }).select('_id');
  const oldUserIds = oldUsers.map((user) => user._id);

  await Promise.all([
    BodyMeasurement.deleteMany({ user: { $in: oldUserIds } }),
    FitnessGoal.deleteMany({ user: { $in: oldUserIds } }),
    ProgressPhoto.deleteMany({ user: { $in: oldUserIds } }),
    WorkoutPlan.deleteMany({ user: { $in: oldUserIds } }),
    User.deleteMany({ email: { $in: demoEmails } })
  ]);

  const startDate = addDays(new Date(), -56);

  for (const demo of demoUsers) {
    const user = await User.create(demo.user);

    const measurements = demo.measurements.map((measurement, index) => ({
      ...measurement,
      measuredAt: addDays(startDate, index * 14),
      user: user._id,
      notes: index === 0 ? 'Стартовый демонстрационный замер' : 'Тестовая история прогресса'
    }));

    await BodyMeasurement.insertMany(measurements);
    await FitnessGoal.create({ ...demo.goal, user: user._id });
    await WorkoutPlan.insertMany([
      {
        user: user._id,
        title: 'Full body strength',
        dayOfWeek: 'monday',
        workoutType: 'strength',
        completed: true,
        exercises: [
          { name: 'Squat', sets: 4, reps: '8-10' },
          { name: 'Bench press', sets: 4, reps: '8-10' },
          { name: 'Row', sets: 3, reps: '10-12' }
        ]
      },
      {
        user: user._id,
        title: 'Cardio and core',
        dayOfWeek: 'wednesday',
        workoutType: 'cardio',
        completed: false,
        exercises: [
          { name: 'Bike interval', sets: 6, reps: '2 min' },
          { name: 'Plank', sets: 3, reps: '45 sec' }
        ]
      },
      {
        user: user._id,
        title: 'Mobility recovery',
        dayOfWeek: 'saturday',
        workoutType: 'mobility',
        completed: false,
        exercises: [
          { name: 'Hip mobility', sets: 2, reps: '8 min' },
          { name: 'Shoulder mobility', sets: 2, reps: '8 min' }
        ]
      }
    ]);
    await ProgressPhoto.insertMany([
      {
        user: user._id,
        imageData: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22480%22 height=%22640%22 viewBox=%220 0 480 640%22%3E%3Crect width=%22480%22 height=%22640%22 fill=%22%23e0f2fe%22/%3E%3Ccircle cx=%22240%22 cy=%22118%22 r=%2252%22 fill=%22%232563eb%22 opacity=%22.75%22/%3E%3Cpath d=%22M150 250 Q240 190 330 250 L300 520 Q240 560 180 520 Z%22 fill=%22%231f7a8c%22 opacity=%22.72%22/%3E%3Ctext x=%22240%22 y=%22602%22 font-family=%22Arial%22 font-size=%2228%22 fill=%22%230f172a%22 text-anchor=%22middle%22%3EStart photo%3C/text%3E%3C/svg%3E',
        caption: 'Demo start photo',
        takenAt: addDays(startDate, 0)
      },
      {
        user: user._id,
        imageData: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22480%22 height=%22640%22 viewBox=%220 0 480 640%22%3E%3Crect width=%22480%22 height=%22640%22 fill=%22%23dcfce7%22/%3E%3Ccircle cx=%22240%22 cy=%22118%22 r=%2252%22 fill=%22%23059669%22 opacity=%22.76%22/%3E%3Cpath d=%22M165 250 Q240 205 315 250 L292 512 Q240 548 188 512 Z%22 fill=%22%23047857%22 opacity=%22.72%22/%3E%3Ctext x=%22240%22 y=%22602%22 font-family=%22Arial%22 font-size=%2228%22 fill=%22%230f172a%22 text-anchor=%22middle%22%3ECurrent photo%3C/text%3E%3C/svg%3E',
        caption: 'Demo current photo',
        takenAt: addDays(startDate, 56)
      }
    ]);
  }

  await User.create({
    name: 'Admin Demo',
    email: 'admin@bodyvision.local',
    password: 'Admin12345',
    role: 'admin',
    gender: 'other',
    age: 28,
    height: 175,
    currentWeight: 72,
    activityLevel: 'moderate'
  });

  console.log('Seed completed successfully');
  console.table([
    { role: 'weight loss demo', email: 'demo@bodyvision.local', password: 'Demo12345' },
    { role: 'muscle gain demo', email: 'maria@bodyvision.local', password: 'Demo12345' },
    { role: 'maintenance demo', email: 'alex@bodyvision.local', password: 'Demo12345' },
    { role: 'admin demo', email: 'admin@bodyvision.local', password: 'Admin12345' }
  ]);

  await mongoose.connection.close();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
