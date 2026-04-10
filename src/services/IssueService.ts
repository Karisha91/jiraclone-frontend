export enum Status {
  TO_DO = "TO_DO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE"
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}
export interface Issue {
    id: number;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    projectName: string;
    reporterUsername: string;
    assigneeUsername: string;
    projectId: number;
}
export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    author: string;
}

export const getIssuesByProjectId = async (id: number): Promise<Issue[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/issues/project/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.json();
};


export const deleteIssue = async (issueId: number): Promise<Response> => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/issues/${issueId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
};

export const createIssue = async (title: string, description: string, status: Status, priority: Priority, id: number): Promise<Response> => {
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


export const updateIssue =  async (title: string, description: string, status: Status, priority: Priority, id: number): Promise<Response> => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/issues/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, status, priority }),
    });
};

export const getIssueById =  async (id: number): Promise<Issue> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/issues/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.json();
};

export const getCommentsByIssueId = async (id: number): Promise<Comment[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/comments/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.json();
};

  export const deleteComment = async (commentId: number): Promise<Response> => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
}

export const getAllIssues = async (): Promise<Issue[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/issues`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    });
    return response.json();
}