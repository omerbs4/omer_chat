
import { Col, Row ,Container } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WaitingRoom from './components/waitingroom';
import { use, useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import ChatRoom from './components/ChatRoom';

function App() {

  const [conn,setConnection] = useState();
  const [messages,setMessages] = useState([]);  
  const joinChatRoom= async(username,chatroom) =>{
    try {
      //baglantiyi baslatma
      const conn =  new HubConnectionBuilder()
                    .withUrl("http://localhost:5298/chat")
                    .configureLogging(LogLevel.Information)
                    .build();

      //handler
      conn.on("ReceiveMessage",(username,msg)=>{
        console.log("msg: "+username,": "+msg);


      });

      conn.on("ReceiveSpecificMessage",(username,msg) => {
        setMessages(messages => [...messages,{username,msg}]);
      })

      await conn.start();
      await conn.invoke("JoinSpecificChatRoom",{username,chatroom});
      setConnection(conn);

    } catch (error) {
      console.log(error);
    }
  }

  const sendMessage = async(message) =>{
    try {
      await conn.invoke("SendMessage",message);
    } catch (e) {
      console.log(e);
    }
  }




  return (
    <div>
    <main>
    <Container>
        <Row className='px-5 my-5'>
          <Col sm ='12'>
            <h1 className='font-weight-light'>online f1 chat uygulamasina hosgeldiniz!</h1>
          </Col>

        </Row>
        {!conn 
          ? <WaitingRoom joinChatRoom={joinChatRoom}></WaitingRoom>
          :<ChatRoom messages ={messages} sendMessage={sendMessage}></ChatRoom>
        }
        
    </Container>
    </main>
    </div>
  );
}

export default App;
