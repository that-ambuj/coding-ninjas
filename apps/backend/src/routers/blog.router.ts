import { Router } from "express";
import validator from "validator";

import { Blog } from "../models";
import { BadRequest, NotFound } from "../errors";

export const blogRouter = Router();

blogRouter.get("/", async (req, res, next) => {
  try {
    const { pageQuery, limitQuery } = req.query;

    const page = pageQuery ? Number(pageQuery) : 1;
    const limit = limitQuery ? Number(limitQuery) : 10;

    const skip = (page - 1) * limit;

    const blogs = await Blog.find().skip(skip).limit(limit).lean();

    const totalCount = await Blog.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);

    return res.send({ blogs, totalPages, page });
  } catch (err) {
    next(err);
  }
});

blogRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) throw new NotFound("Blog with this `id` does not exist.");

    return res.send(blog.toObject());
  } catch (err) {
    next(err);
  }
});

blogRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { deletedCount } = await Blog.deleteOne({ _id: id });

    if (deletedCount < 1)
      throw new BadRequest(`Blog with id: ${id} does not exist.`);

    return res
      .status(200)
      .json({ message: `Blog with id: ${id} has been successfully deleted.` });
  } catch (err) {
    next(err);
  }
});

blogRouter.post("/", async (req, res, next) => {
  try {
    const { title, image, body } = req.body;

    if (!image) {
      throw new BadRequest("missing field `image`");
    }

    // we take image as a base64 string and convert it to a buffer
    // for storing in MongoDB. realisticially, we would use an s3 bucket
    // to upload image files to and store it's key as `imageKey` in DB instead
    if (!validator.isBase64(image)) {
      throw new BadRequest("`image` is not a valid base64 string");
    }

    const buffer = Buffer.from(image, "base64");

    const newBlogPost = new Blog({
      title,
      body,
      image: buffer,
    });
    await newBlogPost.save();

    return res.status(201).json(newBlogPost.toObject());
  } catch (err) {
    next(err);
  }
});

blogRouter.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      title,
      image,
      body,
    }: { title?: string; image?: string; body?: string } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) throw new NotFound("Blog with this `id` does not exist.");

    // This prevents settings keys as undefined in the database when they are not provided
    blog.title = title ?? blog.title;
    blog.body = body ?? blog.body;

    if (image) {
      if (!validator.isBase64(image))
        throw new BadRequest("`image` is not a valid base64 string");

      const buffer = Buffer.from(image, "base64");
      blog.image = buffer;
    }

    await blog.save();

    return res.status(202).json(blog.toObject());
  } catch (err) {
    next(err);
  }
});
