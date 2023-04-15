import { Request, Response, NextFunction } from "express";
import { QueryConfig, QueryResult } from "pg";
import { Ierror, TDevelopers, TDevelopersinfo } from "../interfaces/interface";
import { client } from "../database";
const verfifyIdDeveloperInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = parseInt(req.params.id);
  const queryString: string = `
  SELECT  * 
  FROM
    developers
  WHERE 
   id = $1
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<TDevelopers> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      message: "Developer not found",
    });
  }
  res.locals.developer = queryResult.rows[0];
  return next();
};
export const verifyEmailDevelopers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { email } = req.body;
  const queryTemplate: string = `SELECT * FROM "developers" WHERE email = $1;`;
  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [email],
  };
  const queryResult: QueryResult<TDevelopers> = await client.query(queryConfig);
  const foundDeveloper: TDevelopers = queryResult.rows[0];
  if (foundDeveloper) {
    const message: Ierror = {
      message: `Email already exists.`,
    };
    return res.status(409).json(message);
  }
  return next();
};
const verifyIdExistsDevelopersInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = parseInt(req.params.id);
  const queryTemplate: string = `SELECT * FROM "developer_infos" WHERE id = $1;`;
  const queryConfig: QueryConfig = {
    text: queryTemplate,
    values: [id],
  };
  const queryResult: QueryResult<TDevelopersinfo> = await client.query(
    queryConfig
  );
  const foundDeveloper: TDevelopersinfo = queryResult.rows[0];

  if (foundDeveloper) {
    const message: Ierror = {
      message: "Developer infos already exists.",
    };
    return res.status(409).json(message);
  }
  return next();
};

export { verfifyIdDeveloperInfo, verifyIdExistsDevelopersInfo };
