"use client";
import { useRef, useState } from "react";
import Image from "next/image";

import { marked } from "marked";
import parse from "html-react-parser";

export default function Home() {
  const messageRef = useRef();

  const [messages, setMessages] = useState([]);
  const [displayMessage, setDisplayMessage] = useState("Hi there!");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prompt = messageRef.current.value;

    setLoading(true);

    let newMessageList = [
      ...messages,
      {
        role: "user",
        content: prompt,
      },
    ];

    try {
      const response = await fetch("/api/bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessageList }),
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      newMessageList.push({
        role: data.response.message.role,
        content: data.response.message.content,
      });

      setMessages(newMessageList);
      setDisplayMessage(data.response.message.content);
      messageRef.current.value = "";
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto max-w-4xl">
      <div className="grid grid-cols-2">
        <div
          className={`bg-blue-400 relative py-4 px-4 flex flex-col justify-center ${
            loading ? "animate-pulse" : ""
          }`}
        >
          <div className="absolute h-[15px] w-[15px] bg-blue-400 -right-[7px] top-[50%] rotate-45"></div>
          <h3 className="text-2xl text-white bold">Botty Says:</h3>
          <p className="text-white">
            {loading ? "[Botty is thinking]" : parse(marked(displayMessage))}
          </p>
        </div>

        <div>
          <Image alt="Botty" src="/bot.png" width={512} height={512} />
        </div>
      </div>

      <form className="mt-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <label className="font-bold">Say something..</label>
          <input
            className="px-4 py-2 text-gray-700 placeholder-gray-500 bg-white border border-gray-700 rounded-lg"
            required
            type="text"
            ref={messageRef}
            placeholder="Ask a question or say something nice."
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 mt-2 text-gray-700 bg-gray-100 border border-gray-700 rounded-lg hover:scale-110 transition-all duration-200"
        >
          Send 🚀
        </button>
      </form>

      <div className="mt-6">
        {messages.map((message) => {
          return (
            <div key={message.content} className="flex items-center gap-4 py-2">
              <div className="w-[10%] flex items-center">
                {message.role === "assistant" ? (
                  <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                    <img
                      src="/bot.png"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-xl font-bold">You:</div>
                )}
              </div>

              <div className="bg-gray-100 py-2 px-4 border border-gray-400 rounded-xl">
                {message.content}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
