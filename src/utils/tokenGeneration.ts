import JWT from 'jsonwebtoken';

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

// Ensure secrets are defined
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

if (!accessTokenSecret || !refreshTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be defined in environment variables');
}

const generateAccessToken = (userId: number, role: string): string => {
    return JWT.sign(
        { userId, role },
        accessTokenSecret,
        { expiresIn: '1h' }
    );
};

const generateRefreshToken = (userId: number, role: string): string => {
    return JWT.sign(
        { userId, role },
        refreshTokenSecret,
        { expiresIn: '8h' }
    );
};

export { generateAccessToken, generateRefreshToken };