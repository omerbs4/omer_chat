/*const MessageContainer = ({messages}) =>{

    return <div>
        {
            messages.map((msg,index) =>
            <table striped bordered>

                <tr key={index}>
                    <td>{msg.msg} - {msg.username}</td>
                </tr>

            </table>)
        }
    </div> 
}
export default MessageContainer;*/

const MessageContainer = ({ messages }) => {
    if (!messages || messages.length === 0) {
      return <div className="message-container">No messages available</div>;
    }
  
    return (
      <div className="message-container">
        <table bordered="true">
          <thead>
            <tr>
              <th>Username----Message</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg, index) => (  //.slice(-5)  sadece
              <tr key={index}>
                <td>{msg.username}: {msg.msg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default MessageContainer;
  
