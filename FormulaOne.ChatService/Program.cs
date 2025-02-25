using FormulaOne.ChatService.DataService;
using FormulaOne.ChatService.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

//builder.WebHost.UseUrls("http://0.0.0.0:5000"); // mobil icn deneme

builder.Services.AddSignalR();


builder.Services.AddCors(opt =>
{
    opt.AddPolicy("reactApp", builder =>
    {
        builder.WithOrigins("http://localhost:3000","http://localhost:5298")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); 
    });
});




builder.Services.AddSingleton<SharedDb>();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// Middleware 

app.UseRouting();
app.UseCors("reactApp"); 

app.UseAuthorization();


app.MapHub<ChatHub>("/Chat");

app.Run();
