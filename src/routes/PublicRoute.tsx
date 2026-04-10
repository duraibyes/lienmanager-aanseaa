// src/routes/PublicRoute.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../store";


const PublicRoute = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector((state) => state.auth.token);
  const { view } = useSelector((state: RootState) => state.view);

  console.log( ' view ', view);
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
