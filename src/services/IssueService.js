

export const getIssuesByProjectId = (id) => {
    return fetch(`http://localhost:8080/api/issues/project/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
};

export const deleteIssue = (issueId) => {
    return fetch(`http://localhost:8080/api/issues/${issueId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
};

export const createIssue = (title, description, status, priority, id) => {
    return fetch("http://localhost:8080/api/issues", {
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