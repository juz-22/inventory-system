import {
  FaSearch,
  FaMicrophone,
  FaTerminal,
  FaRobot,
  FaUser,
  FaDownload,
  FaStop,
  FaTrash,
} from "react-icons/fa";

import CommandResponse from "../copilot/CommandResponse";

import useBusinessCopilot from "../../hooks/useBusinessCopilot";

function CommandCenter() {
  const {
    command,
    setCommand,

    messages,

    loading,

    submitCommand,

    startVoiceRecognition,

    getSuggestions,
    clearConversation,
    stopSpeaking,
    exportConversation,
  } = useBusinessCopilot();

  const suggestions = getSuggestions(command);

  const downloadConversation = () => {
    const blob = new Blob([exportConversation()], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "inventorysys-conversation.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const quickCommands = [
    "dashboard",
    "products",
    "today sales",
    "today revenue",
    "inventory value",
    "business health",
    "low stock",
    "sales history",
  ];

  return (
    <div
      id="business-copilot"
      className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6"
    >

      {/* ===============================
          Header
      =============================== */}

      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-3">

          <div className="bg-cyan-500/10 p-3 rounded-xl">

            <FaTerminal
              className="text-cyan-400"
              size={22}
            />

          </div>

          <div>

            <h2 className="text-2xl font-bold text-white">
              Business Command Center
            </h2>

            <p className="text-slate-400 text-sm">
              Your AI Business Copilot
            </p>

          </div>

        </div>

        {/* AI Status */}

        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full">

          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

          <span className="text-green-400 text-sm font-medium">
            Online
          </span>

        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <p className="text-xs text-slate-500">
            Ask about sales, stock, revenue, or business health.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={stopSpeaking}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition"
            >
              <FaStop /> Stop voice
            </button>
            <button
              type="button"
              onClick={downloadConversation}
              disabled={messages.length === 0}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs text-slate-300 transition"
            >
              <FaDownload /> Export
            </button>
            <button
              type="button"
              onClick={clearConversation}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-xs text-slate-300 hover:text-red-300 transition"
            >
              <FaTrash /> Clear
            </button>
          </div>
        </div>

      </div>

      {/* ===============================
          Command Input
      =============================== */}

      <div className="flex gap-3 mb-6">

        <div className="relative flex-1">

          <FaSearch
            className="absolute left-4 top-4 text-slate-500"
          />

          <input
            value={command}
            onChange={(e) =>
              setCommand(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitCommand();
              }
            }}
            placeholder="Ask anything about your business..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-cyan-500 transition"
          />

        </div>

        <button
          onClick={startVoiceRecognition}
          aria-label="Start voice assistant"
          className="bg-pink-500 hover:bg-pink-400 transition px-5 rounded-xl flex items-center justify-center"
        >
          <FaMicrophone size={20} />
        </button>

        <button
          disabled={loading}
          onClick={() => submitCommand()}
          aria-label="Execute command"
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Thinking..." : "Execute"}
        </button>

      </div>

      {/* ===============================
          Smart Suggestions
      =============================== */}

      {command.trim().length > 0 && suggestions.length > 0 && (

        <div className="mb-6">

          <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3">
            Suggestions
          </h4>

          <div className="flex flex-wrap gap-2">

            {suggestions.map((item) => (

              <button
                key={item}
                onClick={() => setCommand(item)}
                className="px-4 py-2 rounded-full bg-slate-800 hover:bg-cyan-500 hover:text-black transition text-sm"
              >
                {item}
              </button>

            ))}

          </div>

        </div>

      )}

      {/* ===============================
          Quick Commands
      =============================== */}

      <div className="mb-8">

        <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3">
          Quick Commands
        </h4>

        <div className="flex flex-wrap gap-3">

          {quickCommands.map((item) => (

            <button
              key={item}
              onClick={() => setCommand(item)}
              className="bg-slate-800 hover:bg-cyan-500 hover:text-black transition px-4 py-2 rounded-full text-sm"
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* ===============================
          Conversation
      =============================== */}

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">

        <div className="flex items-center gap-3 mb-6">

          <FaRobot
            className="text-cyan-400"
            size={22}
          />

          <div>

            <h3 className="font-bold text-cyan-400">
              AI Business Copilot
            </h3>

            <p className="text-xs text-slate-500">
              Conversation
            </p>

          </div>

        </div>

        <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">

          {messages.map((message, index) => (

            <div
              key={`${message.sender}-${message.createdAt ?? index}`}
              className={`flex gap-3 ${
                message.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              {message.sender === "ai" && (

                <div className="mt-1">

                  <FaRobot className="text-cyan-400" />

                </div>

              )}

              <div
                className={`rounded-2xl px-5 py-4 max-w-[80%] shadow ${
                  message.sender === "user"
                    ? "bg-cyan-500 text-black"
                    : "bg-slate-800 text-slate-100"
                }`}
              >

                <p className={`text-[10px] mb-1 ${
                  message.sender === "user"
                    ? "text-black/60"
                    : "text-slate-500"
                }`}>
                  {message.sender === "user" ? "You" : "Copilot"}
                  {" · "}
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                {message.title && (

                  <h4 className="font-bold mb-2 text-cyan-400">
                    {message.title}
                  </h4>

                )}

                <CommandResponse
                  message={message}
                />

              </div>

              {message.sender === "user" && (

                <div className="mt-1">

                  <FaUser className="text-cyan-400" />

                </div>

              )}

            </div>

          ))}

        </div>

      </div>

      {/* ===============================
          Footer
      =============================== */}

      <div className="mt-6 border-t border-slate-800 pt-5">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <div>

            <p className="text-sm text-slate-400">
              InventorySys AI Business Copilot
            </p>

            <p className="text-xs text-slate-600 mt-1">
              Type a command, press <span className="text-cyan-400">Enter</span>,
              or use the microphone.
            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-full">

              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

              <span className="text-xs text-green-400">
                Business Engine Connected
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CommandCenter;