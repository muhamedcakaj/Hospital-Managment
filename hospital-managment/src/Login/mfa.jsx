import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MfaPage = () => {
    const navigate = useNavigate();
    const userName = sessionStorage.getItem('userName');

    const [mfaCode, setMfaCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false); // Track if the code is sent

    // Handle sending MFA code
    const handleSendCode = async () => {
        try {
            const response = await fetch(`http://localhost:8083/v1/user/mfaCode/${userName}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setIsCodeSent(true); // Code sent successfully
            } else {
                console.error("Failed to send MFA code");
                alert("Failed to send MFA code. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while sending the code.");
        }
    };

    // Handle verifying MFA code
    const handleMfaSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8083/v1/user/validateCode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userName, mfaCode }),
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                sessionStorage.setItem("token", token);

                // Decode token to get the user's role
                const [header, payload] = token.split('.');
                const decodedPayload = JSON.parse(atob(payload));

                // Navigate based on role
                if (decodedPayload.role === "ROLE_ADMIN") {
                    navigate("/adminDashboard/adminHome");
                } else {
                    navigate("/dashboard/home");
                }
            } else {
                const error = await response.text();
                console.error("Error:", error);
                alert(error);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    {isCodeSent 
                        ? "Enter the code that we sent to your email"
                        : "Press the button below to send the MFA code"}
                </h2>

                {!isCodeSent ? (
                    <button
                        onClick={handleSendCode}
                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Send Code
                    </button>
                ) : (
                    <form onSubmit={handleMfaSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={mfaCode}
                            name='mfaCode'
                            onChange={(e) => setMfaCode(e.target.value)}
                            placeholder="MFA Code"
                            required
                            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Verify
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default MfaPage;