import express from "express";
import setupMiddlaweres from "./middlewares";
import setupRoutes from "./routes";

const app = express();
setupMiddlaweres(app);
setupRoutes(app);
export default app;
