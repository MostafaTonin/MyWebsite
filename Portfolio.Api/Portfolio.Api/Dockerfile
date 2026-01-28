# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Portfolio.Api.csproj", "./"]
RUN dotnet restore "Portfolio.Api.csproj"
COPY . .
RUN dotnet build "Portfolio.Api.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "Portfolio.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Environment Variables
ENV ASPNETCORE_URLS=http://+:5027
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 5027

ENTRYPOINT ["dotnet", "Portfolio.Api.dll"]
