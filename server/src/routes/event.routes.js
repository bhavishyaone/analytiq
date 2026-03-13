import express from 'express'
import cors from 'cors'
import { trackEvent ,batchTrackEvent,getEventsByProject} from '../controllers/event.controller.js'
import apiKeyMiddleware from '../midlleware/apiKey.middleware.js'
import rateLimit from 'express-rate-limit'
import authMiddleware from '../midlleware/auth.middleware.js'

const rateLimiter = rateLimit({
    windowMs:1 * 60 * 1000,
    max:300,
    message: {
        message: 'Too many events sent. Please slow down and try again.',
    }
})


const openCors = cors({ origin: '*' })

const router = express.Router()

router.use(rateLimiter)

/**
 * @swagger
 * /api/events/{projectId}:
 *   get:
 *     summary: Get all events for a project
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by event name (partial match)
 *     responses:
 *       200:
 *         description: Paginated list of events
 *       400:
 *         description: Invalid project ID
 *       404:
 *         description: Project not found
 *       401:
 *         description: Not authenticated
 */
router.get('/:projectId', authMiddleware, getEventsByProject)


router.use(apiKeyMiddleware)


/**
 * @swagger
 * /api/events/track:
 *   post:
 *     summary: Track a single event
 *     tags:
 *       - Events
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: Your project API key (from project settings, not JWT)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: button_clicked
 *               userId:
 *                 type: string
 *                 example: user_123
 *               properties:
 *                 type: object
 *                 example: { "button": "signup", "page": "/home" }
 *     responses:
 *       201:
 *         description: Event tracked
 *       401:
 *         description: Invalid API key
 *       413:
 *         description: Payload too large
 */
router.post("/track", openCors, trackEvent)



/**
 * @swagger
 * /api/events/batch:
 *   post:
 *     summary: Track multiple events in one request
 *     tags:
 *       - Events
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - events
 *             properties:
 *               events:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: page_view
 *                     userId:
 *                       type: string
 *                       example: user_123
 *     responses:
 *       201:
 *         description: All events tracked
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid API key
 */
router.post("/batch", openCors, batchTrackEvent)

export default router;