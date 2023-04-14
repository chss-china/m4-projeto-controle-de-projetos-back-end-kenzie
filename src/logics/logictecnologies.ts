import { Request, Response, response } from "express";
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
//essa função está dando erro de sintaxe no ponto e também tem que retornar um array com varios objetos,
//onde cada objeto é um item
export const getProjectsTech = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // const id: number = parseInt(req.params.id);
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
  pt."technologyId"
  te."name" AS "technologyName"
  FROM
    projects pr
 LEFT JOIN
 projects_technologies pt ON pr."id" = pt."id"
 LEFT JOIN
 technologies te ON pt."id" = te."id"
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

export const verifyTechExistTech = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const name = {
    name: req.body.name,
  };
  if (
    name.name != "Javascript" &&
    name.name != "Python" &&
    name.name != "React" &&
    name.name != "Express.js" &&
    name.name != "HTML" &&
    name.name != "CSS" &&
    name.name != "Django" &&
    name.name != "PostgreSQL" &&
    name.name != "MongoDB"
  ) {
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
};
//não funcionando
export const createTechProjects = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const tecnologyId = response.locals.technology.id;
  const id = parseInt(req.params.id);
  console.log(id);
  /*let queryString: string = `
    INSERT INTO
   projects_technologies ("technologyId","projectId","addedIn")
    VALUES
      ($1,$2,$3);
    `;
  let queryConfig: QueryConfig = {
    text: queryString,
    values: [tecnologyId, id, new Date()],
  };
  queryString = ` SELECT
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
 projects_technologies pt ON pr."projectId" = pt."id"
 LEFT JOIN
 technologies te ON pt."technologyId" = te."id"
 WHERE pr."id" = $1; `;

  queryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<IProjectsAndTecnologies> = await client.query(
    queryConfig
  );*/

  return res.status(201).json("foi");
};
//terminar depois
export const deleteTechProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectId = parseInt(req.params.id);
  const nameTechnology = req.params.name;
  const updateColumns: string[] = Object.keys(req.params.name);
  const updateValues: string[] = Object.values(req.params.name);
  // const name: string = req.params.name;
  const queryTechnologyId: string = `
   SELECT * FROM technologies
   WHERE name = $1;
  `;
  const queryFormat: string = format(
    queryTechnologyId,
    updateColumns,
    updateValues
  );
  const queryConfig: QueryConfig = {
    text: queryFormat,
    values: [nameTechnology],
  };
  console.log(queryConfig);
  const queryResult: QueryResult<IProjectsAndTecnologies> = await client.query(
    queryConfig
  );
  let result = queryResult.rows[0].technologyId;
  const queryString2: string = `
  DELETE FROM projects_technologies
  WHERE "technologyId" = $1
  AND "projectId" = $1;
  `;

  const developer: IProjectsAndTecnologies = queryResult.rows[0];
  return res.status(204).send();
};
