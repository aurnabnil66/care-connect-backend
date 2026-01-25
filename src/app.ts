import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.route";
import authRoutes from "./routes/auth.route";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Mount routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

export default app;
