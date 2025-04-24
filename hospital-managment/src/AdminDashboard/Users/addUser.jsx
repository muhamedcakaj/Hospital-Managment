import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const AddUser = ({ isOpen, onClose, onAdd }) => {
    const navigate = useNavigate();
    const [newUser, setNewUser] = useState({
        name: '',
        surname: '',
        userName: '',
        email: '',
        password: '',// Add this field to the initial state
        role: 'ROLE_USER'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8083/v1/admin', newUser, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                creatingNewBalanceForUser(newUser)
                handleChaching(newUser)
                onAdd(response.data);
                onClose();
            })
            .catch((error) => {
                if (error.status === 401) {
                    // Token is expired or unauthorized
                    alert("Session expired. Please log in again.");
                    sessionStorage.removeItem("token"); // Clear the token
                    navigate('/'); // Redirect to login page
                } else {
                    console.error('There was an error adding the user!', error);
                }
            });
    };

    const creatingNewBalanceForUser = async (newUser) => {
        //Creating a bilanc for the user logic START
        const bilanci = 0.0;
        const username = newUser.userName;
        const response2 = await fetch("http://localhost:8083/v1/bilanc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, bilanci }),
        });
        //Creating a bilanc for the user logic END

    }
    const handleChaching = async (newUser) => {
        try {
            await axios.delete(`http://localhost:8083/v1/user/deleteChaching/${newUser.userName}`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error(error);
            alert('Error logging out. Please try again.');
        }

        try {
            await axios.delete(`http://localhost:8083/v1/bilanc/deleteChaching/${newUser.userName}`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error(error);
            alert('Error logging out. Please try again.');
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Add user</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={newUser.name}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Surname</label>
                            <input
                                type="text"
                                name="surname"
                                value={newUser.surname}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Username</label>
                            <input
                                type="text"
                                name="userName"
                                value={newUser.userName}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Password</label>
                            <input
                                type="password" // Use password type for password input
                                name="password"
                                value={newUser.password}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={newUser.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-3 py-2 rounded-md mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-3 py-2 rounded-md"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUser;