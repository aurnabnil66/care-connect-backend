import express from "express";
import dotenv from "dotenv";
// import userRoutes from "./routes/user.route";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
  res.redirect("/api/users");
});

// app.use("/api/users", userRoutes);

export default app;
