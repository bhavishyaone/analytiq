import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import User    from './src/models/User.js';
import Project from './src/models/Project.js';
import Event   from './src/models/Event.js';
import Funnel  from './src/models/Funnel.js';


const randomBetween = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomMinutes = (min, max) =>
  randomBetween(min, max) * 60 * 1000;

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const dateFromNow = (daysAgo, extraMs = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(randomBetween(8, 22), randomBetween(0, 59), 0, 0);
  return new Date(d.getTime() + extraMs);
};


const PAGES    = ['/', '/pricing', '/features', '/docs', '/blog', '/dashboard'];
const BROWSERS = ['Chrome', 'Safari', 'Firefox', 'Edge'];
const OS_LIST  = ['macOS', 'Windows', 'iOS', 'Android'];
const COUNTRIES = ['US', 'IN', 'GB', 'DE', 'CA', 'AU', 'FR', 'JP'];

const COMMON_EVENTS = [
  'page_view', 'button_click', 'feature_used',
  'settings_opened', 'video_played', 'error_occurred',
];


async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URL);
  console.log('Connected.\n');


  const existingUser = await User.findOne({ email: 'demo@gmail.com' });
  if (existingUser) {
    const existingProject = await Project.findOne({ owner: existingUser._id });
    if (existingProject) {
      await Event.deleteMany({ projectId: existingProject._id });
      await Funnel.deleteMany({ projectId: existingProject._id });
      await Project.deleteOne({ _id: existingProject._id });
    }
    await User.deleteOne({ _id: existingUser._id });
    console.log('Old demo data cleared.\n');
  }


  const hashedPassword = await bcrypt.hash('demo123', 10);
  const user = await User.create({
    name: 'Demo User',
    email: 'demo@gmail.com',
    password: hashedPassword,
  });


  const apiKey  = crypto.randomBytes(24).toString('hex');
  const project = await Project.create({
    name: 'Demo App',
    owner: user._id,
    apiKey,
  });

  console.log('Demo user and project created.');
  console.log('API Key:', apiKey, '\n');

  const pid    = project._id;
  const events = [];

  console.log('Seeding cohort-based retention events...');

  const cohorts = [
    { weekStart: 126, size: 8 },
    { weekStart: 119, size: 10 },
    { weekStart: 112, size: 7 },
    { weekStart: 105, size: 11 },
    { weekStart: 98, size: 14 },
    { weekStart: 91, size: 12 },
    { weekStart: 84, size: 10 },
    { weekStart: 77, size: 12 },
    { weekStart: 70, size: 9  },
    { weekStart: 63, size: 14 },
    { weekStart: 56, size: 11 },
    { weekStart: 49, size: 13 },
    { weekStart: 42, size: 16 },
    { weekStart: 35, size: 12 },
    { weekStart: 28, size: 18 },
    { weekStart: 21, size: 15 },
    { weekStart: 14, size: 20 },
    { weekStart:  7, size: 22 },
  ];

  let userCounter = 1;

  for (const { weekStart, size } of cohorts) {
    for (let u = 0; u < size; u++) {
      const userId    = `user_${userCounter++}`;
      const joinDay   = weekStart - randomBetween(0, 6); 
      const props     = {
        page:    pickRandom(PAGES),
        browser: pickRandom(BROWSERS),
        os:      pickRandom(OS_LIST),
        country: pickRandom(COUNTRIES),
      };


      events.push({ projectId: pid, name: 'page_view',         userId, properties: props, timestamp: dateFromNow(joinDay) });
      events.push({ projectId: pid, name: 'signup_started',    userId, properties: props, timestamp: dateFromNow(joinDay, randomMinutes(5, 20)) });
      events.push({ projectId: pid, name: 'signup_completed',  userId, properties: props, timestamp: dateFromNow(joinDay, randomMinutes(20, 60)) });


      if (Math.random() < 0.85 && joinDay - 1 >= 0) {
        events.push({ projectId: pid, name: 'page_view',    userId, properties: props, timestamp: dateFromNow(joinDay - 1) });
        events.push({ projectId: pid, name: 'feature_used', userId, properties: props, timestamp: dateFromNow(joinDay - 1, randomMinutes(10, 40)) });
      }


      if (Math.random() < 0.70 && joinDay - 3 >= 0) {
        events.push({ projectId: pid, name: 'page_view',    userId, properties: props, timestamp: dateFromNow(joinDay - 3) });
        events.push({ projectId: pid, name: 'button_click', userId, properties: props, timestamp: dateFromNow(joinDay - 3, randomMinutes(5, 30)) });
      }


      if (Math.random() < 0.55 && joinDay - 7 >= 0) {
        events.push({ projectId: pid, name: 'page_view',     userId, properties: props, timestamp: dateFromNow(joinDay - 7) });
        events.push({ projectId: pid, name: 'feature_used',  userId, properties: props, timestamp: dateFromNow(joinDay - 7, randomMinutes(10, 50)) });
        events.push({ projectId: pid, name: 'settings_opened', userId, properties: props, timestamp: dateFromNow(joinDay - 7, randomMinutes(60, 120)) });
      }


      if (Math.random() < 0.40 && joinDay - 14 >= 0) {
        events.push({ projectId: pid, name: 'page_view',    userId, properties: props, timestamp: dateFromNow(joinDay - 14) });
        events.push({ projectId: pid, name: 'feature_used', userId, properties: props, timestamp: dateFromNow(joinDay - 14, randomMinutes(20, 80)) });
      }


      if (Math.random() < 0.25 && joinDay - 30 >= 0) {
        events.push({ projectId: pid, name: 'page_view',           userId, properties: props, timestamp: dateFromNow(joinDay - 30) });
        events.push({ projectId: pid, name: 'checkout_started',    userId, properties: props, timestamp: dateFromNow(joinDay - 30, randomMinutes(15, 45)) });
        events.push({ projectId: pid, name: 'checkout_completed',  userId, properties: props, timestamp: dateFromNow(joinDay - 30, randomMinutes(45, 90)) });
      }
    }
  }


  console.log('Seeding chart background noise...');

  for (let day = 90; day >= 0; day--) {
    const baseCount = day < 7 ? 50 : day < 30 ? 30 : 12;
    const count     = randomBetween(baseCount - 8, baseCount + 15);

    for (let j = 0; j < count; j++) {
      events.push({
        projectId:  pid,
        name:       pickRandom(COMMON_EVENTS),
        userId:     `anon_${randomBetween(1, 80)}`,
        properties: {
          page:    pickRandom(PAGES),
          browser: pickRandom(BROWSERS),
          os:      pickRandom(OS_LIST),
          country: pickRandom(COUNTRIES),
        },
        timestamp: dateFromNow(day),
      });
    }
  }


  console.log('Seeding funnel conversion events...');

  const funnelUsers = Array.from({ length: 200 }, (_, i) => `funnel_user_${i + 1}`);

  for (const userId of funnelUsers) {
    const base = dateFromNow(randomBetween(5, 35));

    events.push({ projectId: pid, name: 'page_view',          userId, properties: {}, timestamp: new Date(base.getTime()) });

    if (Math.random() < 0.75) {
      events.push({ projectId: pid, name: 'signup_completed', userId, properties: {}, timestamp: new Date(base.getTime() + 180_000) });
      
      if (Math.random() < 0.60) {
        events.push({ projectId: pid, name: 'checkout_started', userId, properties: {}, timestamp: new Date(base.getTime() + 600_000) });
        
        if (Math.random() < 0.75) {
          events.push({ projectId: pid, name: 'checkout_completed', userId, properties: {}, timestamp: new Date(base.getTime() + 900_000) });
        }
      }
    }
  }

  await Event.insertMany(events);
  console.log(`Inserted ${events.length} total events.\n`);


  await Funnel.create({
    projectId:      pid,
    name:           'Signup to Checkout',
    steps:          ['page_view', 'signup_completed', 'checkout_started', 'checkout_completed'],
    timeWindowDays: 30,
  });

  console.log('─────────────────────────────────────────');
  console.log('Seed complete!');
  console.log('   Login email : demo@gmail.com');
  console.log('   Password    : demo123');
  console.log('   Project     : Demo App');
  console.log('─────────────────────────────────────────');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
