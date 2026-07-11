import Navbar from '../components/Navbar';
import { useEffect, useState } from "react";
import { AuditLog, getAuditLogs } from '../services/AuditService';
import './AuditLogsPage.css';

function AuditLogsPage() {

    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    getAuditLogs()
        .then(data => setAuditLogs(data))
        .catch(() => setError("Failed to load audit logs"));
}, []);

    return (
        <div className="audit-logs-container">
            <Navbar />
            <div className="audit-logs-header">
                <h1>Audit Logs</h1>
            </div>
            {error && <p className="audit-logs-error">{error}</p>}
            {auditLogs.length === 0 ? (
                <p className="audit-logs-empty">No audit logs available.</p>
            ) : (
                <table className="audit-logs-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Action</th>
                            <th>Occurred At</th>
                            <th>Entity Type</th>
                            <th>Entity ID</th>
                            <th>Entity Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditLogs.map((log) => (
                            <tr key={log.id}>
                                <td className="audit-username">{log.username}</td>
                                <td><span className="audit-action-badge">{log.action}</span></td>
                                <td className="audit-time">{new Date(log.occurredAt).toLocaleString()}</td>
                                <td className="audit-entity-type">{log.entityType}</td>
                                <td>{log.entityId}</td>
                                <td>{log.entityName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AuditLogsPage;