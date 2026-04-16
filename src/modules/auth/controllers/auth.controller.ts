import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

// register 
const registerUser = asyncHandler(async (req: Request, res: Response , next: NextFunction) => {

    const { name, email, password } = req.body;

    const data = await authService.registerUser({ name, email, password });

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data,
    });
});


// login 
const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = req.body
    const { accessToken, refreshToken, user } = await authService.loginUser( email, password );

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
    });

    res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: {  
            accessToken,
            user,
        }
    });
});


// logout
const logoutUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    await authService.logoutUser(refreshToken);

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
    });

    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
});




// refresh token
const refreshAccessToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const { newAccessToken, newRefreshToken } = await authService.refreshAccessToken(refreshToken);

    // Replace cookie with new refresh token
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
    });

    res.status(200).json({
        success: true,
        message: "Access token refreshed successfully",
        data: {
            token: newAccessToken,
        }
    });
});


// change password
const changePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    await authService.changePassword(req.body.userId, req.body.currentPassword, req.body.newPassword);

    res.status(200).json({
        success: true,
        message: "Password changed successfully",
    });
});


// get profile
const getProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.userId;

    if(!userId) {
        res.status(400).json({
            success: false,
            message: "User ID is required",
        });
        return;
    }

    const data = await authService.getProfile(userId);

    res.status(200).json({
        success: true,
        message: "User profile retrieved successfully",
        data,
    });
});


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getProfile,
}