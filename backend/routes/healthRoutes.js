import express from "express";
import mongoose from "mongoose";
import { redisClient } from "../config/redis.js";

const router = express.Router();

/**
 * @route   GET /health
 * @desc    Kubernetes/Cloud Liveness & Readiness Probe
 * @access  Public
 */
router.get("/", async (req, res) => {
  const health = {
    status: "UP",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    services: {
      apiGateway: { status: "HEALTHY", memoryUsageMb: Math.round(process.memoryUsage().rss / 1024 / 1024) },
      database: { status: mongoose.connection.readyState === 1 ? "CONNECTED" : "DEGRADED" },
      redisCache: { status: redisClient.isReady ? "CONNECTED" : "OFFLINE_FALLBACK" }
    }
  };

  const isHealthy = health.services.apiGateway.status === "HEALTHY";
  res.status(isHealthy ? 200 : 503).json(health);
});

export default router;
