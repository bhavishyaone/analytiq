import { login, register, getMe, updateMe, googleLogin } from '../controllers/auth.controller.js'
import express from 'express'
import rateLimiter from '../midlleware/rateLimiter.js'
import authMiddleware from '../midlleware/auth.middleware.js'

const router = express.Router()

router.use(rateLimiter)

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: MyPassword123!
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Email already exists
 */

router.post("/register", register)
router.post("/google", googleLogin)
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: MyPassword123!
 *     responses:
 *       200:
 *         description: Login successful — returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", login)


/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in user profile
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user object (without password)
 *       401:
 *         description: Not authenticated
 */
router.get('/me', authMiddleware, getMe)


/**
 * @swagger
 * /api/auth/me:
 *   patch:
 *     summary: Update current user profile (name, email, password)
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Bhavishya Sharma
 *               email:
 *                 type: string
 *                 example: new@email.com
 *               currentPassword:
 *                 type: string
 *                 example: OldPass123!
 *               newPassword:
 *                 type: string
 *                 example: NewPass456!
 *               confirmPassword:
 *                 type: string
 *                 example: NewPass456!
 *                 description: Must match newPassword
 *     responses:
 *       200:
 *         description: Account updated
 *       400:
 *         description: Validation error or passwords do not match
 *       401:
 *         description: Wrong current password
 */
router.patch('/me', authMiddleware, updateMe)

export default router;