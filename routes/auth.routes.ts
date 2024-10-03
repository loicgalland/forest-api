import express from "express";
import {createUser, login} from "../controllers/auth.controller";


const router = express.Router();

router.post("/register", createUser)
router.post("/login", login)

export { router as AuthRoutes }