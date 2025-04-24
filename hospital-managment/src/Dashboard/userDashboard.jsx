import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();    
    const [userData, setUserData] = useState({
        id: null,
        name: '',
        surname: '',
        userName: '',
        password: '',
    });
    const [originalUserData, setOriginalUserData] = useState({});
    const [activeTab, setActiveTab] = useState('personal-details');
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        //Initilazing the userName from token logic START
        const token = sessionStorage.getItem("token")
        const [header, payload, signature] = token.split('.');
        const decodedPayload = atob(payload);

        const payloadObject = JSON.parse(decodedPayload);
        setUserName(payloadObject.sub)
        //Initilazing the userName from token logic END
        if (userName) {
            setUserName(userName);
        }
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8083/v1/user/username/${userName}`, {
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                    }
                });
                if (response.status === 401) {

                    // Token is expired or unauthorized
                    alert("Session expired. Please log in again.");
                    sessionStorage.removeItem("token"); // Clear the token
                    navigate('/'); // Redirect to login page
                }
                const userDataFromApi = response.data;
                setUserData(userDataFromApi);
                setOriginalUserData(userDataFromApi); // Set original user data
            } catch (error) {
                console.error('Error fetching user data:', error);

            }
        };

        if (userName) {
            fetchUserData();
        }
    }, [userName]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleEditClick = () => {
        setEditable(true);
    };

    const handleSaveClick = async () => {
        try {
            const dataToUpdate = {};
            for (const key in userData) {
                if (userData.hasOwnProperty(key)) {
                    if (userData[key] !== originalUserData[key]) {
                        dataToUpdate[key] = userData[key];
                    }
                }
            }
            const response = await axios.put(`http://localhost:8083/v1/user/${userName}`, dataToUpdate, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                }
            })

            if (dataToUpdate.userName != undefined) {
                const data = response.data;
                const token = data.token;
                sessionStorage.setItem("token", token)
                console.log(token);
                reUpdateBalancUsername(dataToUpdate);//Updating the username in bilance database logic
                reUpdateTransactionUsername(dataToUpdate);//Updating the username in transaction database logic
                setUserName(dataToUpdate.userName);
            }
            else if (response.status === 401) {

                // Token is expired or unauthorized
                alert("Session expired. Please log in again.");
                sessionStorage.removeItem("token"); // Clear the token
                navigate('/'); // Redirect to login page
            }
            setEditable(false);

        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    //After updating the userName reupdating the username in balanc database logic START
    const reUpdateBalancUsername = async (dataToUpdate) => {
        console.log(dataToUpdate.userName);
        const userNameToSent = {
            username: dataToUpdate.userName, // The key should match the expected key in your backend
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

    //After updating the userName reupdating the username in transaction database logic START
    const reUpdateTransactionUsername = async (dataToUpdate) => {
        const userNameToSent = {
            userUsername: dataToUpdate.userName, // The key should match the expected key in your backend
        };

        const response = await fetch(`http://localhost:8083/v1/transactions/userUsername/${userName}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
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
    //After updating the userName reupdating the username in transaction database logic END

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value
        });
    };

    return (
        <div className="max-w-7xl mx-auto mt-16 px-10 py-12 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 rounded-xl shadow-2xl">
            <div className="flex">
                <div className="w-1/3 bg-gradient-to-br from-indigo-900 via-indigo-700 to-indigo-500 rounded-xl p-8 shadow-xl text-white">
                    <h2 className="text-4xl font-extrabold mb-10 font-serif">Welcome {userName}</h2>
                </div>
                <div className="w-2/3 ml-8">
                    {activeTab === 'personal-details' && (
                        <div id="personal-details" className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-xl p-8 shadow-xl">
                            <h2 className="text-3xl font-bold mb-8 text-gray-800 font-serif border-b-2 border-gray-300 pb-2">Personal Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="mb-6">
                                    <label className="block text-lg font-semibold text-gray-800">Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        onChange={handleChange}
                                        readOnly={!editable}
                                        className="mt-2 p-4 w-full rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-lg font-semibold text-gray-800">Surname:</label>
                                    <input
                                        type="text"
                                        name="surname"
                                        value={userData.surname}
                                        onChange={handleChange}
                                        readOnly={!editable}
                                        className="mt-2 p-4 w-full rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-lg font-semibold text-gray-800">Username:</label>
                                    <input
                                        type="text"
                                        name="userName"
                                        value={userData.userName}
                                        onChange={handleChange}
                                        readOnly={!editable}
                                        className="mt-2 p-4 w-full rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-lg font-semibold text-gray-800">Password:</label>
                                    <textarea
                                        name="password"
                                        value={userData.password}
                                        onChange={handleChange}
                                        readOnly={!editable}
                                        className="mt-2 p-4 w-full rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                                    ></textarea>
                                </div>
                            </div>
                            {!editable ? (
                                <button
                                    onClick={handleEditClick}
                                    className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300"
                                >
                                    Edit
                                </button>
                            ) : (
                                <button
                                    onClick={handleSaveClick}
                                    className="mt-8 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all duration-300"
                                >
                                    Save
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default UserDashboard;