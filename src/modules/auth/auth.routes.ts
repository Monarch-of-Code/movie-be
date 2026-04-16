import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changePassword,
    getProfile,
} from "./controllers/auth.controller";
import { verifyJWT } from "../../middlewares/auth.middleware";

import { Router } from "express";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", verifyJWT, refreshAccessToken);
router.post("/change-password", verifyJWT, changePassword);
router.get("/profile", verifyJWT, getProfile);

export default router;