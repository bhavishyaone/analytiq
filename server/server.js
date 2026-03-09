import dotenv from 'dotenv'
dotenv.config()
import { valudateENV } from './src/config/env.js';
valudateENV();
import app from "./app.js";
import { connectDB } from './src/config/db.js';

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
