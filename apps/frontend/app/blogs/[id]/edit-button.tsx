"use client";
import { useRouter } from "next/navigation";

export default function EditButton({ id }: { id: string }) {
  const router = useRouter();

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          router.push(`/blogs/${id}/edit`);
        }}
        className="bg-blue-100 hover:bg-blue-200 active:bg-blue-300 border-2 border-blue-300 px-4 py-0.5 rounded-full font-medium"
      >
        Edit
      </button>
    </>
  );
}
