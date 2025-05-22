import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const DeleteUser = ({ isOpen, onClose, userId, onDelete, userName }) => {
    const navigate = useNavigate();
    const handleDelete = () => {
        axios.delete(`http://localhost:8083/v1/admin/${userId}`, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                deleteBalanceAndTransactionsOfUser();
                onDelete(userId);
                onClose();
            })
            .catch(error => {
                if (error.status === 401) {
                    // Token is expired or unauthorized
                    alert("Session expired. Please log in again.");
                    sessionStorage.removeItem("token"); // Clear the token
                    navigate('/'); // Redirect to login page
                } else {
                    console.error('There was an error deleting the user!', error);
                }
            });

    };
    const deleteBalanceAndTransactionsOfUser = async () => {
        try {
            await axios.delete(`http://localhost:8083/v1/bilanc/${userName}`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            console.error(error);
            alert('Error logging out. Please try again.');
        }

        try {
            await axios.delete(`http://localhost:8083/v1/transactions/${userName}`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            })
        } catch (error) {
            console.error(error);
            alert('Error logging out. Please try again.');
        }
    }
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-2xl mb-4">Delete User</h2>
                <p>Are you sure you want to delete this user?</p>
                <div className="flex justify-end space-x-2">
                    <button onClick={onClose} className="bg-gray-500 text-white px-3 py-1 rounded-md">Cancel</button>
                    <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded-md">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUser;