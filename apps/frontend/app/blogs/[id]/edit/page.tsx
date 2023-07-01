"use client";

import axios from "axios";
import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useState,
  FC,
  useEffect,
  MouseEventHandler,
} from "react";

import { setEnvironment } from "../../../environment";
import { useRouter } from "next/navigation";
setEnvironment();

type Blog = {
  _id: string;
  title: string;
  body: string;
  image: string;
};

export default function EditBlog({ params }: { params: { id: string } }) {
  const router = useRouter();

  const { id } = params;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [imageBase64, setImageBase64] = useState("");

  useEffect(() => {
    (async () => {
      const { data }: { data: Blog } = await axios.get(`/api/blogs/${id}`);
      setTitle(data.title);
      setBody(data.body);
      setImageBase64(data.image);
    })();
  }, [id]);

  const urlRegex = /^(https:\/\/|blob:http:\/\/)(\w+\.\w+)(\.\w+)?/i;

  const updateBlog: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    if (!imageURL && !imageBase64) {
      return;
    }

    const confirm = window.confirm("Do you want to apply these change?");

    if (!confirm) return;

    if (imageURL) {
      const imageData = await fetch(imageURL);
      const imageBlob = await imageData.arrayBuffer();

      setImageBase64(Buffer.from(imageBlob).toString("base64"));
    }

    const { data, status } = await axios.put("/api/blogs", {
      title,
      body,
      image: imageBase64,
    });

    if (data.error || status > 299) {
      return window.alert(data.error ?? data.message);
    }

    router.push(`/blogs/${id}`);
  };

  const discardChanges: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    const confirm = window.confirm("Do you want to discard these changes?");

    if (!confirm) return;

    router.push(`/blogs/${id}`);
  };

  return (
    <form className="flex flex-col items-start mx-2">
      <h3 className="text-5xl my-6 font-semibold tracking-tight">Edit Blog</h3>
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
              setImageURL(URL.createObjectURL(img));
            }
          }}
        />
        OR
        <input
          type="url"
          placeholder="Enter an image URL"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          className="border px-4 py-2 rounded-md outline-none focus-visible:border-neutral-300"
        />
      </div>
      {(imageBase64 || urlRegex.test(imageURL)) && (
        <>
          <Image
            src={
              urlRegex.test(imageURL)
                ? imageURL
                : `data:image/png;base64,${imageBase64}`
            }
            className="w-full max-w-full my-2 rounded-lg object-fill"
            alt="uploaded image"
            width={0}
            height={0}
            unoptimized
          />
        </>
      )}
      <div className="flex flex-row gap-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 px-8 py-2 my-4 rounded-full text-white text-lg font-medium tracking-tight outline-none"
          onClick={updateBlog}
        >
          Apply Changes
        </button>
        <button
          className="bg-red-100 border-red-300 border-2 hover:bg-red-200 active:bg-blue-700 px-8 py-2 my-4 rounded-full text-black text-lg font-medium tracking-tight outline-none"
          onClick={discardChanges}
        >
          Discard Changes
        </button>
      </div>
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
