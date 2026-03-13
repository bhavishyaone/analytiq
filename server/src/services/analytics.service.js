import mongoose from "mongoose";
import Event from '../models/Event.js'

const toObjectId = (id) => new mongoose.Types.ObjectId(id)

// Overview dega - total events, unique user count — all time or last N days

export const getOverviewServices = async(projectId,days)=>{

    // Start date , N days ago from now
    const startDate = new Date()
    startDate.setDate(startDate.getDate()-days)

    const totalEvents = await Event.countDocuments({
        projectId:projectId,
        timestamp: { $gte: startDate }
    })

    const uniqueUserId = await Event.distinct('userId',{
        projectId:projectId,
        userId:{$ne:null},
        timestamp:{$gt:startDate}
    })

    return {
        totalEvents,
        uniqueUsers: uniqueUserId.length,
        periodDays: days
    };
};



// Events Over Time , har din ka count dega event ke saath 

export const getEventsOverTimeService = async(projectId,days)=>{
    const startDate = new Date();
    startDate.setDate(startDate.getDate()-days)
   

    // MONGODB Aggregation 
    // 1. $match -filter to this project and within date range
    // 2. $group —group events by calendar date, count each group
    // 3. $sort  — sort by date ascending 
    const result = await Event.aggregate([
        {
            $match:{
                projectId: toObjectId(projectId),
                timestamp: { $gte: startDate },
            }
        },

        {
            $group:{
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                count: { $sum: 1 },
            }
        },

        {
            $sort: { _id: 1 }
        }
    ])

    // _id ko date mein rename kiya hai , better responses ke liye    
    return result.map((e)=>({
        date: e._id,
        count: e.count,
    }))
}


// Top 10 Events joh ho rahe hai 

export const getTopEventsService = async(projectId,days)=>{
    const startDate  = new Date()
    startDate.setDate(startDate.getDate()-days)

    const result = await Event.aggregate([
        {
            $match:{
                projectId: toObjectId(projectId),
                timestamp: { $gte: startDate }
            }
        },
        {
            $group:{
                _id: '$name',
                count:       { $sum: 1 },
                uniqueUsers: { $addToSet: '$userId' },   
                lastSeen:    { $max: '$timestamp' }      
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: 50   
        }
    ])

    return result.map((e)=>({
        name:        e._id,
        count:       e.count,
        uniqueUsers: e.uniqueUsers.filter(u => u !== null).length,  
        lastSeen:    e.lastSeen
    }))
}


// Active User services 

export const getActiveUsersService = async(projectId)=>{
    const now = new Date()

    const oneDayAgo = new Date(now - 1 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [dauIds, wauIds, mauIds] = await Promise.all([

      Event.distinct('userId',{
        projectId: projectId,
        userId: { $ne: null },
        timestamp: { $gte: oneDayAgo },
      }),

      Event.distinct('userId',{
        projectId: projectId,
        userId: { $ne: null },
        timestamp: { $gte: sevenDaysAgo }
      }),

      Event.distinct('userId', {
        projectId: projectId,
        userId: { $ne: null },
        timestamp: { $gte: thirtyDaysAgo },
      }),

    ])

    return {
        dau:dauIds.length,
        wau:wauIds.length,
        mau:mauIds.length
    }
}




export const getRetentionService = async (projectId, days) => {
    
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const objectId = new mongoose.Types.ObjectId(projectId);

  // Step 1: Get the first event timestamp for every user (their cohort entry point)
  const userFirstSeen = await Event.aggregate([
    {
      $match: {
        projectId: objectId,
        userId: { $ne: null },
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: '$userId',
        firstSeen: { $min: '$timestamp' },
      },
    },
  ]);

  if (userFirstSeen.length === 0) return [];

  // Step 2: Get ALL event timestamps for each user so we can check point-in-time activity
  const allUserIds = userFirstSeen.map((u) => u._id);
  const allEvents = await Event.aggregate([
    {
      $match: {
        projectId: objectId,
        userId: { $in: allUserIds },
        timestamp: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: '$userId',
        // Collect all timestamps as an array so we can query per retention period
        timestamps: { $push: '$timestamp' },
      },
    },
  ]);

  // Build a map: userId → Set of active day-offsets from firstSeen
  const firstSeenMap = {};
  for (const u of userFirstSeen) {
    firstSeenMap[u._id] = u.firstSeen;
  }

  const userTimestampsMap = {};
  for (const u of allEvents) {
    userTimestampsMap[u._id] = u.timestamps;
  }

  // Step 3: Group users into weekly cohorts by their firstSeen date
  const cohorts = {};
  for (const user of userFirstSeen) {
    const d = new Date(user.firstSeen);
    const dayOfWeek = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const weekKey = monday.toISOString().split('T')[0];

    if (!cohorts[weekKey]) cohorts[weekKey] = [];
    cohorts[weekKey].push(user._id);
  }

  // Step 4: For each cohort and each retention period, check if the user
  // had ANY event within a ±1 day window around that target day.
  // This is TRUE point-in-time cohort retention, not a last-seen approximation.
  const retentionPeriods = [1, 7, 14, 30];
  const WINDOW_MS = 1 * 24 * 60 * 60 * 1000; // 1-day tolerance window

  const result = Object.keys(cohorts)
    .sort()
    .map((weekKey) => {
      const userIds = cohorts[weekKey];
      const totalUsers = userIds.length;
      const retention = {};

      for (const period of retentionPeriods) {
        const periodMs = period * 24 * 60 * 60 * 1000;

        const count = userIds.filter((uid) => {
          const firstSeen = firstSeenMap[uid];
          const timestamps = userTimestampsMap[uid] || [];
          const targetTime = new Date(firstSeen).getTime() + periodMs;

          // Check if ANY of this user's events falls within ±1 day of the target retention day
          return timestamps.some((ts) => {
            const diff = Math.abs(new Date(ts).getTime() - targetTime);
            return diff <= WINDOW_MS;
          });
        }).length;

        retention[`day${period}`] = count;
      }

      return {
        cohortWeek: weekKey,
        totalUsers,
        ...retention,
      };
    });

  return result;
};
