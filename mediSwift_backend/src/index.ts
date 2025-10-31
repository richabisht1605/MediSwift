import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import userRoutes from "./routes/appRoutes"; // ✅ import your route here

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use the imported route
app.use("/api/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("🚑 MediSwift Backend is Running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

