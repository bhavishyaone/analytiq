import express from 'express';
import { getFunnel, saveFunnel, listFunnels, removeFunnel } from '../controllers/funnel.controller.js';
import authMiddleware from '../midlleware/auth.middleware.js';

const router = express.Router();


/**
 * @swagger
 * /api/funnel:
 *   post:
 *     summary: Save a funnel definition
 *     tags: [Funnels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [projectId, name, steps]
 *             properties:
 *               projectId: { type: string }
 *               name: { type: string }
 *               steps:
 *                 type: array
 *                 items: { type: string }
 *               timeWindowDays: { type: integer, default: 30 }
 *     responses:
 *       201:
 *         description: Funnel saved successfully
 */
router.post('/', authMiddleware, saveFunnel);


/**
 * @swagger
 * /api/funnel:
 *   get:
 *     summary: List saved funnels for a project
 *     tags: [Funnels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projectId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Array of saved funnels
 */
router.get('/', authMiddleware, listFunnels);


/**
 * @swagger
 * /api/funnel/{funnelId}:
 *   delete:
 *     summary: Delete a saved funnel
 *     tags: [Funnels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: funnelId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: projectId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Funnel deleted
 */
router.delete('/:funnelId', authMiddleware, removeFunnel);


/**
 * @swagger
 * /api/funnel/{projectId}/run:
 *   post:
 *     summary: Compute funnel results with strict step ordering
 *     tags: [Funnels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: days
 *         schema: { type: integer, default: 30 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [steps]
 *             properties:
 *               steps:
 *                 type: array
 *                 items: { type: string }
 *                 example: ["page_view", "signup", "checkout"]
 *     responses:
 *       200:
 *         description: Step + count array showing conversion and dropoff
 */
router.post('/:projectId/run', authMiddleware, getFunnel);


export default router;
