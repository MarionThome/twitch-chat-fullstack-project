import styles from "../styles/Message.module.css";
import moment from "moment";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Message(props) {
  const [toEdit, setToEdit] = useState(false);
  const [message, setMessage] = useState(props.message);
  const inputRef = useRef(null);

  // focus on input when edit is true => this allow the to edit input to be more explicit
  useEffect(() => {
    if (toEdit) {
      inputRef.current.focus();
    }
  }, [toEdit]);

  // function edit mesage : call the update message route
  const editMessage = () => {
    setToEdit(!toEdit);
    if (message !== props.message) {
      fetch(`http://localhost:3000/update-message/${props._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message }),
      })
    }
  };

  // function remove message : call the remove-message route
  const removeMessage = () => {
    fetch(`http://localhost:3000/remove-message/${props._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message }),
    })
  };

  // the trashcan and edit icon will only be visible on the messages of the user and only if they were not deleted
  const messageOptions = () => {
    if (props.isAuthor && !props.deleted) {
      return (
        <div style={{display:"flex", justifyContent: "end", alignItems:"center"}}>
          <FontAwesomeIcon
            icon={faPenToSquare}
            opacity="0.6"
            cursor="pointer"
            size="1x"
            color="white"
            onClick={() => editMessage()}
          />
          <div style={{marginLeft:"10px"}}>
          <FontAwesomeIcon
            icon={faTrash}
            opacity="0.6"
            cursor="pointer"
            size="1x"
            color="white"
            onClick={() => removeMessage()}
          />
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <p
        style={{ color: props.color, textAlign: props.isAuthor && "right" }}
        className={styles.author}
      >
        {props.author}
      </p>
      {!toEdit && (
        <p
          style={{ textAlign: props.isAuthor && "right" }}
          className={props.deleted ? styles.deletedText : styles.messageText}
        >
          {props.message}
        </p>
      )}
      {toEdit && (
        <input
          type="text"
          style={{ textAlign: props.isAuthor && "right" }}
          className={styles.editMessageInput}
          ref={inputRef}
          placeHolder={props.message}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {(e.key === "Enter" || e.keyCode === 13) && editMessage() }}
        />
      )}
     
      <p
        style={{ textAlign: props.isAuthor && "right" }}
        className={styles.date}
      >
        {moment(props.date).calendar()}
        <span>{(props.edited && !props.deleted) && " (edited)"}</span>
      </p>
      {messageOptions()}
    </div>
  );
}
