import styles from "../styles/Message.module.css"
import moment from "moment"

export default function Message(props){
    console.log(props)
    return(
        <div>
            <p style={{ color: props.color, textAlign : props.isAuthor && "right"}} className={styles.author}>{props.author}</p>
              <p style={{textAlign : props.isAuthor && "right"}} className={styles.messageText}>{props.message}</p>
              <p style={{textAlign : props.isAuthor && "right"}} className={styles.date}>{moment(props.date).calendar()}</p>
        </div>
    )
}