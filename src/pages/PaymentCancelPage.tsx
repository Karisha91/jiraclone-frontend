import { useNavigate } from "react-router-dom";
import { IconX, IconLayoutBoard, IconUsers, IconHeadset } from "@tabler/icons-react";
import "./PaymentCancel.css";

export default function PaymentCancelPage() {
    const navigate = useNavigate();

    return (
        <div className="cancel-wrap">
            <div className="cancel-card">
                <div className="cancel-icon-ring">
                    <IconX size={36} color="#64748b" />
                </div>

                <h1 className="cancel-title">No worries</h1>
                <p className="cancel-subtitle">
                    You cancelled the upgrade — nothing was charged. You can come back and upgrade anytime you're ready.
                </p>

                <div className="perks">
                    <p className="perks-title">Still waiting for you</p>
                    <div className="perk-item">
                        <IconLayoutBoard size={16} color="#475569" />
                        <span>Unlimited workspaces</span>
                    </div>
                    <div className="perk-item">
                        <IconUsers size={16} color="#475569" />
                        <span>Unlimited workspace members</span>
                    </div>
                    <div className="perk-item">
                        <IconHeadset size={16} color="#475569" />
                        <span>Priority support</span>
                    </div>
                </div>

                <button className="btn-primary" onClick={() => navigate("/workspace")}>
                    Try again
                </button>
                <button className="btn-secondary" onClick={() => navigate("/workspace")}>
                    Go to workspaces
                </button>
            </div>
        </div>
    );
}