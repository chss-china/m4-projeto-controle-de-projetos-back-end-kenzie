import { NextFunction, Request, Response, response } from "express";
import format, { string } from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import {
  IProjects,
  IProjectsAndTecnologies,
  IProjectsRequest,
  Itechnologies,
} from "../interfaces/interfacetecnologies";
import { client } from "../database";
export const createProjects = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectData: IProjectsRequest = req.body;

  const queryString: string = format(
    `
        INSERT INTO
            projects (%I)
        VALUES
            (%L)
        RETURNING *;
        `,
    Object.keys(projectData),
    Object.values(projectData)
  );

  const queryResult: QueryResult<IProjects> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

export const getProjectsTech = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { params } = req;
  const queryString: string = format(
    `
  SELECT
    pr.id AS "projectId",
    pr."name" AS "projectName",
    pr."description" AS "projectDescription",
    pr."estimatedTime" AS "projectEstimatedTime",
    pr."repository" AS "projectRepository",
    pr."startDate" AS "projectStartDate",
    pr."endDate" AS "projectEndDate",
    pr."developerId" AS "projectDeveloperId",
    pt."technologyId",
    te."name" AS "technologyName"
 FROM
    projects pr
 LEFT JOIN
    projects_technologies pt ON pr."id" = pt."projectId"
 LEFT JOIN
    technologies te ON pt."technologyId" = te."id"
 WHERE pr.id = (%L) 
 `,
    params.id
  );

  const queryResult: QueryResult<IProjectsAndTecnologies> = await client.query(
    queryString
  );
  return res.status(200).json(queryResult.rows);
};
export const updateProjects = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);
  const developerData: Partial<IProjectsRequest> = req.body;

  const queryString: string = format(
    `
    UPDATE 
      projects
    SET(%I) = ROW(%L)
    WHERE id = $1
    RETURNING *;
    `,
    Object.keys(developerData),
    Object.values(developerData)
  );
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<IProjects> = await client.query(queryConfig);
  return res.status(200).json(queryResult.rows[0]);
};
export const deleteProjects = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { params } = req;
  const queryString: string = format(
    `DELETE FROM projects
      WHERE id = (%L);`,
    params.id
  );
  const queryResult: QueryResult<IProjects> = await client.query(queryString);
  const developer: IProjects = queryResult.rows[0];
  return res.status(204).send();
};

export const createTechProjects = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId = parseInt(req.params.id);
  const { name } = req.body;

  const technologyQuery = format(
    "SELECT * FROM technologies WHERE name = %L",
    name
  );
  const technologyResult = await client.query(technologyQuery);
  const technology = technologyResult.rows[0];

  const projectQuery = format(
    "SELECT * FROM projects WHERE id = %L",
    projectId
  );
  const projectResult = await client.query(projectQuery);
  const project = projectResult.rows[0];
  let queryString: string = format(
    `INSERT INTO projects_technologies ("technologyId", "projectId", "addedIn")
  VALUES (%L)
  RETURNING "technologyId", "projectId"`,
    [technology.id, project.id, new Date()]
  );
  const queryResult: QueryResult<IProjectsAndTecnologies> = await client.query(
    queryString
  );

  const projectsAndTechnologiesQuery = format(
    `
    SELECT
          pr.id AS "projectId",
          pr."name" AS "projectName",
          pr."description" AS "projectDescription",
          pr."estimatedTime" AS "projectEstimatedTime",
          pr."repository" AS "projectRepository",
          pr."startDate" AS "projectStartDate",
          pr."endDate" AS "projectEndDate",
          pt."technologyId",
          te."name" AS "technologyName"
        FROM projects pr
        JOIN projects_technologies pt ON pt."projectId" = pr.id
        JOIN technologies te ON te.id = pt."technologyId"
        WHERE pr.id = (%L) AND pt."technologyId" = (%L);`,
    projectId,
    technology.id
  );
  const projectsAndTechnologiesResult: QueryResult<IProjectsAndTecnologies> =
    await client.query(projectsAndTechnologiesQuery);

  return res.status(201).json(projectsAndTechnologiesResult.rows[0]);
};

export const removeTechFromProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { projectId } = req.params;
  const techName = req.params.name;

  const techQuery = format(
    `SELECT id FROM technologies WHERE name = (%L)`,
    techName
  );

  const techResult = await client.query(techQuery);

  const techId = techResult.rows[0].id;

  const removeQuery = format(
    'DELETE FROM projects_technologies WHERE "projectId" = (%L) AND "technologyId" = (%L)',
    [projectId],
    [techId]
  );
  await client.query(removeQuery);

  return res.status(204).send();
};
