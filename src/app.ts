import express, { Application } from "express";
import "dotenv/config";
import { createDevelopers } from "./logic";
import server from "./server";

const app: Application = express();
app.use(express.json());
app.post("/developers", createDevelopers);
app.get("/developers/:id");
app.patch("/developers/:id");
app.delete("/developers/:id");
app.post("/developers/:id/infos");
export default app;
