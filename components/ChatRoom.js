import styles from "../styles/ChatRoom.module.css";
import Message from "./Message";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import moment from "moment";
import axios from "axios";

export default function ChatRoom(props) {
  const messages = props.messages;
  const username = useSelector((state) => state.user.value.username);
  const [newMessage, setNewMessage] = useState("");
  const lastMessage = useRef(null);

  console.log(messages)

  const scrollToBottom = () => {
    lastMessage.current.scrollIntoView({ behavior: "smooth" });
  };

    useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      const payload = {
        username: username,
        message: newMessage,
      };
      axios.post("http://localhost:3000/send-message", payload);
      setNewMessage("");
      scrollToBottom();
    }
  };

  const messagesToDisplay = messages.map((message, index) => {
    // assign color to users
    const userTalking = props.users.find(
      (user) => message.author === user.username
    );
    const textColor = (userTalking && userTalking.color) || "black";

    console.log(props.users.find((user) => message.author === user.username));
    if (message.author === username) {
      return (
        <div key={index} className={styles.message} style={{ alignItems: "flex-end" }}>
          <Message {...message} color={textColor} isAuthor={true}/>
        </div>
      );
    } else {
      return (
        <div key={index} className={styles.message} style={{ alignItems: "flex-start" }}>
         <Message {...message} color={textColor}/>
        </div>
      );
    }
  });
  return (
    <div
      className={styles.chatRoomMain}
    >
      <div> 
      <div className={styles.messagesContainer}>
        {messages.length > 0 && messagesToDisplay}
        <div ref={lastMessage}></div>
      </div>
      <div className={styles.chatRoomInputContainer}>
        <textarea
          className={styles.chatRoomInput}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleSubmit}
          value={newMessage}
        />
      </div>

      </div>
    </div>
  );
}
