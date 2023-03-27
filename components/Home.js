import { useSelector } from "react-redux";
import styles from "../styles/Home.module.css";
import Pusher from "pusher-js";
import ChatRoom from "./ChatRoom";
import UserNameModal from "./UsernameModal";
import { useState, useEffect } from "react";
const PUSHER_KEY = process.env.REACT_APP_PUSHER_KEY;
const PUSHER_CLUSTER = process.env.REACT_APP_PUSHER_CLUSTER;

export default function Home() {
  const username = useSelector((state) => state.user.value.username);
  const [messageList, setMessageList] = useState([])

  const fetchMessages = async () => {
    const response = await fetch("http://localhost:3000/messages", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.result) {
      setMessageList(
        data.messages.sort((first, sec) => {
          return new Date(sec.date) + new Date(first.date);
        })
      );
    }
  }

  useEffect(() => {
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      forceTLS: true,
    });

    fetchMessages()
    
    const channel = pusher.subscribe("chat");
    channel.bind("message", (newMessage) => {
      setChats((prev) => [...prev, newMessage]);
    });

    return () => {
      pusher.unsubscribe("chat");
    };
    
  }, []);

  console.log(messageList)

  return (
  <main className={styles.main}>
    <div style={{marginBottom : "10px"}}>
      logout
    </div>
    {!username && <UserNameModal/>}
    <ChatRoom messages={messageList}/>
  </main>);
}
