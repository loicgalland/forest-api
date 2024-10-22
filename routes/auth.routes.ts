import express from "express";
import {createUser, getUserRole, login} from "../controllers/auth.controller";


const router = express.Router();

router.get("/user-role", getUserRole)
router.post("/register", createUser)
router.post("/login", login)


export { router as AuthRoutes }