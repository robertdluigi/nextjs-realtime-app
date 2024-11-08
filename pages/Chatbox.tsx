import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io(); // Automatically connects to the server on the same origin

const ChatBox = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("chat message", (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Clean up the listener when the component is unmounted
    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chat message", message); // Send message to the server
      setMessage("");
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatBox;
