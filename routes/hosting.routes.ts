import express from "express";
import {createHosting, deleteHosting, getAllHosting, updateHosting} from "../controllers";


const router = express.Router();

router.post("/", createHosting);
router.get("/", getAllHosting)
router.patch('/:id', updateHosting)
router.delete("/:id", deleteHosting);


export { router as HostingRoutes }