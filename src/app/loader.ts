import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { connectDB } from '../database/prisma';
import  logger  from '../utils/logger';

// Initialize bootstrapping
const bootstrap = async () => {
    // 1. Load env vars
    dotenv.config();

    // 2. Create logs directory
    if (process.env.NODE_ENV === 'production') {
        const logsDir = path.join(__dirname, '..', '..', 'logs'); // Adjust path relative to src/app
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
    }

    // 2. Connect to DB
    const isConnected = await connectDB();
    if (!isConnected) {
        logger.error("[Loader] Database connection failed. Exiting...");
        process.exit(1);
    }

    logger.info("[Loader] Application bootstrapped successfully.");
};

export { bootstrap };
