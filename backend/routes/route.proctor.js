import express from "express";

import {

saveViolation

} from "../controllers/controller.proctor.js";

import auth from "../middleware/authmiddleware.js";

const router=express.Router();

router.post(

"/violation",

auth,

saveViolation

);

export default router;