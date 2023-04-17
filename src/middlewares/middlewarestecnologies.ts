import { Request, Response, NextFunction } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import {
  IProjects,
  IProjectsAndTecnologies,
  Itechnologies,
} from "../interfaces/interfacetecnologies";
import { Ierror } from "../interfaces/interface";
import format from "pg-format";
export const verfifyIdProjectsDeveloper = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { developerId } = req.body;
  const queryString: string = `
    SELECT 
      * 
    FROM
      developers
    WHERE 
     id = $1
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [developerId],
  };
  const queryResult: QueryResult<IProjects> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      message: "Developer not found",
    });
  }
  res.locals.developer = queryResult.rows[0];
  return next();
};

export const verfifyIdProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = parseInt(req.params.id);

  const queryString: string = `
  SELECT 
    * 
  FROM
   projects
  WHERE 
   id = $1
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<IProjects> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      message: "Project not found.",
    });
  }

  res.locals.developer = queryResult.rows[0];

  return next();
};
export const verifyNameExistsTech = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { name } = request.body;
  const { technology } = response.locals;

  const id = parseInt(request.params.id);

  let queryTemplate: string = `SELECT * FROM "projects_technologies" WHERE "technologyId" = $1
  AND "projectId" = $2;`;

  let queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [technology.id, id],
  };
  const queryResult: QueryResult<IProjectsAndTecnologies> = await client.query(
    queryConfig
  );

  if (queryResult.rowCount !== 0) {
    const message: Ierror = {
      message: `This technology is already associated with the project`,
    };
    return response.status(409).json(message);
  }

  return next();
};
export const verifyTechExistTech = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const name = req.params.name;

  let queryTemplate: string = `SELECT * FROM "technologies" WHERE name = $1;`;

  let queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [name],
  };

  const queryResult = await client.query(queryConfig);
  if (queryResult.rowCount == 0) {
    return res.status(400).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }

  res.locals.technology = queryResult.rows[0];
  return next();
};
export const verifyTechExistBody = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const name = req.body.name;

  let queryTemplate: string = `SELECT * FROM "technologies" WHERE name = $1;`;

  let queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [name],
  };

  const queryResult = await client.query(queryConfig);
  if (queryResult.rowCount == 0) {
    return res.status(400).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }

  res.locals.technology = queryResult.rows[0];

  return next();
};
export async function checkTechnologyInProject(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const projectId = parseInt(req.params.id);
  const name = req.params.name;

  const query = format(
    `SELECT * FROM projects_technologies pt INNER JOIN technologies t ON pt."technologyId" 
    = t.id WHERE pt."projectId" = %L AND t.name = %L;`,
    projectId,
    name
  );

  const result = await client.query(query);

  if (!result.rows[0]) {
    return res
      .status(400)
      .json({ message: "Technology not related to the project." });
  }
  next();
}
