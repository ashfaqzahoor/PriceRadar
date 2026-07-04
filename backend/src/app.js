import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { mountSwagger } from './config/swagger.js';
import { errorMiddleware, notFound } from './middlewares/error.middleware.js';
import { requestLogger } from './middlewares/logger.middleware.js';
import { apiRateLimiter } from './middlewares/rateLimit.middleware.js';
import { apiRoutes } from './routes/index.js';

export const createApp = () => {
  const app = express();
  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true
    })
  );
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  app.use(requestLogger);
  app.use('/api/v1', apiRateLimiter, apiRoutes);
  mountSwagger(app);
  app.use(notFound);
  app.use(errorMiddleware);

  return app;
};
