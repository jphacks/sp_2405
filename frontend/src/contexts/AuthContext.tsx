import { createContext, Dispatch, SetStateAction } from "react";
import { UserType } from "../types/Types";
import { NavigateFunction } from "react-router-dom";

type ContextType = {
  userData: UserType;
  setUserData: Dispatch<SetStateAction<UserType>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  navigate: NavigateFunction;
};
export const AuthContext = createContext<ContextType>({} as ContextType);
