export interface Project {
    id: number;
    projectName: string;
    description: string;
    owner: string;
}




export const  getProjects = async (): Promise<Project[]> => {
    
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return response.json();
    
    
}
export const deleteProject = async (id: number): Promise<Response> => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  };

  export const createProject = async (projectName: string, description: string): Promise<Response> => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
      method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        }
        ,body: JSON.stringify({ name: projectName, description })

    });
};