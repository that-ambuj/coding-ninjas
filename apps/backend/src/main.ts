import express, { ErrorRequestHandler } from "express";
import { config } from "dotenv";
import { connect } from "mongoose";
import nocache from "nocache";

import router from "./routers";

config();

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

import "express-async-errors";

connect(process.env.MONGO_URI)
  .then(() => {
    console.info("Successfully connected to MongoDB");
  })
  .catch((err) => {
    console.error(`Error occured while connecting to MongoDB: ${err}`);
  });

export const app = express();
app.use(express.json());

app.set("etag", false);
app.use(nocache());

app.use("/api", router);

function errorHandler(): ErrorRequestHandler {
  return (err, _, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    let status = err.statusCode ?? err.status ?? 500;
    let error = err.message ?? "Internal Server Error";

    if (err.name === "ValidationError") status = 400;

    if (err.name === "CastError") {
      status = 400;
      error = `Malformatted '${err.path}': '${err.value}'(${err.valueType}) is not of type ${err.kind}`;
    }

    res.status(status).json({ status, error });
  };
}

app.use(errorHandler());

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
