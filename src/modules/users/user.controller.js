import { Router } from "express";
import { deleteUser } from "./user.service.js";
import asyncHandler from "./../../utils/handler/asynchandler.js";

const router = Router();

router.delete("/", asyncHandler(deleteUser));

export default router;
