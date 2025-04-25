import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("http://localhost:8085/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        alert("Login successful");
        sessionStorage.setItem('email', email);
        navigate("/mfapage");
      } else {
        const error = await response.text();
        alert(error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input type="email" name="email" placeholder="Email" required className="w-full mb-4 p-2 border rounded" />
        <input type="password" name="password" placeholder="Password" required className="w-full mb-4 p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
        <p className="text-sm mt-4 text-center">
          Don't have an account? <span onClick={() => navigate('/signup')} className="text-blue-500 cursor-pointer">Sign Up</span>
        </p>
      </form>
    </div>
  );
};

export default Login;