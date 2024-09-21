import express from "express";
import {createUser, login} from "../controllers/auth.controller";


const router = express.Router();

router.post("/signin", createUser)
router.post("/login", login)

export { router as AuthRoutes }