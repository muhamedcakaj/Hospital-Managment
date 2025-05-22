import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddUser from './addUser';
import DeleteUser from './deleteUser';
import { useNavigate } from 'react-router-dom';
const Users = () => {
    const [originalUserName, setOriginalUserName] = useState(null);
    const [users, setUsers] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        surname: '',
        userName: '',
        email: '',
        role: '',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:8083/v1/admin', {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data);
                setUsers(response.data);
                console.log('Users:', response.data);
            })
            .catch(error => {
                if (error.status === 401) {
                    // Token is expired or unauthorized
                    alert("Session expired. Please log in again.");
                    sessionStorage.removeItem("token"); // Clear the token
                    navigate('/'); // Redirect to login page
                }
                else {
                    console.error('There was an error fetching the users!', error);
                }
            });
    };

    const handleAddUser = (newUser) => {
        setUsers([...users, newUser]);
    };

    const handleUpdateUser = (updatedUser) => {
        setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
    };

    const handleDeleteUser = (userId) => {
        setUsers(users.filter(user => user.id !== userId));
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        resetFormData();
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setOriginalUserName(user.userName);
        setFormData({
            name: user.name || '',
            surname: user.surname || '',
            userName: user.userName || '',
            email: user.email || '',
            role: user.role || ''
        });
        setIsEditModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSend = { ...formData };
        console.log(originalUserName);
        console.log(dataToSend);

        axios.put(`http://localhost:8083/v1/admin/${originalUserName}`, dataToSend, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        })
            .then(response => {
                reUpdateBalancUsername(originalUserName)
                console.log('User data updated successfully:', response.data);
                handleUpdateUser(response.data);
                closeEditModal();
                fetchUsers(); // Call fetchUsers function here
            })
            .catch(error => {
                if (error.status === 401) {
                    // Token is expired or unauthorized
                    alert("Session expired. Please log in again.");
                    sessionStorage.removeItem("token"); // Clear the token
                    navigate('/'); // Redirect to login page
                } else {
                    console.error('There was an error updating the user!', error.response ? error.response.data : error.message);
                }
            });
    };

    const resetFormData = () => {
        setFormData({
            id: null,
            name: '',
            surname: '',
            userName: '',
            email: '',
            role: '',
        });
    };
    //After updating the userName reupdating the username in balanc database logic START
    const reUpdateBalancUsername = async (userName) => {
        console.log(userName);
        const userNameToSent = {
            username: userName, // The key should match the expected key in your backend
        };

        const response = await fetch(`http://localhost:8083/v1/bilanc/${userName}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userNameToSent),
        });
        if (response.status === 401) {

            // Token is expired or unauthorized
            alert("Session expired. Please log in again.");
            sessionStorage.removeItem("token"); // Clear the token
            navigate('/'); // Redirect to login page
        }
    }
    //After updating the userName reupdating the username in balanc database logic END

    return (
        <div className="bg-white p-4 shadow rounded-lg">
            <h2 className="text-2xl font-semibold">All Users</h2>

            <div className="mt-4 flex justify-between">
                <input
                    type="text"
                    placeholder="Search for users"
                    className="p-2 border rounded-md"
                />
                <div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2"
                    >
                        Add User
                    </button>
                </div>
            </div>
            <table className="min-w-full mt-4">
                <thead>
                    <tr>
                        <th className="py-2">Id</th>
                        <th className="py-2">Name</th>
                        <th className="py-2">Surname</th>
                        <th className="py-2">Username</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Role</th>
                        <th className="py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-t">
                            <td className="py-2">{user.id}</td>
                            <td className="py-2">{user.name}</td>
                            <td className="py-2">{user.surname}</td>
                            <td className="py-2">{user.userName}</td>
                            <td className="py-2">{user.email}</td>
                            <td className="py-2">{user.role}</td>
                            <td className="py-2 space-x-2">
                                <button
                                    onClick={() => handleEditUser(user)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                                >
                                    Edit User
                                </button>
                                <button
                                    onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                                >
                                    Delete User
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AddUser
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddUser}
            />
            {isEditModalOpen && (
                < div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Edit User</h2>
                            <button onClick={closeEditModal} className="text-gray-600 hover:text-gray-900">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label className="block text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Surname</label>
                                    <input
                                        type="text"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700">User Role</label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="bg-gray-500 text-white px-3 py-2 rounded-md mr-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-3 py-2 rounded-md"
                                >
                                    Save All
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )
            }
            <DeleteUser
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                userId={selectedUser?.id}
                onDelete={handleDeleteUser}
                userName={selectedUser?.userName}
            />
        </div >
    );
};

export default Users;