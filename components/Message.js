import moment from "moment"
export default function Message(props){
    console.log(props)
    return(
        <div>
            <p style={{ color: props.color }}>{props.author}</p>
              <p>{props.message}</p>
              <p>{moment(props.date).calendar()}</p>
        </div>
    )
}