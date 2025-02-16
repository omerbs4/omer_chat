using FormulaOne.ChatService.DataService;
using FormulaOne.ChatService.Hubs;
using Microsoft.AspNetCore.Cors.Infrastructure;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSignalR();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors( opt =>{
    opt.AddPolicy("reactApp",builder =>{
        builder.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddSingleton<SharedDb>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/Chat");
app.UseCors("reactApp");

app.Run();
