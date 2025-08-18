import "dotenv/config";
import express from "express";
import authRoutes from "./routes/auth.routes";
import testRoutes from "./routes/test.routes";
import rateLimit from "express-rate-limit";
import adminRoutes from "./routes/admin.routes"
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use("/api", testRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});