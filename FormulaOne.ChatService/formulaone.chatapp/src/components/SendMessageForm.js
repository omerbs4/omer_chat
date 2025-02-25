
import { useState } from "react"
import { Button, Form,FormControl, InputGroup } from "react-bootstrap";

const SendMessageForm = ({sendMessage,handleTyping,handleStopTyping}) => {
    const [msg,setMessage] = useState('');
    const [file,setFile] = useState(null);


    const handleInputChange=(e) => {

        setMessage(e.target.value);
        if(e.target.value)
        {
            handleTyping();
        }
        else
        {
            handleStopTyping();
        }
        
    }

    

    return <Form onSubmit ={e=>{
        e.preventDefault();
        sendMessage(msg,file);
        setMessage('');
        setFile(null);
    }}>

        <InputGroup className="mb-3">
        <br></br>
            <InputGroup.Text>Chat</InputGroup.Text>  
            <br></br>
            
            <FormControl onChange={handleInputChange} value={msg} placeholder="type a msg"/>
        </InputGroup>
        <Button  variant="primary" type="submit" disabled={!msg}>Gonder</Button>

        
    </Form>

}
export default SendMessageForm;