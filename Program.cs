using Microsoft.Extensions.Options;
using Practical.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddSignalR();
builder.Services.AddMvc(option => option.EnableEndpointRouting = false);
// builder.Services.AddAuthentication()
//                 .AddJwtBearer(Options => {
//                     Options.Events = new JwtBearerEvents{
//                         OnMessageReceived = context => {
//                             var accessToken = context.Request.Query["access_token"];
//                             if(string.IsNullOrEmpty(accessToken) == false){
//                                 context.Token = accessToken;
//                             }

//                             return Task.CompletedTask;
//                         }
//                     };
//                 });
var app = builder.Build();

app.UseStaticFiles();

//app.MapGet("/messages", () => "Hello World!");
app.MapHub<MessageHub>("/messages");
app.UseMvc();
app.MapRazorPages();
app.Run();
