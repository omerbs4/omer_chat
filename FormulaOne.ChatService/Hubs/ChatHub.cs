using Microsoft.AspNetCore.SignalR;  
using FormulaOne.ChatService.Models;  
using System;
using System.Threading.Tasks;
using FormulaOne.ChatService.DataService;


namespace FormulaOne.ChatService.Hubs
{
    public class ChatHub : Hub
    {
        private static Dictionary<string,string> typingUsers = new Dictionary<string,string>();


        private readonly SharedDb _shared;
        public ChatHub(SharedDb shared) => _shared = shared;

        public async Task JoinChat(UserConnection conn)
        {
            // tum kullaniciya msj
            await Clients.All
                .SendAsync("ReceiveMessage", "admin", $"{conn.Username} has joined");
        }

        public async Task JoinSpecificChatRoom(UserConnection conn)
        {
            // grup
            await Groups.AddToGroupAsync(Context.ConnectionId, conn.ChatRoom);

            _shared.connections[Context.ConnectionId] = conn;

            // grup kullanici mesajlari
            await Clients.Group(conn.ChatRoom)
                .SendAsync("ReceiveMessage", "admin", $"{conn.Username} has joined {conn.ChatRoom}");
        }

        //yaziyor kismi

        public async Task UserTyping(string username)
        {

            await Clients.Others.SendAsync("UserIsTyping",username);

        }

        //___________

        public async Task SendMessage(string msg)
        {

            if(_shared.connections.TryGetValue(Context.ConnectionId, out UserConnection conn))
            {
                await Clients.Group(conn.ChatRoom)
                    .SendAsync("ReceiveSpecificMessage",conn.Username,msg);

            }
        }


        

        public async Task Typing(string username,string chatroom)

        {
            typingUsers[chatroom] = username;

            await Clients.OthersInGroup(chatroom).SendAsync("UserTyping",username);

        }
        public async Task StopTyping(string chatroom)
        {

            typingUsers.Remove(chatroom);

            await Clients.OthersInGroup(chatroom).SendAsync("UserStoppedTyping");
        }
        
        public async Task leaveChatRoom(string chatroom)
        {
             await Groups.RemoveFromGroupAsync(Context.ConnectionId,chatroom);


        }
}
}
