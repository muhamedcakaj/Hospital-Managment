import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
const AddCash = () => {
    const [userName, setUserName] = useState("");
    const [balancData, setBalancData] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        prupose: "",
        sum: "",
        transaction_date: "",
    });

    //When submit adding the addCash as an transaction logic START
    const addingTransaction = async (prupose, sum, transaction_date) => {
        const userUsername = userName;
        const category = "Cash"
        try {
            const response = await fetch("http://localhost:8083/v1/transactions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify({ userUsername, prupose, category, sum, transaction_date }),
            });
            if (response.status === 401) {
                // Token is expired or unauthorized
                alert("Session expired. Please log in again.");
                sessionStorage.removeItem("token"); // Clear the token
                navigate('/'); // Redirect to login page
            }
        } catch (error) {
            console.error("Error", error);
        }
    }
    //When submit adding the addCash as an transaction logic END

    // Fetching the balance from the database logic START
    const handleBalanc = async () => {
        try {
            const response = await fetch(`http://localhost:8083/v1/bilanc/username/${userName}`, {
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
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
            setBalancData(balancData);
        } catch (error) {
            console.error("Error fetching balance data", error);
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
            handleBalanc();
        }
    }, [userName]);
    // Fetching the balance from the database logic END

    // Handle form input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    // Form validation
    const isFormValid = formData.prupose && formData.sum && formData.transaction_date;

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        const sum = {
            bilanci: "+ " + formData.sum, // The key should match the expected key in your backend
        };

        try {
            const response = await fetch(`http://localhost:8083/v1/bilanc/${userName}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(sum),
            });

            if (response.ok) {

                const updatedUser = await response.text(); // Parse response if needed
                console.log("Response from server:", updatedUser);
                alert("Sum added successfully!");
                handleBalanc(); // Refresh the balance after successful submission
                addingTransaction(formData.prupose, formData.sum, formData.transaction_date);//add a transaction
                setFormData({ prupose: "", sum: "", transaction_date: "" }); // Clear the form

            } else if (response.status === 401) {

                // Token is expired or unauthorized
                alert("Session expired. Please log in again.");
                sessionStorage.removeItem("token"); // Clear the token
                navigate('/'); // Redirect to login page

            }
        } catch (error) {

            console.error("Error submitting data:", error);
            alert("An error occurred while submitting the form.");
        }
    };
    return (
        <>
            <div className="w-full md:w-3/4 flex flex-col justify-center items-center p-8">
                <div className="bg-white w-full max-w-md p-6 rounded shadow-lg">
                    <h2 className="text-lg font-bold mb-4 text-center text-green-600">Add Cash</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Source */}
                        <div className="mb-4">
                            <label htmlFor="prupose" className="block text-gray-700 font-medium mb-2">
                                Source
                            </label>
                            <input
                                type="text"
                                id="prupose"
                                value={formData.prupose}
                                onChange={handleInputChange}
                                placeholder="Salary for July"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        {/* Sum */}
                        <div className="mb-4">
                            <label htmlFor="sum" className="block text-gray-700 font-medium mb-2">
                                Sum
                            </label>
                            <input
                                type="text"
                                id="sum"
                                value={formData.sum}
                                onChange={handleInputChange}
                                placeholder="Amount"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        {/* Date */}
                        <div className="mb-4">
                            <label htmlFor="transaction_date" className="block text-gray-700 font-medium mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                id="transaction_date"
                                value={formData.transaction_date}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className={`w-full py-2 rounded-md transition duration-300 ${isFormValid ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-400 text-gray-700 cursor-not-allowed"
                                }`}
                            disabled={!isFormValid}
                        >
                            Submit
                        </button>
                    </form>
                </div>

                {/* Balance Section */}
                {balancData ? (
                    <div className="mt-6 bg-green-600 text-white px-6 py-4 rounded shadow-lg text-center">
                        <h3 className="text-sm">Balance</h3>
                        <p className="text-xl font-bold">EUR {balancData.bilanci}</p>
                    </div>
                ) : (
                    <div className="mt-6 text-gray-700">Loading balance...</div>
                )}
            </div>
        </>
    );
};

export default AddCash;