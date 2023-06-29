import { Router } from "express";
import { blogRouter } from "./blog.router";

const router = Router();

router.use("/blogs", blogRouter);

export default router;
