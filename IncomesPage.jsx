import React, { useState, useEffect } from "react";
import axios from "axios";
import { RiMessage3Line } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Incomes() {
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        date: "",
        description: "",
    });

    const [incomes, setIncomes] = useState([]);

    // Toast Notifications
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

    const errorNotify = (message) => {
        toast.error(message, {
            position: "top-left",
            autoClose: 2000,
        });
    };

    // Fetch incomes on component mount
    useEffect(() => {
        const fetchIncomes = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/incomes");
                setIncomes(res.data.incomes || []);
            } catch (err) {
                errorNotify("Failed to fetch incomes");
            }
        };
        fetchIncomes();
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission to add income
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/incomes", formData);
            setFormData({ title: "", amount: "", date: "", description: "" });
            successNotify("Income added successfully");
            setIncomes((prev) => [...prev, res.data.income]); // Add the new income to the state
        } catch (err) {
            errorNotify("Failed to add income");
        }
    };

    // Handle deleting an income
    const handleDelete = async (incomeId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/incomes/${incomeId}`);
            if (response.data.success) {
                setIncomes((prevIncomes) => prevIncomes.filter((income) => income._id !== incomeId));
                successNotify("Income deleted successfully");
            } else {
                errorNotify(response.data.error || "Failed to delete income");
            }
        } catch (err) {
            errorNotify("An error occurred while deleting income");
        }
    };

    return (
        <>
            <div className="col-span-6 p-4 pt-0 flex flex-col gap-4" id="income">
                <h1 className="text-4xl p-4 bg-slate-600 text-orange-400 text-center rounded-lg">
                    Total Income: ₹{incomes.reduce((total, inc) => total + parseFloat(inc.amount || 0), 0)}
                </h1>
                <div className="flex gap-4">
                    <form className="flex flex-col w-1/2 gap-5 text-orange-400" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Salary Title"
                            className="border-blue-900 border-2 rounded-sm p-1 w-full focus:outline-none"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Salary Amount"
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
                            Add Income
                        </button>
                    </form>

                    {incomes.length === 0 && (
                        <div className="flex text-red-600 w-full justify-center items-center text-2xl font-semibold">
                            No Incomes Added Yet
                        </div>
                    )}

                    {incomes.length !== 0 && (
                        <div className="w-full h-[75vh] overflow-y-auto rounded-lg">
                            {incomes.map((income) => (
                                <div
                                    className="flex justify-between p-4 mb-2 bg-slate-600 text-orange-400 rounded-lg"
                                    key={income._id}
                                >
                                    <div>
                                        <div className="text-2xl">{income.title}</div>
                                        <div className="flex gap-4">
                                            <span>₹ {income.amount}</span>
                                            <span>{new Date(income.date).toLocaleDateString()}</span>
                                            {income.description && (
                                                <span className="flex gap-2">
                                                    <RiMessage3Line className="self-center" />
                                                    {income.description}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(income._id)}>
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

export default Incomes;
