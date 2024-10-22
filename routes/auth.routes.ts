import express from "express";
import {createUser, getUserRole, login} from "../controllers/auth.controller";


const router = express.Router();

router.post("/register", createUser)
router.post("/login", login)
router.get("/userRole", getUserRole)

export { router as AuthRoutes }