interface IProjects {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate?: Date | null;
  developerId: number;
}
interface Itechnologies {
  id: number;
  name: string;
}
type IProjectsRequest = Omit<IProjects, "id">;
interface IProjectsAndTecnologies {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectEstimatedTime: string;
  projectRepository: string;
  projectStartDate: Date;
  projectEndDate: Date;
  projectDeveloperId: number;
  technologyId: string | null;
  technologyName: string | null;
}
interface Ierror {
  message: string;
}
export { IProjectsRequest, IProjects, IProjectsAndTecnologies, Itechnologies };
