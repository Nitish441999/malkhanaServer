import { Router } from "express";
import {
  changeCurrentPassword,
  createUser,
  deleteUser,
  getAlluser,
  getCurrentUser,
  updateAccountDetails,
  userLogin,
  userLogout,
} from "../controllers/user.Controller.js";
import verifyJWT from "../middlewares/auth.Middleware.js";

const router = Router();
router.route("/ragister").post(createUser);

router.route("/login").post(userLogin);

router.route("/logout").post(verifyJWT, userLogout);

// router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-user").patch(verifyJWT, updateAccountDetails);
router.route("/allusers").get(verifyJWT, getAlluser);
router.route("/:id").delete(verifyJWT, deleteUser);

export default router;
