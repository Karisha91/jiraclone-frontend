import PageResponse from "../issueService";


export enum AuditAction {
    PROJECT_CREATED = 'PROJECT_CREATED',
    PROJECT_UPDATED = 'PROJECT_UPDATED',
    PROJECT_DELETED = 'PROJECT_DELETED',
    ISSUE_CREATED = 'ISSUE_CREATED',
    ISSUE_UPDATED = 'ISSUE_UPDATED',
    ISSUE_DELETED = 'ISSUE_DELETED',
    ISSUE_ASSIGNED = `ISSUE_ASSIGNED`,
    COMMENT_CREATED = 'COMMENT_CREATED',
    COMMENT_DELETED = 'COMMENT_DELETED',
    ROLE_CHANGED = 'ROLE_CHANGED',
    

}


export interface AuditLog {
    id: number;
    username: string;
    action: AuditAction;
    occurredAt: Date;
    entityType: string;
    entityId: number;
    entityName: string;
}

export const getAuditLogs = async (): Promise<AuditLog[]> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/audit-logs`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    return response.json();
}
    