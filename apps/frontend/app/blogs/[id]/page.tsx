import axios from "axios";
import Image from "next/image";
import EditButton from "./edit-button";
import DeleteButton from "./delete-button";

type Blog = {
  _id: string;
  title: string;
  body: string;
  image: string;
};

export default async function BlogPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const { data: blog }: { data: Blog } = await axios.get(`/api/blogs/${id}`);

  return (
    <div className="mx-2">
      <Image
        alt={blog.title}
        className="object-cover w-full rounded-md"
        src={`data:image/png;base64,${blog.image}`}
        width={0}
        height={0}
      />
      <h1 className="text-3xl md:text-5xl font-semibold tracking-tighter leading-tight my-4 pb-1 border-b-neutral-300 border-b transition-all">
        {blog.title}
      </h1>
      <div className="flex flex-row gap-4 justify-end my-4">
        <DeleteButton id={id} />
        <EditButton id={id} />
      </div>
      <article className="whitespace-pre-wrap font-medium text-neutral-700">
        {blog.body}
      </article>
    </div>
  );
}
