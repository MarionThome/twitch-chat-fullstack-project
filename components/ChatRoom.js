import styles from '../styles/ChatRoom.module.css';
import Message from './Message'

export default function ChatRoom(){
    const messages = props.messages;
    const userName = useSelector((state) => state.userInfos.value.username);
    const [ newMessage, setNewMessage] = useState("")

    const messagesToDisplay = messages.map((message, index) => {})
    return(
        <div style = {{backgroundColor : "white"}}>
            <div>

            </div>
            <textarea/>
        </div>
    )
}