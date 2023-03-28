import { useSelector, useDispatch } from "react-redux";
import { resetUsername } from "../reducers/user";
import styles from "../styles/Home.module.css";
import Pusher from "pusher-js";
import ChatRoom from "./ChatRoom";
import UserNameModal from "./UsernameModal";
import { useState, useEffect } from "react";
const PUSHER_KEY = process.env.REACT_APP_PUSHER_KEY;
const PUSHER_CLUSTER = process.env.REACT_APP_PUSHER_CLUSTER;

export default function Home() {
  const username = useSelector((state) => state.user.value.username);
  const [welcome, setWelcome] = useState("") 
  const [messageList, setMessageList] = useState([]);
  const [userList, setUserList] = useState([])
  const dispatch = useDispatch()

    const welcomeMessage = (bool, name) => {
      if(!bool){
        setWelcome(`Welcome back ${name} !`)
      }else {
        setWelcome(`Welcome ${name}, to start chating, write your message and press enter`)
      }

    }

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

      // connect to pusher (channel chat) and listens events (message)

      const channel = pusher.subscribe("chat");
      channel.bind("message", (newMessage) => {
        setMessageList((prev) => [...prev, newMessage]);
      })
  
      // will disconect from pusher when component is unmounted 
      return () => {
        pusher.unsubscribe("chat");
      };
    }, []);



  return (
    <main className={styles.main}>
      <div className={styles.content}>
      <div>{welcome}</div>
      <div style={{ marginBottom: "10px" }} onClick={() => dispatch(resetUsername())}>logout</div>
      {!username && <UserNameModal welcomeMessage={welcomeMessage}/>}
      <ChatRoom messages={messageList} users={userList}/>
      </div>
    </main>
  );
}
