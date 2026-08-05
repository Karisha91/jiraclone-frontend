import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconCheck, IconCrown, IconLayoutBoard, IconUsers, IconHeadset } from "@tabler/icons-react";
import "./PaymentSuccess.css";

export default function PaymentSuccessPage() {
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(5);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    navigate("/workspace");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="success-wrap">
            <div className="success-card">
                <div className="icon-ring">
                    <IconCheck size={36} color="#e94560" />
                </div>

                <div className="badge-premium">
                    <IconCrown size={13} color="#e94560" />
                    Premium
                </div>

                <h1 className="success-title">You're all set!</h1>
                <p className="success-subtitle">
                    Your payment was confirmed and your account has been upgraded.
                    All premium features are now unlocked.
                </p>

                <div className="perks">
                    <p className="perks-title">What you unlocked</p>
                    <div className="perk-item">
                        <IconLayoutBoard size={16} color="#e94560" />
                        <span>Unlimited workspaces</span>
                    </div>
                    <div className="perk-item">
                        <IconUsers size={16} color="#e94560" />
                        <span>Unlimited workspace members</span>
                    </div>
                    <div className="perk-item">
                        <IconHeadset size={16} color="#e94560" />
                        <span>Priority support</span>
                    </div>
                </div>

                <p className="countdown">
                    Redirecting to workspace in <span>{seconds}s</span>
                </p>
                <button className="go-btn" onClick={() => navigate("/workspace")}>
                    Go to workspace now
                </button>
            </div>
        </div>
    );
}