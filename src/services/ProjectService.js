export const  getProjects= () =>{
    
      return  fetch("http://localhost:8080/api/projects", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          
    
}
export const deleteProject = (id) => {
    return fetch(`http://localhost:8080/api/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  };

  export const createProject = (projectName, description) => {
    return fetch("http://localhost:8080/api/projects", {
      method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        }
        ,body: JSON.stringify({ name: projectName, description })

    });
};