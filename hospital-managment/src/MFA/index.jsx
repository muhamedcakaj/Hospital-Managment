import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MfaPage = () => {
    const navigate = useNavigate();
    const email = sessionStorage.getItem('email');

    const [code, setCode] = useState('');

    // Handle verifying MFA code
    const handleMfaSubmit = async (e) => {
        e.preventDefault();
        console.log(email);
        console.log(code);
        
        
        try {
            const response = await fetch("http://localhost:8085/auth/confirmEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, code }),
            });
            console.log(response);
            
            if (response.ok) {
                const data = await response.json();
                const token = data.token;
                sessionStorage.setItem("token", token);
                // Decode token to get the user's role
                const [header, payload] = token.split('.');
                const decodedPayload = JSON.parse(atob(payload));

                if(decodedPayload.role === "Admin"){

                } else if(decodedPayload.role === "Doctor"){
                    navigate("/doctordashboard")
                } else if(decodedPayload.role === "User"){
                    navigate("/patientdashboard")
                }
                alert("authentication Sucesfully");

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
                </h2>
                    <form onSubmit={handleMfaSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={code}
                            name='code'
                            onChange={(e) => setCode(e.target.value)}
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
            </div>
        </div>
    );
};

export default MfaPage;