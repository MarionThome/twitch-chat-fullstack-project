import { useState } from "react";
import styles from "../styles/UserNameModal.module.css";
import { useDispatch } from "react-redux";
import { addUsername } from "../reducers/user";

export default function UserNameModal(props) {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch()

  const fetchUser = async () => {
    const response = await fetch("http://localhost:3000/users/new-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.toLowerCase() }),
    });
    const data = await response.json();
    props.welcomeMessage(data.result, username)
    dispatch(addUsername(username.toLowerCase()));
    setUsername("");
  };

  const handleKeyDown = (e) => {
    if ((e.key === "enter" || e.keyCode === 13) && username) {
        fetchUser()
    }
  };

  return (
    <div className={styles.modalMain}>
      <div className={styles.modalContent}>
        <h2>Welcome stranger!</h2>
        <p>To access the chat, please write your username and press Enter</p>
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
