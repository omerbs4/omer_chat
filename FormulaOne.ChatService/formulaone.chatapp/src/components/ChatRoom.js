import { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import MessageContainer from "./MessageContainer";
import SendMessageForm from "./SendMessageForm";
import "./ChatRoom.css";

const ChatRoom = ({ messages, sendMessage, conn, username, chatroom }) => {
  const [typingUser, setTypingUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [themeColor, setThemeColor] = useState("#9dff00"); // Varsayılan renk
  const [poll, setPoll] = useState(null);
  const [pollResults, setPollResults] = useState(null);
  const [backgroundImage,setBackgroundImage] = useState(null);
 

  useEffect(() => {
    if (conn) {
      conn.on("UserTyping", (username) => {
        setTypingUser(`${username} is typing...`);
      });

      conn.on("UserStoppedTyping", () => {
        setTypingUser(null);
      });

      conn.on("ChangeThemeColor", (color) => {
        console.log("Yeni renk:", color);
        setThemeColor(color);
      });

      conn.on("UpdateUserList", (users) => {
        console.log("Aktif kullanıcılar güncellendi:", users);
        setUserList(users);
      });

      conn.on("UserLeft", (user) => {
        setUserList((prevUsers) => prevUsers.filter((u) => u !== user));
      });

      // Anket olayları
      conn.on("PollStarted", (question, options) => {
        setPoll({ question, options });
        setPollResults(new Array(options.length).fill(0));
      });

      conn.on("PollUpdated", (options, votes) => {
        setPollResults(votes);
      });

      conn.on("PollEnded", (options, votes) => {
        alert("Anket sona erdi! Sonuçlar: " + JSON.stringify(votes));
        setPoll(null);
        setPollResults(null);
      });

      conn.on("PollError", (message) => {
        alert(message);
      });


      conn.invoke("GetUserList", chatroom)
        .then((users) => setUserList(users))
        .catch((err) => console.error("Liste güncellenmedi", err));

      
    }

    return () => {
      if (conn) {
        conn.off("UserTyping");
        conn.off("UserStoppedTyping");
        conn.off("UpdateUserList");
        conn.off("ChangeThemeColor");
        conn.off("UserLeft");
        conn.off("PollStarted");
        conn.off("PollUpdated");
        conn.off("PollEnded");
        conn.off("PollError");
        
      }
    };
  }, [conn,chatroom]);



  const handleBackgroundUpload = (event) =>{
    const file = event.target.files[0];

    if(!file) return;

    if(file.type !== "image/png")
    {
      alert(".png formati seciniz!");return;
    }
    const reader = new FileReader();
    reader.onloadend = () =>{
      setBackgroundImage(reader.result);
    };
    reader.readAsDataURL(file);    
  };

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

  const startPoll = async () => {
    const question = prompt("Anket sorusunu girin:");
    if (!question) return;

    const optionsInput = prompt("Seçenekleri virgülle ayırarak girin (örn: JavaScript, Python, C#):");
    if (!optionsInput) return;

    const options = optionsInput.split(",").map((o) => o.trim());
    await conn.invoke("StartPoll", chatroom, question, options);
  };

  const vote = async (optionIndex) => {
    await conn.invoke("Vote", chatroom, optionIndex);
  };

  const endPoll = async () => {
    await conn.invoke("EndPoll", chatroom);
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
          <div className="message-container" 
          style={{ 
            backgroundColor: themeColor,
            backgroundImage:backgroundImage ? `url(${backgroundImage})` : "none",
            backgroundSize:"cover",
            backgroundPosition:"center",
             transition: "0.7s" }}>
            <MessageContainer messages={messages} />
          </div>
        </Col>


        <Col sm={12}>
          <SendMessageForm sendMessage={sendMessage} handleTyping={handleTyping} handleStopTyping={handleStopTyping} />
        </Col>


        <Col sm={12} className="mt-3">
          <Button onClick={() => document.getElementById("backgroundUpload").click()}>
            Arka Planı Değiştir
          </Button>
          <input
            type="file"
            accept="image/png"
            id="backgroundUpload"
            style={{ display: "none" }}
            onChange={handleBackgroundUpload}
          />
        </Col>
      </Row>

      {poll && (
        <div className="poll-container">
          <h3>{poll.question}</h3>
          {poll.options.map((option, index) => (
            <Button key={index} onClick={() => vote(index)}>
              {option} ({pollResults ? pollResults[index] : 0} oy)
            </Button>
          ))}
          <Button variant="danger" onClick={endPoll}>
            Anketi Bitir
          </Button>
        </div>
      )}

      {!poll && <Button onClick={startPoll}>Anket Başlat</Button>}

      {typingUser && <div className="typing-indicator">{typingUser}</div>}
    </div>
  );
};

export default ChatRoom;
