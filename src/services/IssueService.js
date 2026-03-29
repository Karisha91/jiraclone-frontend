

export const getIssuesByProjectId = (id) => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/issues/project/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
};

export const deleteIssue = (issueId) => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/issues/${issueId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
};

export const createIssue = (title, description, status, priority, id) => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/issues`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            status,
            priority,
            project: { id: id },
          }),
        });
};


export const updateIssue = (title, description, status, priority, id) => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/issues/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, status, priority }),
    });
};

export const getIssueById = (id) => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/issues/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
};

export const getCommentsByIssueId = (id) => {
 return fetch(`${import.meta.env.VITE_API_URL}/api/comments/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    })
  }