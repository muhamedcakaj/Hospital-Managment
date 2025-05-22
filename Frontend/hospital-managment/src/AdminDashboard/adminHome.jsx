import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [monthlyCounts, setMonthlyCounts] = useState([]);
  const [biggestBalanc, setBiggestBalace] = useState([]);
  const [lowestBalanc, setLowestBalace] = useState([]);
  const [biggestTransactionsUserMaker, setBiggestTransactionsUserMaker] = useState([]);
  const [fewestTransactionsUserMaker, setfewestTransactionsUserMaker] = useState([]);
  const [theMostUsedCategoryInTransactions, setTheMostUsedCategoryInTransactions] = useState([]);
  const [totalNumberOfTransactions, setTotalNumberOfTransactions] = useState([]);
  const [totalUserNumber, setTotalUserNumber] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8083/v1/transactions/monthlyCounts");
        const data = await response.json();
        setMonthlyCounts(data); // Set the fetched data to state

        const biggestBalance = await fetch("http://localhost:8083/v1/bilanc/top");
        const biggestBalancedata = await biggestBalance.json();
        setBiggestBalace(biggestBalancedata[0]);

        const lowestBalance = await fetch("http://localhost:8083/v1/bilanc/lowest");
        const lowestBalancData = await lowestBalance.json();
        setLowestBalace(lowestBalancData[0]);

        const biggestTransactionsUserMaker = await fetch("http://localhost:8083/v1/transactions/findUserWhoMakesMostTransactions");
        const biggestTransactionsUserMakerData = await biggestTransactionsUserMaker.json();
        setBiggestTransactionsUserMaker(biggestTransactionsUserMakerData[0]);

        const fewestTransactionsUserMaker = await fetch("http://localhost:8083/v1/transactions/findUserWhoMadeFewestTransactions");
        const fewestTransactionsUserMakerData = await fewestTransactionsUserMaker.json();
        setfewestTransactionsUserMaker(fewestTransactionsUserMakerData[0]);

        const theMostUsedCategoryInTransactions = await fetch("http://localhost:8083/v1/transactions/theMostUsedCategoryInTransactions")
        const theMostUsedCategoryInTransactionsData = await theMostUsedCategoryInTransactions.json();
        setTheMostUsedCategoryInTransactions(theMostUsedCategoryInTransactionsData[0]);

        const totalNumberOfTransactions = await fetch("http://localhost:8083/v1/transactions/totalNumberOfTransactions")
        const totalNumberOfTransactionsData = await totalNumberOfTransactions.json();
        setTotalNumberOfTransactions(totalNumberOfTransactionsData[0]);

        const totalUserNumber = await fetch("http://localhost:8083/v1/user/totalUserNumber")
        const totalUserNumberData = await totalUserNumber.json();
        setTotalUserNumber(totalUserNumberData);

        const allTransactions = await fetch("http://localhost:8083/v1/transactions/AllTransactions")
        const allTransactionsData = await allTransactions.json();
        setAllTransactions(allTransactionsData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 bg-gradient-to-r from-darkblue to-darkblack text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Monthly Transactions</h2>
          </div>
          <div className="relative">
            <div className="h-60 flex items-end gap-4">
              {monthlyCounts.map((value, index) => (
                <div
                  key={index}
                  className="bg-indigo-500 w-8 rounded-t-md hover:bg-indigo-400 transition"
                  style={{ height: `${value * 10}%` }}
                ></div>
              ))}
            </div>
            <div className="flex justify-around mt-4 text-sm font-medium text-gray-600">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                <span key={index}>{month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Yearly and Monthly Stats */}
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Total Users</h3>
            <p className="text-3xl font-bold text-indigo-600">{totalUserNumber[0] - 1}</p>
            <span className="text-sm text-green-500">Active</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500">Total Transactions</h3>
            <p className="text-3xl font-bold text-indigo-600">{totalNumberOfTransactions[0]}</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Info */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Insights</h3>
          <div className="space-y-4">
            <ul className="space-y-3">
              <li
                className="flex justify-between items-center text-sm text-gray-600 border-b pb-2"
              >
                <span>The user who made the most transactions : {biggestTransactionsUserMaker[0]}</span>
                <span className="text-gray-500 text-xs">{biggestTransactionsUserMaker[1]} transactions</span>
              </li>
              <li
                className="flex justify-between items-center text-sm text-gray-600 border-b pb-2"
              >
                <span>The user who made the fewest transactions : {fewestTransactionsUserMaker[0]}</span>
                <span className="text-gray-500 text-xs">{fewestTransactionsUserMaker[1]} transactions</span>
              </li>
              <li
                className="flex justify-between items-center text-sm text-gray-600 border-b pb-2"
              >
                <span>The most used category in transactions : {theMostUsedCategoryInTransactions[0]}</span>
                <span className="text-gray-500 text-xs">{theMostUsedCategoryInTransactions[1]} transactions</span>
              </li>
              <li
                className="flex justify-between items-center text-sm text-gray-600 border-b pb-2"
              >
                <span>The user with the biggest balance : {biggestBalanc[0]}</span>
                <span className="text-gray-500 text-xs">{biggestBalanc[1]} €</span>
              </li>
              <li
                className="flex justify-between items-center text-sm text-gray-600 border-b pb-2"
              >
                <span>The user with the lowest balance : {lowestBalanc[0]}</span>
                <span className="text-gray-500 text-xs">{lowestBalanc[1]} €</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="overflow-y-auto max-h-60">
            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="py-2">User</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {allTransactions.length > 0 ? (
                  allTransactions.map((transaction, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 font-medium">{transaction.userUsername}</td>
                      <td className="py-2">{transaction.category}</td>
                      <td className="py-2">{transaction.sum} €</td>
                      <td className="py-2">{transaction.transaction_date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;