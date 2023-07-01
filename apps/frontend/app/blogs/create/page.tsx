"use client";

import axios from "axios";
import Image from "next/image";
import { Dispatch, SetStateAction, useState, FC, FormEvent } from "react";

import { setEnvironment } from "../../environment";
setEnvironment();

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");

  const urlRegex = /^(https:\/\/|blob:http:\/\/)(\w+\.\w+)(\.\w+)?/i;

  async function createNewBlog(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!image) {
      return;
    }

    let imageBase64;

    if (image) {
      const imageData = await fetch(image);
      const imageBlob = await imageData.arrayBuffer();

      imageBase64 = Buffer.from(imageBlob).toString("base64");
    }

    const { data, status } = await axios.post("/api/blogs", {
      title,
      body,
      image: imageBase64,
    });

    if (data.error || status > 299) {
      window.alert(data.error ?? data.message);
    }

    setTitle("");
    setImage("");
    setBody("");
  }

  return (
    <form onSubmit={createNewBlog} className="flex flex-col items-start mx-2">
      <h3 className="text-5xl my-6 font-semibold tracking-tight">
        Create a New Blog
      </h3>
      <FormInput
        label="Title"
        placeholder="An Interesting Blog Title"
        input={title}
        setInput={setTitle}
      />
      <FormTextArea
        label="Description"
        placeholder="Write something about this blog in about >250 words."
        input={body}
        setInput={setBody}
      />
      <div className="flex flex-row my-2 gap-4 items-center">
        <FormLabel>Cover Image</FormLabel>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            if (e.target.files && e.target.files[0]) {
              const img = e.target.files[0];
              setImage(URL.createObjectURL(img));
            }
          }}
        />
        OR
        <input
          type="url"
          placeholder="Enter an image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border px-4 py-2 rounded-md outline-none focus-visible:border-neutral-300"
        />
      </div>
      {image && urlRegex.test(image) && (
        <>
          <Image
            src={image}
            className="w-full max-w-full my-2 rounded-lg object-fill"
            alt="uploaded image"
            width={0}
            height={0}
            unoptimized
          />
        </>
      )}
      <button
        className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 px-8 py-2 my-4 rounded-full text-white text-lg font-medium tracking-tight outline-none"
        type="submit"
      >
        Create Blog
      </button>
    </form>
  );
}

type FormInputProps<T> = {
  label: string;
  placeholder?: string;
  input: T;
  setInput: Dispatch<SetStateAction<T>>;
};

const FormInput: FC<FormInputProps<string>> = ({
  label,
  placeholder,
  input: input,
  setInput: setInput,
}) => {
  return (
    <div className="flex flex-col w-full gap-0.5 my-2">
      <FormLabel>{label}</FormLabel>
      <input
        className="w-full py-2 px-4 border rounded-lg focus-visible:border-neutral-300 outline-none"
        type="text"
        placeholder={placeholder ?? label}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
};

const FormTextArea: FC<FormInputProps<string>> = ({
  label,
  placeholder,
  input: input,
  setInput: setInput,
}) => {
  return (
    <div className="flex flex-col w-full gap-0.5 my-2">
      <FormLabel>{label}</FormLabel>
      <textarea
        className="w-full py-2 px-4 border rounded-lg focus-visible:border-neutral-300 outline-none whitespace-pre-wrap"
        placeholder={placeholder ?? label}
        value={input}
        rows={15}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
};

const FormLabel: FC<{ children: string }> = ({ children }) => {
  return <div className="font-medium ml-2">{children}</div>;
};
