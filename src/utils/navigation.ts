import { NavigateFunction } from "react-router-dom";

export const handleAddProject = (navigate: NavigateFunction) => {
  navigate("/project/create");
};

export const handleViewProject = (navigate: NavigateFunction, projectId: string) => {
  navigate(`/project/${projectId}`);
};

export const handleViewTasks = (navigate: NavigateFunction) => {
  navigate("/tasks");
}