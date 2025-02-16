import { sendMessage } from "@microsoft/signalr/dist/esm/Utils";
import { useState } from "react"
import { Button, Form,FormControl, InputGroup } from "react-bootstrap";

const SendMessageForm = ({sendMessage}) => {
    const [msg,setMessage] = useState('');

    return <Form onSubmit ={e=>{
        e.preventDefault();
        sendMessage(msg);
        setMessage('');
    }}>

        <InputGroup className="mb-3">
            <InputGroup.Text>Chat</InputGroup.Text>  
            <FormControl onChange={e=> setMessage(e.target.value)} value={msg} placeholder="type a msg"></FormControl>
        </InputGroup>
        <Button variant="primary" type="submit" disabled={!msg}>Gonder</Button>
    </Form>

}
export default SendMessageForm;