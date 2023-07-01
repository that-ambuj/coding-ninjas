"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";

import { setEnvironment } from "../../environment";
setEnvironment();

export default function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const deleteBlog: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    const confirmDelete = window.confirm("Do you want to delete this Blog?");

    if (!confirmDelete) {
      return;
    }

    const { data, status } = await axios.delete(`/api/blogs/${id}`);

    if (data.error) {
      window.alert(data.error);
      return;
    }

    if (status < 300) {
      router.back();
    }
  };

  return (
    <>
      <button
        onClick={deleteBlog}
        className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-4 py-0.5 rounded-full font-medium"
      >
        Delete
      </button>
    </>
  );
}
