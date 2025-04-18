import express from "express";
import {
  createUser,
  getUserById,
  getUserImgById,
  getUsers,
  googleLogin,
  updateUser,
} from "../controllers/user.controller";
import requireUserMiddleware, {
  checkUserMiddleware,
} from "../middlewares/auth.middleware";
import {
  createBulkJob,
  createJob,
  getBulkJobs,
  getJobs,
} from "../controllers/job.controller";

const router = express.Router();

// User Routes
router.get("/user/example", getUsers);
router.get("/user/get-profile", requireUserMiddleware, getUserById);
router.patch("/user/update-profile", requireUserMiddleware, updateUser);
router.post("/user/google-login", requireUserMiddleware, googleLogin);
router.post("/user/create-user", requireUserMiddleware, createUser);
router.get("/user/get-partial-profile", checkUserMiddleware, getUserImgById);

// Job Routes
router.get("/job/get-jobs", getJobs);
router.post("/job/create-job", createJob);
router.post("/job/create-bulk-jobs", createBulkJob);
router.get("/job/get-bulk-jobs", getBulkJobs);
export default router;
