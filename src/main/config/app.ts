import express from "express";
import setupMiddlaweres from "./middlewares";

const app = express();
setupMiddlaweres(app);

export default app;
