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
        private static Dictionary<string,UserConnection> ConnectedUsers = new Dictionary<string, UserConnection>();



        private readonly SharedDb _shared;
        public ChatHub(SharedDb shared) => _shared = shared;


        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("Connected",Context.ConnectionId);
            await base.OnConnectedAsync();

        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            if(ConnectedUsers.TryGetValue(Context.ConnectionId, out UserConnection user))
            {
                ConnectedUsers.Remove(Context.ConnectionId);
                await Clients.Group(user.ChatRoom).SendAsync("UserLeft",user.Username);
                await UpdateUserList(user.ChatRoom);

            }
            await base.OnDisconnectedAsync(ex);
        }

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
            ConnectedUsers[Context.ConnectionId] = conn;


            // grup kullanici mesajlari
            await Clients.Group(conn.ChatRoom)
                .SendAsync("ReceiveMessage", "admin", $"{conn.Username} has joined {conn.ChatRoom}");

            await UpdateUserList(conn.ChatRoom);
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

                if(msg.StartsWith("/color"))
                {
                    string color =msg.Split(" ").Length > 1 ? msg.Split(" ")[1] : "#007bff"; 
                    Console.WriteLine($"[LOG] {conn.Username} chat rengini {color} yapti!");
                    await Clients.Group(conn.ChatRoom).SendAsync("ChangeThemeColor",color);

                }
                else{
                        await Clients.Group(conn.ChatRoom)
                    .SendAsync("ReceiveSpecificMessage",conn.Username,msg);
                }
                

            }
        }

        private async Task UpdateUserList(string chatroom)
        {
            var userInRoom = ConnectedUsers.Values
            .Where(u=> u.ChatRoom == chatroom)
            .Select(u=> u.Username)
            .ToList();


            await Clients.Group(chatroom).SendAsync("UpdateUserList",userInRoom);
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
