using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var credentialsPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "service_account.json");
builder.Services.AddSingleton(FirebaseApp.Create(new AppOptions
{
    Credential = GoogleCredential.FromFile(credentialsPath),
}));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.Authority = "https://securetoken.google.com/fir-david-5de49";
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = "https://securetoken.google.com/fir-david-5de49",
                ValidateAudience = true,
                ValidAudience = "fir-david-5de49",
                ValidateLifetime = true,
            };
        });

builder.Services.AddAuthorization(op =>
{
    op.AddPolicy("all", p => p.
        RequireAuthenticatedUser()
        .RequireRole("Admin", "BackofficeManager", "Customer"));

    op.AddPolicy("admin", p => p.
        RequireAuthenticatedUser()
        .RequireRole("Admin"));

    op.AddPolicy("customer", p => p.
        RequireAuthenticatedUser()
        .RequireRole("Customer"));

    op.AddPolicy("backofficeManager", p => p.
        RequireAuthenticatedUser()
        .RequireRole("BackofficeManager"));
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", builder =>
    builder.AllowAnyOrigin()
    .AllowAnyMethod()
    .AllowAnyHeader());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
