import { NextFunction, Request, Response, response } from "express";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import {
  IProjects,
  IProjectsAndTecnologies,
  IProjectsRequest,
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
 WHERE id = (%L);
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
    `DELETE FROM developers
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
  const { technology } = response.locals;
  const id = parseInt(req.params.id);
  console.log(id);
  let queryString: string = `
    INSERT INTO
      projects_technologies ("technologyId","projectId","addedIn")
    VALUES
      ($1,$2,$3);
    `;
  let queryConfig: QueryConfig = {
    text: queryString,
    values: [technology, id, new Date()],
  };
  queryString = `
  SELECT
    pr.id AS "projectId",
    pr."name" AS "projectName",
    pr."description" AS "projectDescription",
    pr."estimatedTime" AS "projectEstimatedTime",
    pr."repository" AS "projectRepository",
    pr."startDate" AS "projectStartDate",
    pr."endDate" AS "projectEndDate",
    pt."technologyId"
    te."name" AS "technologyName"
  FROM
    projects pr
 LEFT JOIN
    projects_technologies pt ON pr."id" = pt."projectId"
 LEFT JOIN
    technologies te ON pt."technologyId" = te."id"
 WHERE pr."id" = $1; `;

  queryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<IProjectsAndTecnologies> = await client.query(
    queryConfig
  );

  return res.status(201).json(queryResult.rows[0]);
};

export const deleteTechProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId = parseInt(req.params.id);
  const nameTechnology = req.params.name;

  let queryTechnologyId: string = `
   SELECT * FROM technologies
   WHERE name = $1;
  `;

  let queryConfig: QueryConfig = {
    text: queryTechnologyId,
    values: [nameTechnology],
  };
  queryTechnologyId = `
  DELETE FROM 
    projects_technologies
  WHERE "technologyId" = $1
  AND "projectId" = $2;
  `;
  queryConfig = {
    text: queryTechnologyId,
    values: [projectId],
  };
  const queryResult: QueryResult<IProjectsAndTecnologies> = await client.query(
    queryConfig
  );

  const developer: IProjectsAndTecnologies = queryResult.rows[0];
  return res.status(204).send();
};
