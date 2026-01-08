import express from 'express';
import cors from 'cors';
import healthRoutes from "./routes/health.routes.js";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import lineRoutes from "./routes/line.routes.js";
import statsRoutes from "./routes/stats.routes.js";

const app = express();

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    status: 'API Tisséa running',
    version: '1.0.0',
    endpoints: {
      auth: [
        'POST /api/users/signup',
        'POST /api/users/login'
      ],
      categories: [
        'GET /api/categories/:id/lines'
      ],
      lines: [
        'GET /api/lines/:id',
        'GET /api/lines/:id/stops',
        'POST /api/lines/:id/stops',
        'PUT /api/lines/:id',
        'DELETE /api/lines/:lineId/stops/:stopId'
      ],
      stats: [
        'GET /api/stats/distance/stops/:id1/:id2',
        'GET /api/stats/distance/lines/:id'
      ]
    }
  });
});

app.use("/api", healthRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", lineRoutes);
app.use("/api", statsRoutes);

export default app;