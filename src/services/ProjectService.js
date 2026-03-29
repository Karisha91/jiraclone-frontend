export const  getProjects= () =>{
    
      return  fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          
    
}
export const deleteProject = (id) => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  };

  export const createProject = (projectName, description) => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
      method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        }
        ,body: JSON.stringify({ name: projectName, description })

    });
};