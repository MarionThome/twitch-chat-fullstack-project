import styles from "../styles/Message.module.css"
import moment from "moment"
import { useState, useEffect, useRef } from "react"

export default function Message(props){
    const [toEdit, setToEdit] = useState(false);
    const [message, setMessage] = useState(props.message)
    const inputRef = useRef(null)

    useEffect(() => {
        if(toEdit){
            inputRef.current.focus()
        }
    }, [toEdit])

    const editMessage = () => {
        setToEdit(!toEdit)
        if(message !== props.message){
            fetch(`http://localhost:3000/update-message/${props._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message }),
      })
        .then((res) => res.json())
        .then((data) => {
         console.log(data)
        });
        }
    }

    
    return(
        <div>
            <p style={{ color: props.color, textAlign : props.isAuthor && "right"}} className={styles.author}>{props.author}</p>
              {!toEdit && <p style={{textAlign : props.isAuthor && "right"}} className={styles.messageText}>{props.message}</p>}
              {toEdit && <input type="text" style={{textAlign : props.isAuthor && "right"}} className={styles.editMessageInput} ref={inputRef} placeHolder={props.message} value={message} onChange={(e) => setMessage(e.target.value)}/>}
              <p style={{textAlign : props.isAuthor && "right"}} className={styles.date}>{moment(props.date).calendar()}</p>
              {props.isAuthor && <p onClick={()=>editMessage()}>{toEdit ? "save" : "edit"}</p>}
        </div>
    )
}