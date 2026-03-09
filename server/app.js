import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from '../server/src/routes/auth.routes.js'
import projectRoutes from '../server/src/routes/project.routes.js'
import eventRoutes from '../server/src/routes/event.routes.js'
import analyticsRoutes from '../server/src/routes/analytics.routes.js'
import funnelRoutes from '../server/src/routes/funnel.routes.js'
import errorHandler from '../server/src/midlleware/error.middleware.js'
import { httpLogger } from '../server/src/config/logger.js'
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../server/src/config/swagger.js';

const app = express();
app.use(httpLogger);
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/",(req,res)=>{
    return res.status(200).json({message:`Chaliye Shuru karte hai.`})
})

app.use("/api/auth",authRoutes)
app.use("/api/projects",projectRoutes)
app.use("/api/events",eventRoutes)
app.use("/api/analytics",analyticsRoutes)
app.use("/api/funnel",funnelRoutes)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use((req, res) => {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` } })
})
app.use(errorHandler)

export default app;


