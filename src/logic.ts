import { Request, Response } from "express";
import { TDevelopers, TDevelopersRequest } from "./interface";
import format from "pg-format";
import { QueryResult } from "pg";
import { client } from "./database";
const createDevelopers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const dataDevelopers: TDevelopersRequest = req.body;
  const queryString: string = format(
    `
    INSERT INTO
      developers(%I)
    VALUES
      (%L)
    RETURNING *;
    `,
    Object.keys(dataDevelopers),
    Object.values(dataDevelopers)
  );
  console.log(queryString);
  const queryResult: QueryResult<TDevelopers> = await client.query(queryString);
  console.log(queryResult);
  return res.status(201).json("deu certo");
};
export { createDevelopers };
