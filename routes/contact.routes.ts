import express from "express";
import {} from "../controllers";
import { sendContactMail } from "../controllers";

const router = express.Router();
router.post("/", sendContactMail);

export { router as ContactRoutes };
