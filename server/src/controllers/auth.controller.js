import User from '../models/User.js'
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js'
import { OAuth2Client } from 'google-auth-library'

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!email || !password)
            return res.status(400).json({ message: "All fields are required." })

        const existingUser = await User.findOne({ email })
        if (existingUser)
            return res.status(400).json({ message: "User already exists." })

        const hashedPassword = await hashPassword(password)
        const user = await User.create({ name: name?.trim() || '', email, password: hashedPassword })
        const token = generateToken(user._id)

        return res.status(201).json({
            message: "User created",
            token,
            user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error." })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" })

        const isMatch = await comparePassword(password, user.password)
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" })

        const token = generateToken(user._id)
        return res.json({ message: "Login successful", token })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server error." })
    }
}


export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }
        return res.status(200).json({
            message: 'User fetched successfully',
            user
        })
    } 
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server error.' })
    }
}


export const updateMe = async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword, confirmPassword } = req.body

        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        if (name) user.name = name.trim()

        if (email) {
            const emailTaken = await User.findOne({ email, _id: { $ne: user._id } })
            if (emailTaken) {
                return res.status(400).json({ message: 'Email already in use.' })
            }
            user.email = email
        }

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password is required to set a new one.' })
            }
            if (confirmPassword && newPassword !== confirmPassword) {
                return res.status(400).json({ message: 'New password and confirm password do not match.' })
            }
            const isMatch = await comparePassword(currentPassword, user.password)
            if (!isMatch) {
                return res.status(401).json({ message: 'Current password is incorrect.' })
            }
            user.password = await hashPassword(newPassword)
        }

        await user.save()

        return res.status(200).json({
            message: 'Account updated successfully',
            user: { id: user._id, name: user.name, email: user.email }
        })
    } 
    catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server error.' })
    }
}

export const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        })
        const { email, name } = ticket.getPayload()
        let user = await User.findOne({ email })
        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8) + 'A1!'
            const hashedRandomPassword = await hashPassword(randomPassword)
            user = await User.create({
                name: name,
                email: email,
                password: hashedRandomPassword
            })
        }
        const token = generateToken(user._id)
        return res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email }
        })
    } 
    catch (err) {
        return res.status(401).json({ message: 'Invalid Google Token' })
    }
}
