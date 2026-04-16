import { authRepo } from '../repositories/auth.repository';
import bcrypt from 'bcryptjs';
import AppError from '../../../utils/AppError';
import { generateAccessToken, generateRefreshToken } from '../../../utils/tokenGeneration';



// Password hashing function as helper
const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

// Password comparison function as helper
const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};





// User registration function

type RegisterData = {
    name: string;
    email: string;
    password: string;
    role?: 'USER' | 'ADMIN';
}

const registerUser = async (data : RegisterData) => {

    if(!data.name || !data.email || !data.password) {
        throw new AppError("All field are required.", 400);
    }

    if(data.password.length < 6) {
        throw new AppError("Password must be at least 6 characters long.", 400);
    }

    // Check if user already exists
    const existingUser = await authRepo.findUserByEmail(data.email);
    if (existingUser) {
        throw new AppError('User already exists with this email', 400);
    }

    // Hash the password
    const hashedPassword = await hashPassword(data.password);

    // Create the user
    const user = await authRepo.createUser({
        ...data,
        password: hashedPassword
    });

    const { password, refreshToken, expiresAt, ...userData } = user;

    return userData;

}




// User login function
const loginUser = async ( email : string , password : string ) => {

    if (!email || !password) {
    throw new AppError("Email and password are required", 400);
}
    
    const existingUser = await authRepo.findUserByEmail(email);

    if(!existingUser) {
        throw new AppError('Invalid email or password.', 401);
    }

    const isPasswordValid = await comparePasswords(password, existingUser.password);

    if (!isPasswordValid) {
        throw new AppError('Invalid email or password.', 401);
    }

    const accessToken = generateAccessToken(existingUser.id , existingUser.role);
    const refreshToken = generateRefreshToken(existingUser.id , existingUser.role);

    // store refresh token in database with expiry date of 8 hours
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8); // Set expiry to 8 hours from now
    await authRepo.storeRefreshToken(existingUser.id, refreshToken, expiresAt); 

    return { 
        accessToken,
        refreshToken,
        user: { 
            id: existingUser.id, 
            name: existingUser.name, 
            email: existingUser.email, 
            role: existingUser.role 
        } 
    };
}




// logout user function
const logoutUser = async (refreshToken: string) => {

    if (!refreshToken) {
        throw new AppError("Refresh token is required", 400);
    }

    const userToken = await authRepo.findUserByRefreshToken(refreshToken);

    if (!userToken) {
        throw new AppError("Invalid refresh token", 400);
    }

    // Delete the refresh token (invalidate session)
    await authRepo.deleteRefreshToken(userToken.id);

    return;
};




// refresh token function
const refreshAccessToken = async (refreshToken : string) => {
    
    if (!refreshToken) {
        throw new AppError("Refresh token is required", 400);
    }

    const userToken = await authRepo.findUserByRefreshToken(refreshToken);

    if (!userToken) {
        throw new AppError("Invalid refresh token", 400);
    }

    // Check if refresh token is expired
    if (!userToken.expiresAt || userToken.expiresAt < new Date()) {
        await authRepo.deleteRefreshToken(userToken.id); // Invalidate the expired token
        throw new AppError("Refresh token has expired", 401);
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(userToken.id , userToken.role);
    const newRefreshToken = generateRefreshToken(userToken.id , userToken.role);

    return {
        newAccessToken,
        newRefreshToken,
    };
}




// change password function
const changePassword = async (userId: number, currentPassword: string, newPassword: string) => {

    if (!currentPassword || !newPassword) {
        throw new AppError("Current password and new password are required", 400);
    }

    if (newPassword.length < 6) {
        throw new AppError("New password must be at least 6 characters long", 400);
    }

    const user = await authRepo.findUserById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const isCurrentPasswordValid = await comparePasswords(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
        throw new AppError("Current password is incorrect", 401);
    }

    const hashedNewPassword = await hashPassword(newPassword);
    await authRepo.updateUserPassword(userId, hashedNewPassword);

    return;
}




    // get user profile function
    const getProfile = async (userId : number) => {
        
        if(!userId) {
            throw new AppError("User ID is required", 400);
        }

        const user = await authRepo.findUserProfileById(userId);

        if(!user) {
            throw new AppError("User not found", 404);
        }

        const { password, refreshToken, expiresAt, ...userData } = user;

        return userData;
    }












export const authService = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getProfile
}