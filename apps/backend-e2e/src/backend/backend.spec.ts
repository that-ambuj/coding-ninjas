import axios from "axios";

describe("GET /api/blogs", () => {
  it("should return list of blogs", async () => {
    const { status } = await axios.get("/api/blogs");

    expect(status).toBe(200);
  });
});

const buffer = Buffer.from("jaklsdjfklasjdfk");
let tempId: string;

const testBlog = {
  title: "test blog 1",
  image: buffer.toString("base64"),
  body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
};

describe("Create a Blog", () => {
  it("should create a new blog", async () => {
    const { status, data } = await axios.post("/api/blogs", testBlog);

    tempId = data.data._id;

    expect(status).toBe(201);
    expect(data).toMatchObject({
      data: {
        title: testBlog.title,
        image: testBlog.image,
        body: testBlog.body,
      },
    });
  });

  it("should NOT create a blog with invalid base64 string", async () => {
    const { status, data } = await axios.post("/api/blogs", {
      ...testBlog,
      image: "jaksjdlkfajsd",
    });

    expect(status).toBe(400);
    expect(data.error).toBe("`image` is not a valid base64 string");
  });

  it("should NOT create a blog with title too short", async () => {
    const { status } = await axios.post("/api/blogs", {
      ...testBlog,
      title: "xyz",
    });

    expect(status).toBe(400);
  });

  it("should NOT create a blog with body too short", async () => {
    const { status } = await axios.post("/api/blogs", {
      ...testBlog,
      body: "less words",
    });

    expect(status).toBe(400);
  });
});

describe("Read Blogs", () => {
  it("Should give a list of blogs with status 200", async () => {
    const { status, data } = await axios.get("/api/blogs");

    expect(status).toBe(200);
    expect(data.data.length).toBeGreaterThan(0);
  });

  it("Should give a blog by ID with status 200", async () => {
    const { status, data } = await axios.get(`/api/blogs/${tempId}`);

    expect(status).toBe(200);
    expect(data.data._id).toBe(tempId);
  });

  it("Should return validation error for invalid Blog ID", async () => {
    const { status, data } = await axios.get(`/api/blogs/aasdfi`);

    expect(status).toBe(400);
    expect(data.error).toMatch("Malformatted '_id'");
  });
});

describe("Update a Blog", () => {
  it("should NOT update a blog with invalid base64 string", async () => {
    const { status, data } = await axios.put(`/api/blogs/${tempId}`, {
      ...testBlog,
      image: "jaksjdlkfajsd",
    });

    expect(status).toBe(400);
    expect(data.error).toBe("`image` is not a valid base64 string");
  });

  it("should NOT update a blog with title too short", async () => {
    const { status } = await axios.put(`/api/blogs/${tempId}`, {
      ...testBlog,
      title: "xyz",
    });

    expect(status).toBe(400);
  });

  it("should NOT update a blog with body too short", async () => {
    const { status } = await axios.put(`/api/blogs/${tempId}`, {
      ...testBlog,
      body: "less words",
    });

    expect(status).toBe(400);
  });
});

describe("Delete a Blog", () => {
  it("Should delete an existing Blog", async () => {
    const { status, data } = await axios.delete(`/api/blogs/${tempId}`);

    expect(status).toBe(200);
    expect(data.message).toBe(
      `Blog with id: ${tempId} has been successfully deleted.`
    );
  });

  it("Should error on deleting a non-existing Blog", async () => {
    const { status, data } = await axios.delete(`/api/blogs/${tempId}`);

    expect(status).toBe(400);
    expect(data.error).toBe(`Blog with id: ${tempId} does not exist.`);
  });

  it("Should error on getting a non-existing Blog with status 404", async () => {
    const { status } = await axios.get(`/api/blogs/${tempId}`);

    expect(status).toBe(404);
  });
});
