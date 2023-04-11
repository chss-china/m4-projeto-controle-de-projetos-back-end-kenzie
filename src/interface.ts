interface TDevelopers {
  id: number;
  name: string;
  email: string;
}
type TDevelopersRequest = Omit<TDevelopers, "id">;
export { TDevelopersRequest, TDevelopers };
