import Event from '../models/Event.js';
import Funnel from '../models/Funnel.js';
import mongoose from 'mongoose';

export const createFunnelService = async ({ projectId, name, steps, timeWindowDays }) => {
  const funnel = await Funnel.create({ projectId, name, steps, timeWindowDays });
  return funnel;
};

export const listFunnelsService = async (projectId) => {
  return await Funnel.find({ projectId }).sort({ createdAt: -1 }).lean();
};


export const deleteFunnelService = async (funnelId, projectId) => {
  return await Funnel.findOneAndDelete({ _id: funnelId, projectId });
};


export const getFunnelServices = async (projectId, steps, days) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const objectId = new mongoose.Types.ObjectId(projectId);


  const firstStepUsers = await Event.find({
    projectId: objectId,
    name: steps[0],
    userId: { $ne: null },
    timestamp: { $gte: startDate },
  })
    .select('userId timestamp')
    .lean();


  const userFirstStepTime = {};
  for (const e of firstStepUsers) {
    if (!userFirstStepTime[e.userId] || e.timestamp < userFirstStepTime[e.userId]) {
      userFirstStepTime[e.userId] = e.timestamp;
    }
  }

  let eligibleUsers = Object.keys(userFirstStepTime); 
  const funnelResult = [{ step: steps[0], count: eligibleUsers.length }];


  for (let i = 1; i < steps.length; i++) {
    if (eligibleUsers.length === 0) {
      funnelResult.push({ step: steps[i], count: 0 });
      continue;
    }
    
    const prevQualifyTimes = userFirstStepTime; 

    const stepEvents = await Event.find({
      projectId: objectId,
      name: steps[i],
      userId: { $in: eligibleUsers },
      timestamp: { $gte: startDate },
    })
      .select('userId timestamp')
      .lean();



    const nextEligible = [];
    const nextQualifyTimes = {};

    for (const e of stepEvents) {
      const uid = e.userId;
      const prevTime = prevQualifyTimes[uid];
      if (prevTime && e.timestamp > prevTime) {

        if (!nextQualifyTimes[uid] || e.timestamp < nextQualifyTimes[uid]) {
          nextQualifyTimes[uid] = e.timestamp; 
        }
      }
    }

    for (const uid of eligibleUsers) {
      if (nextQualifyTimes[uid]) {
        nextEligible.push(uid);
        userFirstStepTime[uid] = nextQualifyTimes[uid]; 
      }
    }

    funnelResult.push({ step: steps[i], count: nextEligible.length });
    eligibleUsers = nextEligible;
  }

  return funnelResult;
};