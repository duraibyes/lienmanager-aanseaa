import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const AttorneyRoute = ({ children }: { children: ReactNode }) => {
  const auth = useSelector((state: RootState) => state.auth);
  const { view } = useSelector((state: RootState) => state.view);

  if (auth?.user?.role === 5) {
    return <Navigate to="/login" replace />;
  }
 
  if (!auth.token && view === null) return <Navigate to="/" replace />;
  if( auth?.user) {
    return <Navigate to="/attorney/dashboard" replace />;
  }
  return children;
}

export default AttorneyRoute;