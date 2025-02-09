import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { format, startOfWeek, startOfMonth } from "date-fns";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const processFinanceData = (transactions, mode) => {
  const financeData = {};

  transactions.forEach((transaction) => {
    let key;

    if (mode === "weekly") {
      key = format(startOfWeek(new Date(transaction.createdAt)), "MMM dd"); // Example: "Feb 05"
    } else {
      key = format(startOfMonth(new Date(transaction.createdAt)), "MMM yyyy"); // Example: "Feb 2025"
    }

    if (!financeData[key]) {
      financeData[key] = { deposit: 0, withdraw: 0, transfer: 0 };
    }

    financeData[key][transaction.type] += transaction.amount;
  });

  const labels = Object.keys(financeData);
  const depositData = labels.map((key) => financeData[key].deposit);
  const withdrawData = labels.map((key) => financeData[key].withdraw);
  const transferData = labels.map((key) => financeData[key].transfer);

  return {
    labels,
    datasets: [
      {
        label: "Deposits",
        data: depositData,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderWidth: 2,
      },
      {
        label: "Withdrawals",
        data: withdrawData,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        borderWidth: 2,
      },
      {
        label: "Transfers",
        data: transferData,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        borderWidth: 2,
      },
    ],
  };
};

const WeeklyFinanceReport = ({ transactions }) => {
  const [mode, setMode] = useState("weekly"); // Default Weekly
  const financeData = processFinanceData(transactions, mode);

  return (
    <div className="bg-gray-900 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg sm:text-xl font-bold">Finance Overview ({mode})</h3>
        
        {/* Toggle Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode("weekly")}
            className={`px-4 py-1 rounded-lg ${
              mode === "weekly" ? "bg-yellow-500 text-white" : "bg-gray-700 text-gray-400"
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setMode("monthly")}
            className={`px-4 py-1 rounded-lg ${
              mode === "monthly" ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-400"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="w-[300px] sm:w-[500px] md:w-[700px] lg:w-full">
          <Line
            data={financeData}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              scales: {
                x: {
                  ticks: {
                    color: "#999999",
                  },
                  grid: {
                    color: "rgba(255,255,255,0.2)",
                  },
                },
                y: {
                  ticks: {
                    color: "#999999",
                  },
                  grid: {
                    color: "rgba(255,255,255,0.2)",
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    color: "#999999",
                  },
                },
              },
            }}
            height={250}
          />
        </div>
      </div>
    </div>
  );
};

export default WeeklyFinanceReport;
