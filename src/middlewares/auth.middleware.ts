import jwt, { JwtPayload } from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import { prisma } from '../database/prisma';
import { Role } from '../database/generated/prisma/client';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}

/**
 * Middleware: Verify JWT for all authenticated users
 */
const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized: No token provided', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    // Ensure ACCESS_TOKEN_SECRET exists
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new Error('ACCESS_TOKEN_SECRET is not defined in environment variables');
    }

    const decoded = jwt.verify(token, secret) as JwtPayload & {
      userId: number;
      role: string;
    };

    req.user = decoded; // decoded contains userId, role, iat, exp
    next();

  } catch (err) {
    // Type guard for error
    if (err instanceof Error) {
      if (err.name === 'TokenExpiredError') {
        return next(new AppError('Unauthorized: Access token expired', 401));
      }
      return next(new AppError('Unauthorized: Invalid access token', 401));
    }
    return next(new AppError('Unauthorized: Unknown error', 401));
  }
});

/**
 * Middleware: Verify Admin Role (Must run AFTER verifyJWT)
 * Checks DB to ensure user is still an admin and not banned
 */
const verifyAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Ensure verifyJWT has run
  if (!req.user || !req.user.userId) {
    return next(new AppError('Unauthorized: User not authenticated', 401));
  }

  const user = await prisma.users.findUnique({
    where: { id: req.user.userId },
    select: { role: true, isBanned: true }
  });

  if (!user) {
    return next(new AppError('Unauthorized: User not found', 401));
  }

  if (user.role !== Role.ADMIN) {
    return next(new AppError("Forbidden: You don't have access to this resource.", 403));
  }

  next();
});

export { verifyJWT, verifyAdmin };