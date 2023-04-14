interface TDevelopers {
  id: number;
  name: string;
  email: string;
}
type TDevelopersRequest = Omit<TDevelopers, "id">;

interface TDevelopersinfo {
  id: number;
  developerSince: Date;
  referredOS: string;
  developerId?: number;
}
interface DeveloperAndDeveloperInfo {
  developerId: number;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince: Date | null;
  developerInfoPreferredOS: string | null;
}
interface Ierror {
  message: string;
}
type TDevelopersinfoRequest = Omit<TDevelopersinfo, "id">;
export {
  TDevelopersRequest,
  TDevelopers,
  TDevelopersinfo,
  TDevelopersinfoRequest,
  DeveloperAndDeveloperInfo,
  Ierror,
};
