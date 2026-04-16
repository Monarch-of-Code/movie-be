import { prisma } from '../../../database/prisma';


// To find many users in database
const findManyUsers = async ( where: any, skip: any, take: any ) => {
    return await prisma.users.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select : {
            id : true,
            name : true,
            email : true,
            role : true,
            createdAt : true,
            watchlist : true,
            reviews: true
        }
    });
};


// To find the user by email
const findUserByEmail = async ( email : string ) => {
    return await prisma.users.findUnique({
        where : { email }
    })
};


// To create the user in database
const createUser = async ( data: any ) => {
    return await prisma.users.create({
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
            role: 'USER'
        }
    })
};


// To update the user by id's
const updateUserById = async ( id: number, data: any ) => {
    return await prisma.users.update({
        where : { id },
        data : {
            name: data.name,
            email: data.email,
            password: data.password,
        }
    })
};


// To count the total users
const countUsers = async ( where : any ) => {
    return await prisma.users.count({ where });
};


// To find the user by id's
const findUserById = async ( id : number ) => {
    return await prisma.users.findUnique({
        where : { id }
    })
};


// To delete the user by id's
const deleteUserById = async ( id: number ) => {
    return await prisma.users.delete({
        where : { id }
    })
};


// To store the refresh token in database
const storeRefreshToken = async ( userId : number, refreshToken : string, expiresAt : Date ) => {
    return await prisma.users.update({ 
        where : { id : userId },
        data : { refreshToken, expiresAt }
    })
};


// To find the user by refresh token
const findUserByRefreshToken = async ( refreshToken : string ) => {
    return await prisma.users.findFirst({
        where : { refreshToken }
    })
}


// To delete the refresh token from database
const deleteRefreshToken = async ( userId : number ) => {
    return await prisma.users.update({
        where : { id : userId },
        data : { refreshToken : null, expiresAt : null }
    })
}


// To update the user password by id's
const updateUserPassword = async ( userId : number, newPassword : string ) => {
    return await prisma.users.update({
        where : { id : userId },
        data : { password : newPassword }
    })
}


const findUserProfileById = async (id: number) => {
    return await prisma.users.findUnique({
        where: { id },
        include: {
            watchlist: true,
            reviews: true,
        }
    });
}


export const authRepo = {
    findManyUsers,
    findUserByEmail,
    createUser,
    updateUserById,
    findUserById,
    countUsers,
    deleteUserById,
    storeRefreshToken,
    findUserByRefreshToken,
    deleteRefreshToken,
    updateUserPassword,
    findUserProfileById
} 