import { Project } from "./ProjectService"


export interface Workspace {
    id: number,
    name: string,
    description: string,
    createdAt: Date,
    owner: OwnerSummary,
    members: MemberSummary[],
    projects: ProjectSummary[]



}



export interface OwnerSummary {
    id: number,
    username: string
}

export interface MemberSummary {
    id: number,
    username: string,
    avatarUrl: string
}

export interface ProjectSummary {
    id: number,
    name: string
}



export const getWorkspaces = async (): Promise<Workspace[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workspace`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.json();
}


export const getAllProjectsByWorkspaceId = async (workspaceId: number): Promise<Project[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workspace/${workspaceId}/projects`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.json();
}


export const addMemberToWorkspace = async (workspaceId: number, username: string): Promise<Response> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workspace/${workspaceId}/members`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            
            username: username
        })
    });
    return response;
}

export const getWorkspace = async (workspaceId: number): Promise<Workspace> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/workspace/${workspaceId}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.json();
}

export const createWorkspace = async (workspaceName : string, description: string): Promise<Response> => {
    const response = await fetch (`${import.meta.env.VITE_API_URL}/api/workspace`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: workspaceName,
            description: description
        })
    });
    return response;
}

export const deleteWorkspace = async (workspaceId : number) : Promise<Response> => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/workspace/${workspaceId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
}

export const removeMember = async (workspaceId : number, username: string) : Promise<Response> => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/workspace/${workspaceId}/members`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            
        })
    })
}