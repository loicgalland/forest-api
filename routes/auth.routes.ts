import express from "express";
import {createUser, getUserRole, login, logout} from "../controllers/auth.controller";


const router = express.Router();

router.get("/user-role", getUserRole)
router.post("/register", createUser)
router.post("/login", login)
router.post('/logout',logout);


export { router as AuthRoutes }