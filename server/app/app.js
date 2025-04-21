import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

export default function setupExpressApp(app) {
  // Middlewares globais
  app.use(cors());
  app.use(bodyParser.json());
  
  // Rotas
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  
  // Rota de health check
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy" });
  });
}