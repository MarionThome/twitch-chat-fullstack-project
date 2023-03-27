import { useState } from "react";
import styles from "../styles/UserNameModal.module.css";
import { useDispatch } from "react-redux";
import { addUsername } from "../reducers/user";

export default function UserNameModal() {
  const [username, setUsername] = useState("");
  const dispatch = useDispatch()

  const fetchUser = async () => {
    const response = await fetch("http://localhost:3000/users/new-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.toLowerCase() }),
    });
    const data = await response.json();
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
        <h2>Welcome !</h2>
        <p>to start chatting, write your username and press Enter</p>
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
