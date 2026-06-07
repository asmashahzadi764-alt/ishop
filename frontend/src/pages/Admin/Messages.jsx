import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Eye } from "lucide-react";

// 🔥 IMPORTANT: Render backend URL
const API = "https://ishop-backend-a0gx.onrender.com";

const Toast = ({ message, type }) => (
  <div
    className={`fixed top-5 right-5 px-5 py-3 rounded shadow-lg text-white z-50 transition-all ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}
  >
    {message}
  </div>
);

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-lg relative">
      <button
        className="absolute top-3 right-3 text-gray-500"
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

  // ✅ FIXED FETCH (Render backend + safe array handling)
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/messages`);

      // 🔥 SAFE ARRAY FIX
      const msgArray = Array.isArray(res.data)
        ? res.data
        : res.data?.messages || [];

      const sorted = msgArray
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )
        .map((msg) => ({
          ...msg,
          newBadge: !msg.isRead,
        }));

      setMessages(sorted);
    } catch (err) {
      console.error("Fetch error:", err);
      showToast("Failed to fetch messages!", "error");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/admin/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      showToast("Message deleted!", "success");
    } catch (err) {
      showToast("Delete failed!", "error");
    }
  };

  // PREVIEW + READ
  const handlePreview = async (msg) => {
    setPreviewMessage(msg.message);

    if (!msg.isRead) {
      try {
        const { data } = await axios.patch(
          `${API}/api/admin/messages/${msg._id}/read`
        );

        setMessages((prev) =>
          prev.map((m) =>
            m._id === msg._id
              ? { ...m, isRead: data?.message?.isRead, newBadge: false }
              : m
          )
        );
      } catch (err) {
        showToast("Failed to mark as read", "error");
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
          <p className="text-center">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-center">No messages found</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-blue-100">
              <tr>
                {["#", "Name", "Email", "Phone", "Message", "Date", "Actions"].map(
                  (h) => (
                    <th key={h} className="border px-4 py-2 text-left">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {messages.map((msg, i) => (
                <tr key={msg._id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{i + 1}</td>

                  <td className="border px-4 py-2 flex gap-2">
                    {msg.name}
                    {msg.newBadge && (
                      <span className="bg-green-600 text-white text-xs px-2 rounded-full">
                        NEW
                      </span>
                    )}
                  </td>

                  <td className="border px-4 py-2">{msg.email || "—"}</td>
                  <td className="border px-4 py-2">{msg.phone || "—"}</td>

                  <td
                    className="border px-4 py-2 cursor-pointer"
                    onClick={() => handlePreview(msg)}
                  >
                    <Eye size={14} />{" "}
                    {msg.message?.slice(0, 50) || "No message"}
                  </td>

                  <td className="border px-4 py-2">
                    {new Date(msg.createdAt).toLocaleString()}
                  </td>

                  <td className="border px-4 py-2">
                    <button
                      onClick={() => setDeleteTarget(msg._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <p>Delete this message?</p>
          <button
            onClick={async () => {
              await handleDelete(deleteTarget);
              setDeleteTarget(null);
            }}
            className="bg-red-600 text-white px-4 py-2 mt-3"
          >
            Delete
          </button>
        </Modal>
      )}

      {/* Preview */}
      {previewMessage && (
        <Modal onClose={() => setPreviewMessage(null)}>
          <p>{previewMessage}</p>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </section>
  );
};

export default Messages;