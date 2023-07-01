import axios from "axios";
import Image from "next/image";
import Link from "next/link";

type Blog = {
  _id: string;
  title: string;
  body: string;
  image: string;
};

type BlogList = {
  blogs: Blog[];
  totalPages: number;
  page: number;
};

async function getBlogs(page = 1, limit = 10): Promise<BlogList> {
  const { data } = await axios.get(`/api/blogs?page=${page}&limit=${limit}`);
  return data;
}

export default async function BlogList({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string };
}) {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const limit = searchParams.limit ? Number(searchParams.limit) : 10;

  const { blogs, totalPages, page: currentPage } = await getBlogs(page, limit);

  return (
    <>
      <h1 className="block h-20 my-5 text-center text-7xl w-full font-semibold tracking-tighter bg-gradient-to-r text-transparent bg-clip-text from-red-500 to-orange-500">
        Blogs
      </h1>
      <div>
        {blogs.map(({ _id, title, body, image }) => (
          <Link href={`/blogs/${_id}`} key={_id}>
            <div className="flex justify-between border border-neutral-200 rounded-xl mx-2 my-4 xl:mx-auto p-4">
              <Image
                alt={title}
                className="object-cover w-64 h-48 rounded-md"
                src={`data:image/png;base64,${image}`}
                width={0}
                height={0}
              />
              <div className="w-3/4 flex flex-col gap-2">
                <h2 className="text-4xl md:text-4xl font-medium tracking-tight overflow-clip text-clip">
                  {title.slice(0, 70)}
                </h2>
                <div className="text-neutral-600 overflow-clip text-ellipsis text-sm md:text-base md:leading-tight font-medium">
                  {body.length > 500 ? body.slice(0, 500) + "..." : body}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex flex-row justify-between font-medium">
        {currentPage !== 1 && (
          <div className="border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 active:bg-neutral-200 py-1 px-4 rounded-md">
            <Link
              href={{
                pathname: "/",
                query: { page: currentPage - 1 },
              }}
            >
              &lt; Previous ({currentPage - 1})
            </Link>
          </div>
        )}
        {currentPage > 1 && <div>Current page: {currentPage}</div>}
        {currentPage !== totalPages && (
          <div className="border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 active:bg-neutral-200 py-1 px-4 rounded-md">
            <Link href={{ pathname: "/", query: { page: currentPage + 1 } }}>
              Next ({currentPage + 1}) &gt;
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
