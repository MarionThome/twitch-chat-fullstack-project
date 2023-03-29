import styles from "../styles/ChatRoom.module.css";
import Message from "./Message";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";

export default function ChatRoom(props) {
  const messages = props.messages;
  const username = useSelector((state) => state.user.value.username);
  const [newMessage, setNewMessage] = useState("");
  const lastMessage = useRef(null);

  const scrollToBottom = () => {
    lastMessage.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage) {
      const payload = {
        username: username,
        message: newMessage,
      };
      fetch(`http://localhost:3000/send-message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setNewMessage("");
      scrollToBottom();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      sendMessage();
    }
  };

  const messagesToDisplay = messages.map((message, index) => {
    // assign color to users
    const userTalking = props.users.find(
      (user) => message.author === user.username
    );
    const textColor = (userTalking && userTalking.color) || "#aea9b7";

    if (message.author === username) {
      return (
        <div
          key={index}
          className={styles.message}
          style={{ alignItems: "flex-end" }}
        >
          <Message {...message} color={textColor} isAuthor={true} />
        </div>
      );
    } else {
      return (
        <div
          key={index}
          className={styles.message}
          style={{ alignItems: "flex-start" }}
        >
          <Message {...message} color={textColor} />
        </div>
      );
    }
  });

  return (
    <div className={styles.chatRoomMain}>
      <div>
        <div className={styles.messagesContainer}>
          {messages.length > 0 && messagesToDisplay}
          <div ref={lastMessage}></div>
        </div>
        <div className={styles.chatRoomInputContainer}>
          <textarea
            placeholder="your message"
            className={styles.chatRoomInput}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            value={newMessage}
          />
          <button
            onClick={sendMessage}
            disabled={newMessage !== "" ? false : true}
            style={{
              cursor: newMessage === "" ? "not-allowed" : "pointer",
              backgroundColor:
                newMessage === ""
                  ? "rgb(111, 42, 72, 0.6)"
                  : "rgb(111, 42, 72, 1)",
            }}
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
}
