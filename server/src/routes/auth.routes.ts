import  express  from "express";
import { registerController } from "../controllers/auth.controller";
import { loginController } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { meController } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/me", requireAuth, meController);


export default router;

