import { Request, Response, NextFunction } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import {
  IProjects,
  IProjectsAndTecnologies,
  Itechnologies,
} from "../interfaces/interfacetecnologies";
import { Ierror } from "../interfaces/interface";
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
//verificar amanhã por que esse midd não está passando na rota de delete no teste
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

  let queryTemplate: string = `SELECT * FROM "technologies" WHERE name = $1;`;

  let queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [name],
  };
  const queryResult = await client.query(queryConfig);

  const foundMovie = queryResult.rows[0];
  if (foundMovie) {
    const message: Ierror = {
      message: `This technology is already associated with the project`,
    };
    return response.status(409).json(message);
  }

  response.locals.tecnology = {
    id: queryResult.rows[0].id,
  };

  return next();
};
