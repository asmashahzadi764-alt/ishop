import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Eye } from "lucide-react";

// Toast Component
const Toast = ({ message, type }) => (
  <div
    className={`fixed top-5 right-5 px-5 py-3 rounded shadow-lg text-white z-50 transition-all ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}
  >
    {message}
  </div>
);

// Modal Component
const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-lg relative">
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        onClick={onClose}
      >
        ✖
      </button>
      {children}
    </div>
  </div>
);

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [previewMessage, setPreviewMessage] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      // Relative path -> proxied to admin backend
      const { data } = await axios.get('/api/admin/messages');
      // Set newBadge based on backend isRead
      const sorted = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((msg) => ({ ...msg, newBadge: !msg.isRead }));
      setMessages(sorted);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch messages!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Delete message
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/messages/${id}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
      showToast("Message deleted!");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete message!", "error");
    }
  };

  // Preview & mark as read
  const handlePreview = async (msg) => {
    setPreviewMessage(msg.message);

    if (!msg.isRead) {
      try {
        const { data } = await axios.patch(
          `/api/admin/messages/${msg._id}/read`
        );

        setMessages((prev) =>
          prev.map((m) =>
            m._id === msg._id
              ? { ...m, isRead: data.message.isRead, newBadge: false }
              : m
          )
        );
      } catch (err) {
        console.error(err);
        showToast("Failed to mark message as read", "error");
      }
    }
  };

  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          💬 Customer Messages
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-600">
            No messages found from customers yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  {["#", "Name", "Email", "Phone", "Message", "Date", "Actions"].map(
                    (header) => (
                      <th
                        key={header}
                        className="border border-gray-300 px-4 py-2 text-left"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {messages.map((msg, index) => (
                  <tr
                    key={msg._id}
                    className={`hover:bg-gray-100 transition duration-200 ${
                      msg.newBadge ? "bg-green-50 font-semibold" : ""
                    }`}
                  >
                    <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2 flex items-center gap-2">
                      {msg.name}
                      {msg.newBadge && (
                        <span className="px-2 py-0.5 text-xs font-semibold text-white bg-green-600 rounded-full animate-pulse">
                          NEW
                        </span>
                      )}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-blue-600">
                      {msg.email || "—"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">{msg.phone || "—"}</td>
                    <td className="border border-gray-300 px-4 py-2 max-w-xs truncate">
                      <span
                        className="cursor-pointer hover:text-blue-600 flex items-center gap-1"
                        title={msg.message}
                        onClick={() => handlePreview(msg)}
                      >
                        <Eye size={16} />
                        {msg.message.length > 50
                          ? msg.message.slice(0, 50) + "…"
                          : msg.message}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-500">
                      {new Date(msg.createdAt).toLocaleString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex gap-2">
                      <button
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded shadow transition-all"
                        onClick={() => setDeleteTarget(msg._id)}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <p className="mb-4 text-gray-700 text-center">
            Are you sure you want to delete this message?
          </p>
          <div className="flex justify-center gap-4">
            <button
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              onClick={async () => {
                await handleDelete(deleteTarget);
                setDeleteTarget(null);
              }}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}

      {/* Preview Modal */}
      {previewMessage && (
        <Modal onClose={() => setPreviewMessage(null)}>
          <h2 className="text-lg font-semibold mb-4">Full Message</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{previewMessage}</p>
          <div className="text-right mt-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setPreviewMessage(null)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </section>
  );
};

export default Messages;
