import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";
import "./ChatRoom.css";

const ChatRoom = ({ messages, sendMessage, conn, username, chatroom }) => {
  const [typingUser, setTypingUser] = useState(null);

  const [userList,setUserList] = useState([]);

  const [themeColor, setThemeColor] = useState("#9dff00"); //varsayilan renk
  // message containre i duzelt, -/color command- -fotograf input- 25.02.2025


  useEffect(() => {
    if (conn) {
      conn.on("UserTyping", (username) => {
        setTypingUser(`${username} is typing...`);
      });

      conn.on("UserStoppedTyping", () => {
        setTypingUser(null);
      });

      conn.on("ChangeThemeColor", (color) =>{
        console.log("yeni renk:",color);
        setThemeColor(color);

      })

      conn.on("UpdateUserList",(users)=>{
        setUserList(users);
      });

      conn.on("UserLeft",(user)=>{
        setUserList((prevUsers) => prevUsers.filter((u) => u!==user));
      } );
    }


    return () => {
      if (conn) {
        conn.off("UserTyping");
        conn.off("UserStoppedTyping");
        conn.off("UpdateUserList");
        conn.off("ChangeThemeColor");
        conn.off("UserLeft");
      }
    };
  }, [conn]);

  const handleTyping = () => {
    if (conn && username && chatroom) {
      conn.invoke("Typing", username, chatroom);
    }
  };

  const handleStopTyping = () => {
    if (conn && chatroom) {
      conn.invoke("StopTyping", chatroom);
    }
  };

  return (
    <div>
      <Row className="px-5 py-5">
        <Col sm={8}>
          <h2>Chat Room: {chatroom}</h2>
        </Col>
        <Col sm={4}>
          <h4>Active Users</h4>
          <ul>
            {userList.map((user, index) => (
              <li key={index}>{user}</li>
            ))}
          </ul>
        </Col>
      </Row>

      <Row className="px-5 py-5">
        <Col sm={12}>
          <div className="message-container"  style={{backgroundColor:themeColor, transition:"0.7s"}}> 
            <MessageContainer messages={messages} />
          </div>
        </Col>

        

        <Col sm={12}>
          <SendMessageForm
            sendMessage={sendMessage}
            handleTyping={handleTyping}
            handleStopTyping={handleStopTyping}
          />
        </Col>
      </Row>

      {typingUser && <div className="typing-indicator">{typingUser}</div>}
    </div>
  );
};

export default ChatRoom;
