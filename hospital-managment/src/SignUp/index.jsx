import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (firstName.length > 25 || lastName.length > 25) {
      alert('First name and last name must be under 25 characters.');
      return;
    }

    try {
      const response = await fetch("http://localhost:8085/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (response.ok) {
        alert("Signup successful. Please verify your email and login.");
        navigate('/');
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
      <form onSubmit={handleSignup} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <input type="text" name="firstName" placeholder="First Name" required className="w-full mb-4 p-2 border rounded" />
        <input type="text" name="lastName" placeholder="Last Name" required className="w-full mb-4 p-2 border rounded" />
        <input type="email" name="email" placeholder="Email" required className="w-full mb-4 p-2 border rounded" />
        <input type="password" name="password" placeholder="Password" required className="w-full mb-4 p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Sign Up</button>
        <p className="text-sm mt-4 text-center">
          Already have an account? <span onClick={() => navigate('/')} className="text-blue-500 cursor-pointer">Login</span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;