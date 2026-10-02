using IGDB;
using NES_Box_Art.Services;

var builder = WebApplication.CreateBuilder(args);

var clientId = builder.Configuration["Twitch:ClientId"] ?? builder.Configuration["IGDB:ClientId"];
var clientSecret = builder.Configuration["Twitch:ClientSecret"] ?? builder.Configuration["IGDB:ClientSecret"];

builder.Services.AddSingleton<IGDBClient>(sp => 
{
    return new IGDBClient(clientId ?? string.Empty, clientSecret ?? string.Empty);
});

var allowedOrigins = builder.Configuration.GetSection("Frontend:AllowedOrigins").Get<string[]>() ??
    ["http://localhost:5173", "http://localhost:5175", "http://127.0.0.1:5175", "https://nes.jpwillenborg.com"];

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();
builder.Services.AddMemoryCache();
builder.Services.AddScoped<IGameTimelineService, GameTimelineService>();
builder.Services.AddCors(options => options.AddPolicy("frontend", policy =>
    policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler();
    app.UseHsts();
}
else
{
    app.UseExceptionHandler();
    app.MapOpenApi();
}

app.UseStatusCodePages();
app.UseCors("frontend");

app.MapControllers();

app.Run();
