// PSTWEBSITE/backend/src/app.js
import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));



import userRouter from './routes/user.route.js';
import schedulesRouter from './routes/schedule.routes.js';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/schedules", schedulesRouter);

export default app;