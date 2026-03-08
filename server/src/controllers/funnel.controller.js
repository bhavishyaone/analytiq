import {
  getFunnelServices,
  createFunnelService,
  listFunnelsService,
  deleteFunnelService,
} from '../services/funnel.service.js';
import Project from '../models/Project.js';
import mongoose from 'mongoose';


const getOwnedProject = async (projectId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(projectId)) return null;
  return await Project.findOne({ _id: projectId, owner: userId });
};


export const saveFunnel = async (req, res) => {
  try {
    const { projectId, name, steps, timeWindowDays = 30 } = req.body;

    if (!projectId) return res.status(400).json({ message: 'projectId is required.' });

    const project = await getOwnedProject(projectId, req.user.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    if (!name || name.trim().length === 0)
      return res.status(400).json({ message: 'Funnel name is required.' });

    if (!steps || !Array.isArray(steps) || steps.length < 2)
      return res.status(400).json({ message: 'At least 2 steps are required.' });

    if (steps.length > 20)
      return res.status(400).json({ message: 'At most 20 steps are allowed.' });

    for (const step of steps) {
      if (typeof step !== 'string' || step.trim().length === 0)
        return res.status(400).json({ message: 'Each step must be a non-empty string.' });
    }

    const funnel = await createFunnelService({
      projectId,
      name: name.trim(),
      steps: steps.map((s) => s.trim()),
      timeWindowDays,
    });

    return res.status(201).json({ message: 'Funnel saved.', funnel });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
};



export const listFunnels = async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) return res.status(400).json({ message: 'projectId query param is required.' });

    const project = await getOwnedProject(projectId, req.user.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    const funnels = await listFunnelsService(projectId);
    return res.status(200).json({ message: 'Funnels fetched.', funnels });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
};


export const removeFunnel = async (req, res) => {
  try {
    const { funnelId } = req.params;
    const { projectId } = req.query;

    if (!projectId) return res.status(400).json({ message: 'projectId query param is required.' });

    const project = await getOwnedProject(projectId, req.user.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    const deleted = await deleteFunnelService(funnelId, projectId);
    if (!deleted) return res.status(404).json({ message: 'Funnel not found.' });

    return res.status(200).json({ message: 'Funnel deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
};


export const getFunnel = async (req, res) => {
  try {
    const project = await getOwnedProject(req.params.projectId, req.user.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    const { steps } = req.body;

    if (!steps || !Array.isArray(steps))
      return res.status(400).json({ message: 'steps must be an array.' });

    if (steps.length < 2)
      return res.status(400).json({ message: 'Steps array must contain at least 2 steps.' });

    if (steps.length > 20)
      return res.status(400).json({ message: 'At most 20 steps are allowed.' });

    for (const step of steps) {
      if (typeof step !== 'string' || step.trim().length === 0)
        return res.status(400).json({ message: 'Each step must be a non-empty string.' });
    }

    const days = parseInt(req.query.days) || 30;
    if (days < 1 || days > 365)
      return res.status(400).json({ message: 'days must be between 1 and 365.' });

    const data = await getFunnelServices(req.params.projectId, steps, days);
    return res.status(200).json({ message: 'Funnel data fetched.', data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
};