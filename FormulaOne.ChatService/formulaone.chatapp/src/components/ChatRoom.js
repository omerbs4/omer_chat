import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";
import "./ChatRoom.css";

const ChatRoom = ({ messages, sendMessage, conn, username, chatroom }) => {
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    if (conn) {
      conn.on("UserTyping", (username) => {
        setTypingUser(`${username} is typing...`);
      });

      conn.on("UserStoppedTyping", () => {
        setTypingUser(null);
      });
    }

    return () => {
      if (conn) {
        conn.off("UserTyping");
        conn.off("UserStoppedTyping");
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
      {/* Chat Room Başlığı */}
      <Row className="px-5 py-5">
        <Col sm={10}>
          <h2>Chat Room: {chatroom}</h2>
        </Col>
        <Col>{typingUser && <div>{typingUser}</div>}</Col>
      </Row>

      {/* Mesajların olduğu alan */}
      <Row className="px-5 py-5">
        <Col sm={12}>
          <div className="message-container">
            <MessageContainer messages={messages} />
          </div>
        </Col>

        {/* Mesaj Gönderme Alanı */}
        <Col sm={12}>
          <SendMessageForm
            sendMessage={sendMessage}
            handleTyping={handleTyping}
            handleStopTyping={handleStopTyping}
          />
        </Col>
      </Row>

      {/* Kullanıcı yazıyorsa göstermek için */}
      {typingUser && <div className="typing-indicator">{typingUser}</div>}

      <Row className="ChatRoom-container px-5 py-5"></Row>
    </div>
  );
};

export default ChatRoom;
