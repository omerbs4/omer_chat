import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Col, Row, Container } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WaitingRoom from './components/waitingroom';
import { useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import ChatRoom from './components/ChatRoom';

function App() {
  const [conn, setConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [username, setUserName] = useState('');
  const [chatroom, setChatroom] = useState('');

  const joinChatRoom = async (username, chatroom) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl('http://localhost:5298/chat')
        .configureLogging(LogLevel.Information)
        .build();

      connection.on('ReceiveMessage', (username, msg) => {
        console.log('msg: ' + username, ': ' + msg);
      });

      connection.on('ReceiveSpecificMessage', (username, msg) => {
        setMessages((messages) => [...messages, { username, msg }]);
      });

      connection.on('UpdateUserList', (users) => {
        console.log('Aktif :', users);
      });

      await connection.start();
      await connection.invoke('JoinSpecificChatRoom', { username, chatroom });

      setUserName(username);
      setChatroom(chatroom);
      setConnection(connection);
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = async (message) => {
    try {
      await conn.invoke('SendMessage', message);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <main>
        <Container>
          <Row className="px-5 my-5">
            <Col sm="12">
              <h1 className="font-weight-light">CHAT_APP</h1>
            </Col>
          </Row>

          {!conn ? (
            <WaitingRoom joinChatRoom={joinChatRoom} />
          ) : (
            <ChatRoom
              messages={messages}
              sendMessage={sendMessage}
              conn={conn}
              username={username}
              chatroom={chatroom}
            />
          )}
        </Container>
      </main>
    </div>
  );
}

function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
}

export default Main;
