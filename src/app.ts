import express, { Application } from "express";
import "dotenv/config";
import {
  createDevelopers,
  createDevelopersInfo,
  deleteDevelopers,
  getDevelopers,
  updateDevelopers,
} from "./logics/logic";
import server from "./server";
import {
  verfifyIdDeveloperInfo,
  verifyIdExistsDevelopersInfo,
  verifyEmailDevelopers,
} from "./middlewares/middlewares";
import {
  createProjects,
  createTechProjects,
  deleteProjects,
  deleteTechProject,
  getProjectsTech,
  updateProjects,
} from "./logics/logictecnologies";
import {
  verfifyIdProjects,
  verfifyIdProjectsDeveloper,
  verifyNameExistsTech,
  verifyTechExistTech,
} from "./middlewares/middlewarestecnologies";

const app: Application = express();
app.use(express.json());
app.post("/developers", verifyEmailDevelopers, createDevelopers);
app.get("/developers/:id", verfifyIdDeveloperInfo, getDevelopers);
app.patch(
  "/developers/:id",
  verfifyIdDeveloperInfo,
  verifyEmailDevelopers,
  updateDevelopers
);
app.delete("/developers/:id", verfifyIdDeveloperInfo, deleteDevelopers);
app.post(
  "/developers/:id/infos",
  verfifyIdDeveloperInfo,
  verifyIdExistsDevelopersInfo,
  createDevelopersInfo
);

app.post("/projects", verfifyIdProjectsDeveloper, createProjects);
app.get("/projects/:id", verfifyIdProjects, getProjectsTech);
app.patch(
  "/projects/:id",
  verfifyIdProjects,
  verfifyIdProjectsDeveloper,
  updateProjects
);
app.delete("/projects/:id", verfifyIdProjects, deleteProjects);
app.post(
  "/projects/:id/technologies",
  verfifyIdProjects,
  verifyTechExistTech,
  verifyNameExistsTech,
  createTechProjects
);
//verifyTechExistTech
app.delete(
  "/projects/:id/technologies/:name",
  verfifyIdProjects,
  verifyTechExistTech,
  deleteTechProject
);
export default app;
