import { Request, Response } from "express";
import {
  DeveloperAndDeveloperInfo,
  TDevelopers,
  TDevelopersRequest,
  TDevelopersinfo,
  TDevelopersinfoRequest,
} from "../interfaces/interface";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
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

  const queryResult: QueryResult<TDevelopers> = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};
const createDevelopersInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = parseInt(req.params.id);
  const infoDevelopers = {
    developerSince: req.body.developerSince,
    preferredOS: req.body.preferredOS,
    developerId: id,
  };
  if (
    infoDevelopers.preferredOS != "Windows" &&
    infoDevelopers.preferredOS != "Linux" &&
    infoDevelopers.preferredOS != "MacOS"
  ) {
    return res.status(400).json({
      message: "Invalid OS option.",
      options: ["Windows", "Linux", "MacOS"],
    });
  }

  let queryString: string = format(
    `
    INSERT INTO
      developer_infos (%I)
    VALUES
      (%L)
    RETURNING *;
    `,
    Object.keys(infoDevelopers),
    Object.values(infoDevelopers)
  );

  const queryResult: QueryResult<TDevelopersinfo> = await client.query(
    queryString
  );

  return res.status(201).json(queryResult.rows[0]);
};
export const getDevelopers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const queryString: string = `
  SELECT
    de.id AS "developerId",
    de."name" AS "developerName",
    de."email" AS "developerEmail",
    di."developerSince" AS "developerInfoDeveloperSince",
    di."preferredOS" AS "developerInfoPreferredOS"
  FROM
    developers de
 LEFT JOIN
    developer_infos di ON de."id" = di."developerId";
  `;
  const queryResult: QueryResult<DeveloperAndDeveloperInfo> =
    await client.query(queryString);

  return res.status(200).json(queryResult.rows[0]);
};
export const updateDevelopers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);
  const developerData: Partial<TDevelopersRequest> = req.body;

  const queryString: string = format(
    `
  UPDATE 
    developers
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
  const queryResult: QueryResult<TDevelopers> = await client.query(queryConfig);
  return res.status(200).json(queryResult.rows[0]);
};

export const deleteDevelopers = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { params } = request;
  const queryString: string = format(
    `DELETE FROM developers
      WHERE id = (%L);`,
    params.id
  );
  const queryResult: QueryResult<TDevelopers> = await client.query(queryString);
  const developer: TDevelopers = queryResult.rows[0];
  return response.status(204).send();
};

export { createDevelopers, createDevelopersInfo };
