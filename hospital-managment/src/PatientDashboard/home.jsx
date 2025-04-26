import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();
    //After adding a transaction we have to lower the bilanc this is the logic START
    const afterAddingaTransactionLowerTheBalanc = async (sum) => {
        const sum1 = {
            bilanci: "- " + sum, // The key should match the expected key in your backend
        };
        try {
            const response = await fetch(`http://localhost:8083/v1/bilanc/${userName}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sum1),
            });
            if (response.ok) {
                handleUser();
                fetchTransactions();
            }
            else if (response.status === 401) {

                // Token is expired or unauthorized
                alert("Session expired. Please log in again.");
                sessionStorage.removeItem("token"); // Clear the token
                navigate('/'); // Redirect to login page
            }
        } catch (error) {
            console.error = await response.text();
        }
    }
    //Filling the Category option with EURO logic START
    const [categorySums, setCategorySums] = useState({});
    const fetchCategoryWithEuro = async () => {
        fetch(`http://localhost:8083/v1/transactions/category/${userName}`, {
            headers: {
                "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
            },
        })

            .then((response) => response.json())
            .then((data) => {
                const sums = data.reduce((acc, item) => {
                    acc[item.category] = item.totalSum || 0;
                    return acc;
                }, {});
                setCategorySums(sums);
            })
            .catch((error) => console.error("Error fetching category sums:", error));
    }
    //Filling the Category option with EURO logic END

    //Showing the transactions info to the user logic START
    const [transactions, setTransactions] = useState([]);
    const fetchTransactions = async () => {
        try {
            const response = await fetch(`http://localhost:8083/v1/transactions/${userName}`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                },
            });
            if (response.status === 401) {

                // Token is expired or unauthorized
                alert("Session expired. Please log in again.");
                sessionStorage.removeItem("token"); // Clear the token
                navigate('/'); // Redirect to login page

            }
            else if (!response.ok) {
                throw new Error("Failed to fetch transactions");
            }
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };
    //Showing the transactions info to the user logic END

    //Getting the balanc info from the database logic START
    const [balancData, setBalancData] = useState(null);

    const handleUser = async () => {

        try {
            const response = await fetch(`http://localhost:8083/v1/bilanc/username/${userName}`, {//getting the balanc of the user
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                },
            });
            if (response.status === 401) {

                // Token is expired or unauthorized
                alert("Session expired. Please log in again.");
                sessionStorage.removeItem("token"); // Clear the token
                navigate('/'); // Redirect to login page

            }
            else if (!response.ok) {
                throw new Error("Failed to fetch user data");
            }
            const balancData = await response.json();

            setBalancData(balancData)
        } catch (error) {
            console.error("Error fetching balanc data", error);
        }
    };

    useEffect(() => {
        //Initilazing the userName from token logic START
        const token = sessionStorage.getItem("token")
        const [header, payload, signature] = token.split('.');
        const decodedPayload = atob(payload);

        const payloadObject = JSON.parse(decodedPayload);
        setUserName(payloadObject.sub)
        //Initilazing the userName from token logic END
        if (userName) {
            handleUser();
            fetchTransactions();
            fetchCategoryWithEuro();
        }
    }, [userName]);

    if (!balancData) {
        return <div>Loading...</div>;
    }
    //Getting the balanc info from the database logic END

    //Sending the transactions info to database logic START
    const handleSubmit = async (e) => {
        e.preventDefault();

        const prupose = e.target.prupose.value;
        const sum = e.target.sum.value;
        const transaction_date = e.target.transaction_date.value;
        const category = e.target.category.value;
        const userUsername = userName;

        try {
            const response = await fetch("http://localhost:8083/v1/transactions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userUsername, prupose, category, sum, transaction_date }),
            });
            if (response.ok) {
                e.target.reset();
                afterAddingaTransactionLowerTheBalanc(sum);
                alert("Transaction added successfully!");
            }
            else if (response.status === 401) {

                // Token is expired or unauthorized
                alert("Session expired. Please log in again.");
                sessionStorage.removeItem("token"); // Clear the token
                navigate('/'); // Redirect to login page
            }
            else {
                const error = await response.text();
                alert(error); // Display error message
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    //Sending the transactions info to database with logic END

    //The delete option for transaction logic START
    const handleDelete = async (transactionId) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            try {
                const response = await fetch(`http://localhost:8083/v1/transactions/oneTransaction/${transactionId}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                    },
                });
                if (response.ok) {
                    setTransactions((prev) => prev.filter((item) => item.id !== transactionId));
                }
                else if (response.status === 401) {

                    // Token is expired or unauthorized
                    alert("Session expired. Please log in again.");
                    sessionStorage.removeItem("token"); // Clear the token
                    navigate('/'); // Redirect to login page
                }
                else {
                    const error = await response.text();
                    alert(error);
                }
            } catch (error) {
                console.error("Error deleting transaction:", error);
            }
        }
    };
    //The delete option for transaction logic END

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 p-6">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    <div className="col-span-1 md:col-span-2 bg-green-500 text-white p-4 rounded-lg shadow-md">
                        <h4 className="text-sm">Balance</h4>
                        <p className="text-2xl font-bold">EUR {balancData.bilanci.toFixed(2)} €</p>
                    </div>
                    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
                        <h4 className="text-sm">Shopping</h4>
                        <p className="text-lg font-bold">EUR {categorySums['Shopping']?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div className="bg-yellow-500 text-white p-4 rounded-lg shadow-md">
                        <h4 className="text-sm">Food & Drinks</h4>
                        <p className="text-lg font-bold">EUR {categorySums["Food"]?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
                        <h4 className="text-sm">Bills & Utilities</h4>
                        <p className="text-lg font-bold">EUR {categorySums['Bills']?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div className="bg-purple-800 text-white p-4 rounded-lg shadow-md">
                        <h4 className="text-sm">Car</h4>
                        <p className="text-lg font-bold">EUR {categorySums['Car']?.toFixed(2) || "0.00"}</p>
                    </div>
                    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
                        <h4 className="text-sm">Others</h4>
                        <p className="text-lg font-bold">EUR {categorySums['Others']?.toFixed(2) || "0.00"}</p>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Recent Transactions */}
                    <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
                        <h4 className="text-lg font-bold mb-4">Recent Transactions</h4>
                        <div className="overflow-auto max-h-[600px] border rounded-lg shadow-md">
                            <table className="w-full text-sm sm:text-base">
                                <thead>
                                    <tr>
                                        <th className="text-left py-2 px-4">Purpose</th>
                                        <th className="text-left py-2 px-4">Category</th>
                                        <th className="text-right py-2 px-4">Sum</th>
                                        <th className="text-right py-2 px-4">Date</th>
                                        <th className="text-center py-2 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions
                                        .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)) // Sort by date descending
                                        .map((transaction, index) => (
                                            <tr
                                                key={index}
                                                className={`border-t ${transaction.category.toLowerCase() === 'cash'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                <td className="py-2 px-4">{transaction.prupose}</td>
                                                <td className="py-2 px-4">{transaction.category}</td>
                                                <td className="py-2 px-4 text-right">
                                                    {transaction.category.toLowerCase() === 'cash'
                                                        ? `+${transaction.sum} EUR`
                                                        : `-${transaction.sum} EUR`}
                                                </td>
                                                <td className="py-2 px-4 text-right">{transaction.transaction_date}</td>
                                                <td className="py-2 px-4 text-center">
                                                    <button
                                                        onClick={() => handleDelete(transaction.id)}
                                                        className="text-red-500 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Add Expenditure */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h4 className="text-lg font-bold mb-4">Add Expenditure</h4>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Purpose</label>
                                <input
                                    type="text"
                                    name="prupose"
                                    required
                                    className="w-full border rounded-lg p-2 mt-1 focus:outline-none"

                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Sum</label>
                                <input
                                    type="text"
                                    name="sum"
                                    required
                                    className="w-full border rounded-lg p-2 mt-1 focus:outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Date</label>
                                <input
                                    type="date"
                                    name="transaction_date"
                                    required
                                    className="w-full border rounded-lg p-2 mt-1 focus:outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium">Category</label>
                                <select
                                    className="w-full border rounded-lg p-2 mt-1 focus:outline-none"
                                    defaultValue=""
                                    name="category"
                                    required
                                >
                                    <option value="" disabled>
                                        Select a category
                                    </option>
                                    <option value="Food">Food</option>
                                    <option value="Bills">Bills</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Car">Car</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                            <button className="w-full bg-red-500 text-white p-2 rounded-lg">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Home