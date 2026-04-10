// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/index.ts";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const { view } = useSelector((state: RootState) => state.view);
  if (!token) return view == 'member' ? <Navigate to="/login" replace /> : <Navigate to="/attorney/login" replace />;

  return children;
};

export default ProtectedRoute;
