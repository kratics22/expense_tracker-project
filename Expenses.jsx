import React, { useState, useEffect } from "react";
import axios from "axios";
import { RiMessage3Line } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Expenses() {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    date: "",
    description: "",
  });

  const [expenses, setExpenses] = useState([]);

  // Success notification
  const successNotify = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: "bg-emerald-300 text-white shadow-md rounded-lg",
      progressClassName: "bg-green-700",
    });
  };

  // Error notification
  const errorNotify = (message) => {
    toast.error(message, {
      position: "top-left",
      autoClose: 2000,
    });
  };

  // Fetch expenses on component mount
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/expenses");
        setExpenses(res.data.expenses || []);
      } catch (err) {
        errorNotify("Failed to fetch expenses");
      }
    };
    fetchExpenses();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission to add expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/expenses", formData);
      setFormData({ title: "", amount: "", date: "", description: "" });
      successNotify("Expense added successfully");
      setExpenses((prev) => [...prev, res.data.expense]); // Add the new expense to the state
    } catch (err) {
      errorNotify("Failed to add expense");
    }
  };

  // Handle deleting an expense
  const handleDelete = async (expenseId) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${expenseId}`);
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense._id !== expenseId));
      successNotify("Expense deleted successfully");
    } catch (err) {
      errorNotify("Failed to delete expense");
    }
  };

  return (
    <>
      <div className="col-span-6 p-4 pt-0 flex flex-col gap-4" id="expense">
        <h1 className="text-4xl p-4 bg-slate-600 text-orange-400 text-center rounded-lg">
          Total Expenses: ₹
          {expenses.reduce((total, exp) => total + parseFloat(exp.amount || 0), 0)}
        </h1>
        <div className="flex gap-4">
          {/* Form to add expense */}
          <form className="flex flex-col w-1/2 gap-5 text-orange-400" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Expense Title"
              className="border-blue-900 border-2 rounded-sm p-1 w-full focus:outline-none"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              placeholder="Expense Amount"
              className="border-blue-900 border-2 rounded-sm p-1 w-full focus:outline-none"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
            <input
              type="date"
              placeholder="Enter A Date"
              className="border-blue-900 border-2 rounded-sm p-1 w-full focus:outline-none"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <textarea
              placeholder="Add a Reference"
              className="border-blue-900 border-2 rounded-sm p-1 w-full focus:outline-none"
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            <button
              className="text-lg font-semibold bg-purple-500 rounded-xl w-3/5 py-1 
                            hover:shadow-emerald-500 shadow-md text-black"
              type="submit"
            >
              Add Expense
            </button>
          </form>

          {/* Display expenses */}
          {expenses.length === 0 ? (
            <div className="flex text-red-600 w-full justify-center items-center text-2xl font-semibold">
              No Expenses Added Yet
            </div>
          ) : (
            <div className="w-full h-[75vh] overflow-y-auto rounded-lg">
              {expenses.map((expense) => (
                <div
                  className="flex justify-between p-4 mb-2 bg-slate-600 text-orange-400 rounded-lg"
                  key={expense._id}
                >
                  <div>
                    <div className="text-2xl">{expense.title}</div>
                    <div className="flex gap-4">
                      <span>₹ {expense.amount}</span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                      {expense.description && (
                        <span className="flex gap-2">
                          <RiMessage3Line className="self-center" />
                          {expense.description}
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(expense._id)}>
                    <MdDelete className="text-3xl self-center hover:shadow-emerald-500 shadow-md rounded-full" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default Expenses;
