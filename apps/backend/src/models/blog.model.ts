import { Schema, model } from 'mongoose';

type TBlog = {
  title: string;
  image: Uint8Array;
  body: string;
};

const blogSchema = new Schema<TBlog>({
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
});

blogSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

export const Blog = model('Blog', blogSchema);
