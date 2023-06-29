import { Schema, model } from "mongoose";

export type Blog = {
  title: string;
  image: Uint8Array;
  body: string;
};

const blogSchema = new Schema<Blog>(
  {
    title: {
      type: String,
      required: true,
      validate: (v: string) => v.length > 5,
    },
    image: {
      type: Buffer,
      required: true,
    },
    body: {
      type: String,
      required: true,
      validate: (v: string) => v.length > 30,
    },
  },
  {
    versionKey: false,
  }
);

export const Blog = model("Blog", blogSchema);
