import { Link, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const InvoiceReceipt = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  console.log(transaction);

  useEffect(() => {
    fetch(`http://localhost:3000/wallet/transaction/${transactionId}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    })
      .then((res) => res.json())
      .then((data) => setTransaction(data))
      .catch((error) => console.error("Error fetching transaction:", error));
  }, [transactionId]);

  if (!transaction)
    return <p className="text-center text-gray-400 mt-20">Loading...</p>;

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Transaction Heading
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Transaction Invoice", 14, 15);
    doc.setFontSize(12);
    doc.text(`Invoice ID: ${transaction._id}`, 14, 25);

    // Sender & Receiver Details (Avatars + Names)
    const senderImage = transaction.wallet.user.image || "";
    const recipientImage = transaction.recipientWallet?.user?.image || "";

    const senderName = transaction.wallet.user.name  || "";
    const recipientName = transaction.recipientWallet?.user?.name || "N/A";

    // Draw avatars if available
    if (senderImage) {
      doc.addImage(senderImage, "JPEG", 14, 35, 20, 20); // Sender Image
    }
    doc.text("Sender:", 40, 42);
    doc.setFont("helvetica", "bold");
    doc.text(senderName, 55, 42);

    if (recipientImage) {
      doc.addImage(recipientImage, "JPEG", 14, 60, 20, 20); // Receiver Image
    }
    doc.setFont("helvetica", "normal");
    doc.text("Recipient:", 40, 67);
    doc.setFont("helvetica", "bold");
    doc.text(recipientName, 65, 67);

    // Table for transaction details
    doc.autoTable({
      startY: 80,
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] }, // Header Background
      styles: { fontSize: 11 },
      head: [["Field", "Details"]],
      body: [
        ["Transaction ID", transaction._id],
        ["Amount", `$${transaction.amount}`],
        ["Type", transaction.type],
        ["Status", transaction.status],
        ["Date", new Date(transaction.createdAt).toLocaleString()],
      ],
    });

    // Footer with website URL
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      "For more details, visit: www.savgo.com",
      14,
      doc.internal.pageSize.height - 10
    );

    // Save PDF
    doc.save(`invoice_${transaction._id}.pdf`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 to-gray-800">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg shadow-2xl rounded-xl p-8 text-white">
        <Link to={"/wallet"}>
          <i class="ri-arrow-left-line text-3xl"></i>
        </Link>
        <h2 className="text-3xl font-bold text-center mb-6">
          Transaction Invoice
        </h2>

        {/* 📅 Date (Sabse Upar) */}
        <p className="text-center text-lg text-gray-300 font-semibold mb-4">
          {new Date(transaction.createdAt).toLocaleString()}
        </p>

        {/* 🖼️ Sender & Receiver Avatars */}
        <div className="flex items-center justify-center space-x-6 bg-white/20 p-4 rounded-lg">
          {/* Sender */}
          <div className="flex flex-col items-center">
            <img
              src={transaction.wallet.user.image}
              alt={transaction.wallet.user.name}
              className="w-16 h-16 rounded-full border-2 border-blue-400"
            />
            <p className="text-sm font-semibold mt-2">
              {transaction.wallet.user.name}
            </p>
            <p className="text-xs text-gray-300">Sender</p>
          </div>

          {/* Arrow */}
          {transaction.recipientWallet && (
            <div className="text-3xl text-gray-400">
              <i class="ri-arrow-left-right-line"></i>
            </div>
          )}

          {/* Receiver */}
          {transaction.recipientWallet && (
            <div className="flex flex-col items-center">
              <img
                src={transaction.recipientWallet.user.image}
                alt={transaction.recipientWallet.user.name}
                className="w-16 h-16 rounded-full border-2 border-green-400"
              />
              <p className="text-sm font-semibold mt-2">
                {transaction.recipientWallet.user.name}
              </p>
              <p className="text-xs text-gray-300">Receiver</p>
            </div>
          )}
        </div>

        {/* 🧾 Transaction Details */}
        <div className="mt-6 p-4 bg-white/20 rounded-lg">
          <p className="flex justify-between py-2 border-b border-gray-400">
            <span className="font-semibold">Transaction ID:</span>{" "}
            {transaction._id}
          </p>
          <p className="flex justify-between py-2 border-b border-gray-400">
            <span className="font-semibold">Type:</span> {transaction.type}
          </p>
          <p className="flex justify-between py-2 border-b border-gray-400">
            <span className="font-semibold">Status:</span> {transaction.status}
          </p>
        </div>

        {/* 💰 Total Amount (Sabse Bara Size) */}
        <div className="mt-6 p-4 bg-white/20 rounded-lg text-center">
          <p className="text-2xl font-bold text-white">Total:</p>
          <p
            className={` text-4xl font-extrabold  ${
              transaction.type === "withdraw" ? "text-red-400" : "text-white"
            } `}
          >
            {transaction.type === "withdraw"
              ? `-$${transaction.amount}.00`
              : `$${transaction.amount}.00`}
          </p>
        </div>

        {/* 📥 Download Invoice Button */}
        <button
          onClick={downloadPDF}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md transition"
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoiceReceipt;
