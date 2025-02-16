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
import Table from 'react-bootstrap/Table';
const MessageContainer = ({ messages }) => {
    if (!messages || messages.length === 0) {
      return <div>No messages available</div>;
    }
  
    return (
      <div>
        <table striped bordered>
          <thead>
            <tr>
              <th>Message - Username</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg, index) => (
              <tr key={index}>
                <td>{msg.msg} - {msg.username}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default MessageContainer;
  
