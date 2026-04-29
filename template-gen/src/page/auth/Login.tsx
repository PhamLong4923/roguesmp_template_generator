import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "@/firebase/config";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("TRUY CẬP");
    const navigate = useNavigate();

    const progress =
        (email.trim().length > 0 ? 50 : 0) + (password.length > 0 ? 50 : 0);

    const handleLogin = async () => {
        if (loading) return;
        if (!email.trim() || !password.trim()) {
            setError("Vui lòng nhập đầy đủ email và mật khẩu.");
            setTimeout(() => setError(""), 2500);
            return;
        }
        setLoading(true);
        setError("");
        try {
            const steps = ["AUTHENTICATING...", "LOADING...", "READY"];
            for (const step of steps) {
                setStatus(step);
                await new Promise((r) => setTimeout(r, 500));
            }
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch {
            setError("Sai email hoặc mật khẩu.");
            setStatus("TRUY CẬP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Cinzel:wght@700&display=swap');
        .mcd-input::placeholder { color: #2a2218; font-size: 11px; }
        .mcd-input:focus { border-color: #b8821e !important; }
        .mcd-btn:hover:not(:disabled) { background: #d09428 !important; }
        .mcd-btn:active:not(:disabled) { background: #9a6c18 !important; }
        .mcd-link:hover { color: #b8821e !important; }
      `}</style>

            <div style={{
                display: "flex",
                minHeight: "100vh",
                background: "#0f0e0d",
                fontFamily: "'JetBrains Mono', monospace",
            }}>

                {/* Left — background image */}
                <div style={{
                    width: "50%",
                    backgroundImage: ``,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRight: "1px solid #2a2218",
                    flexShrink: 0,
                }} />

                {/* Right — login form */}
                <div style={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "48px 56px",
                }}>

                    {/* Logo */}
                    <div style={{ marginBottom: 36 }}>
                        <div style={{
                            fontFamily: "'Cinzel', serif",
                            fontSize: 16, fontWeight: 700,
                            color: "#e8d4a0", letterSpacing: 2,
                        }}>MCD Dev Portal</div>
                        <div style={{
                            fontSize: 9, color: "#3a2e18",
                            letterSpacing: 3, marginTop: 5,
                        }}>INTERNAL TOOLING</div>
                    </div>

                    <div style={{
                        fontSize: 11, color: "#6a5a38",
                        letterSpacing: 2, marginBottom: 28,
                    }}>ĐĂNG NHẬP</div>

                    {/* Progress bar */}
                    <div style={{ height: 1, background: "#2a2218", marginBottom: 20 }}>
                        <div style={{
                            height: "100%",
                            background: error ? "#801818" : "#b8821e",
                            width: `${progress}%`,
                            transition: "width 0.3s",
                        }} />
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            fontSize: 9, color: "#cc4040",
                            letterSpacing: 1, marginBottom: 14,
                            paddingLeft: 10,
                            borderLeft: "2px solid #801818",
                            lineHeight: 1.7,
                        }}>{error}</div>
                    )}

                    {/* Email */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{
                            display: "block", fontSize: 9,
                            color: "#4a3a20", letterSpacing: 2, marginBottom: 6,
                        }}>EMAIL</label>
                        <input
                            className="mcd-input"
                            type="email"
                            placeholder="name@studio.internal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && document.getElementById("mcd-pass").focus()}
                            style={{
                                width: "100%",
                                background: "#0f0e0d",
                                border: "1px solid #2a2218",
                                color: "#e8d4a0",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 12, padding: "10px 12px", outline: "none",
                                letterSpacing: 0.5,
                            }}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: 6 }}>
                        <label style={{
                            display: "block", fontSize: 9,
                            color: "#4a3a20", letterSpacing: 2, marginBottom: 6,
                        }}>MẬT KHẨU</label>
                        <input
                            id="mcd-pass"
                            className="mcd-input"
                            type="password"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            style={{
                                width: "100%",
                                background: "#0f0e0d",
                                border: "1px solid #2a2218",
                                color: "#e8d4a0",
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: 12, padding: "10px 12px", outline: "none",
                                letterSpacing: 0.5,
                            }}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        className="mcd-btn"
                        onClick={handleLogin}
                        disabled={loading}
                        style={{
                            width: "100%",
                            background: loading ? "#2a2218" : "#b8821e",
                            border: "none",
                            color: loading ? "#3a2e18" : "#0f0e0d",
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 10, fontWeight: 500,
                            padding: 12, cursor: loading ? "not-allowed" : "pointer",
                            letterSpacing: 3, marginTop: 14,
                            transition: "background 0.15s",
                        }}
                    >{status}</button>

                    {/* Footer links */}
                    <div style={{
                        marginTop: 20,
                        display: "flex", justifyContent: "space-between",
                    }}>
                        <a className="mcd-link" href="#" style={{
                            fontSize: 9, color: "#2a2218", letterSpacing: 1, textDecoration: "none",
                        }}>Quên mật khẩu</a>
                        <a className="mcd-link" href="#" style={{
                            fontSize: 9, color: "#2a2218", letterSpacing: 1, textDecoration: "none",
                        }}>Yêu cầu quyền truy cập</a>
                    </div>

                </div>
            </div>
        </>
    );
}