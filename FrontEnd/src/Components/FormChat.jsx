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
import { format, startOfWeek } from "date-fns";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const processFinanceData = (transactions) => {
  const weeklyData = {};

  transactions.forEach((transaction) => {
    const week = format(startOfWeek(new Date(transaction.createdAt)), "MMM dd"); // Example: "Feb 05"

    if (!weeklyData[week]) {
      weeklyData[week] = { deposit: 0, withdraw: 0, transfer: 0 };
    }

    if (transaction.type === "deposit") {
      weeklyData[week].deposit += transaction.amount;
    } else if (transaction.type === "withdraw") {
      weeklyData[week].withdraw += transaction.amount;
    } else if (transaction.type === "transfer") {
      weeklyData[week].transfer += transaction.amount;
    }
  });

  const labels = Object.keys(weeklyData);
  const depositData = labels.map((week) => weeklyData[week].deposit);
  const withdrawData = labels.map((week) => weeklyData[week].withdraw);
  const transferData = labels.map((week) => weeklyData[week].transfer);

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
  const financeData = processFinanceData(transactions);

  return (
    <div className="bg-gray-900 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-700">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-center sm:text-left">
        Weekly Finance Overview
      </h3>
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
