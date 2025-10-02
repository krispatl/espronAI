import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I’m the Espronceda Grant Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages })
    });

    const data = await res.json();
    if (data.reply) {
      setMessages([...newMessages, data.reply]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      <header className="p-4 text-center text-xl font-bold border-b border-gray-800">
        Espronceda Grant Assistant
      </header>
      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={\`p-3 rounded-lg max-w-3xl \${m.role === "user" ? "bg-blue-600 self-end text-white" : "bg-gray-800 self-start"}\`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="text-gray-400">Typing…</div>}
      </main>
      <footer className="p-4 border-t border-gray-800 flex space-x-2">
        <input
          className="flex-1 p-2 rounded bg-gray-900 border border-gray-700 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask me to draft a Horizon Europe proposal..."
        />
        <button
          className="bg-blue-600 px-4 py-2 rounded text-white font-semibold hover:bg-blue-500"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </footer>
    </div>
  );
}