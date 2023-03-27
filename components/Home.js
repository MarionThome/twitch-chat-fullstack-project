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
  const [messageList, setMessageList] = useState([]);
  const [userList, setUserList] = useState([])

    useEffect(() => {

      const pusher = new Pusher(PUSHER_KEY, {
        cluster: PUSHER_CLUSTER,
        forceTLS: true,
      });

      //get the list of existing messages  in db
  
      fetch("http://localhost:3000/messages", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(res => res.json()).then((data) => {
        if(data.result){
          setMessageList(
            data.messages.sort((first, sec) => {
              return new Date(sec.date) + new Date(first.date);
            })
          );
        }
      })

      // get the list of users from db

      fetch("http://localhost:3000/users/all", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(res => res.json()).then((data) => {
        if(data.result){
          setUserList(data.users)
        }
      })

      // connect to pusher and listens events

      const channel = pusher.subscribe("chat");
      channel.bind("message", (newMessage) => {
        setMessageList((prev) => [...prev, newMessage]);
      })
  
      return () => {
        pusher.unsubscribe("chat");
      };
    }, []);



  return (
    <main className={styles.main}>
      <div style={{ marginBottom: "10px" }}>logout</div>
      {!username && <UserNameModal />}
      <ChatRoom messages={messageList} users={userList}/>
    </main>
  );
}
