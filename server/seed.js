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


const randomDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(
    randomBetween(0, 23),
    randomBetween(0, 59),
    randomBetween(0, 59)
  );
  return date;
};


const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];


const EVENT_NAMES = [
  'page_view',
  'button_click',
  'signup_started',
  'signup_completed',
  'feature_used',
  'settings_opened',
  'checkout_started',
  'checkout_completed',
  'error_occurred',
  'video_played',
];


const USER_IDS = Array.from({ length: 40 }, (_, i) => `user_${i + 1}`);


const PAGES    = ['/', '/pricing', '/features', '/docs', '/blog'];
const BROWSERS = ['Chrome', 'Safari', 'Firefox', 'Edge'];
const OS_LIST  = ['macOS', 'Windows', 'iOS', 'Android'];
const COUNTRIES = ['US', 'IN', 'GB', 'DE', 'CA', 'AU'];




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
    console.log('🧹 Old demo data cleared.\n');
  }

  const hashedPassword = await bcrypt.hash('demo123', 10);
  const user = await User.create({
    name: 'Demo User',
    email: 'demo@gmail.com',
    password: hashedPassword,
  });
  console.log('👤 Demo user created:', user.email);

  const apiKey = crypto.randomBytes(24).toString('hex');
  const project = await Project.create({
    name: 'Demo App',
    owner: user._id,
    apiKey,
  });
  console.log('Demo project created:', project.name);
  console.log('API Key:', apiKey);

  console.log('Seeding random events over 90 days...');
  const events = [];

  for (let day = 90; day >= 0; day--) {
    const baseCount = day < 7 ? 60 : day < 30 ? 35 : 15;
    const count     = randomBetween(baseCount - 10, baseCount + 20);

    for (let j = 0; j < count; j++) {
      events.push({
        projectId:  project._id,
        name:       pickRandom(EVENT_NAMES),
        userId:     pickRandom(USER_IDS),
        properties: {
          page:    pickRandom(PAGES),
          browser: pickRandom(BROWSERS),
          os:      pickRandom(OS_LIST),
          country: pickRandom(COUNTRIES),
        },
        timestamp: randomDate(day),
      });
    }
  }

  await Event.insertMany(events);
  console.log(`Inserted ${events.length} random events.`);

  console.log('Seeding funnel-ordered events...');
  const funnelEvents = [];
  const funnelUsers  = USER_IDS.slice(0, 20);

  for (const userId of funnelUsers) {
    const base = randomDate(randomBetween(1, 30));


    funnelEvents.push({
      projectId: project._id,
      name: 'page_view',
      userId,
      properties: {},
      timestamp: new Date(base.getTime()),
    });

    if (Math.random() < 0.8) {
      funnelEvents.push({
        projectId: project._id,
        name: 'signup_started',
        userId,
        properties: {},
        timestamp: new Date(base.getTime() + 60_000),
      });
    }

    if (Math.random() < 0.6) {
      funnelEvents.push({
        projectId: project._id,
        name: 'signup_completed',
        userId,
        properties: {},
        timestamp: new Date(base.getTime() + 180_000),
      });
    }

    if (Math.random() < 0.4) {
      funnelEvents.push({
        projectId: project._id,
        name: 'checkout_started',
        userId,
        properties: {},
        timestamp: new Date(base.getTime() + 600_000),
      });
    }

    if (Math.random() < 0.25) {
      funnelEvents.push({
        projectId: project._id,
        name: 'checkout_completed',
        userId,
        properties: {},
        timestamp: new Date(base.getTime() + 900_000),
      });
    }
  }

  await Event.insertMany(funnelEvents);
  console.log(`Inserted ${funnelEvents.length} funnel-ordered events.`);

  await Funnel.create({
    projectId:      project._id,
    name:           'Signup to Checkout',
    steps:          ['page_view', 'signup_completed', 'checkout_started', 'checkout_completed'],
    timeWindowDays: 30,
  });
  console.log('Demo funnel "Signup to Checkout" saved.');

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
