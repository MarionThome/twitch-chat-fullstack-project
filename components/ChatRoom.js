import styles from "../styles/ChatRoom.module.css";
import Message from "./Message";
import { useSelector } from "react-redux";
import { useState } from "react";
import moment from "moment";
import axios from "axios"

export default function ChatRoom(props) {
  const messages = props.messages;
  const username = useSelector((state) => state.user.value.username);
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      const payload = {
        username: username,
        message: newMessage,
      };
      axios.post("http://localhost:3000/send-message", payload);
      setNewMessage("");
    }
  }
  
  const messagesToDisplay = messages.map((message, index) => {
    // is supposed to get the proper color and assign it to the right user -> NEED OPTIM
    const userTalking = props.users.find(user => message.author === user.username)
    const textColor = userTalking && userTalking.color || "black"
    
    console.log(props.users.find(user => message.author === user.username))
    if (message.author === username) {
      return (
        <div key={index}>
          <p style={{color : textColor}}>{message.author}</p>
          <p>{message.message}</p>
          <p>{moment(message.date).calendar()}</p>
        </div>
      );
    } else {
      return (
        <div key={index}>
          <p style={{color : textColor}}>{message.author}</p>
          <div>
            <p>{message.message}</p>
          </div>
          <div>
            <p>{moment(message.date).calendar()}</p>
          </div>
        </div>
      );
    }
  });
  return (
    <div style={{ backgroundColor: "white" }}>
      <div>{messages.length > 0 && messagesToDisplay}</div>
      <textarea onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleSubmit} value={newMessage}/>
    </div>
  );
}
