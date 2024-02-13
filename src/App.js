import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import io from "socket.io-client";
import Chat from "./Chat";

const socket = io.connect("chat-app-server-production-4216.up.railway.app");

const App=()=> {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        backgroundColor="#f0f0f0" 
      >
        {!showChat ? (
          <Paper sx={{ padding: 4, width: 300, backgroundColor: "#fff" }}> 
            <Typography variant="h4" align="center" fontFamily="Montserrat" color="#4CAF50">
              Enter the Chat Zone
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                marginTop: 2,
              }}
            >
              <TextField
                variant="outlined"
                label="Username"
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
              />
              <TextField
                variant="outlined"
                label="Room Id"
                onChange={(event) => {
                  setRoom(event.target.value);
                }}
              />
              <Button
                onClick={joinRoom}
                variant="contained"
                color="primary"
                fullWidth
                style={{ backgroundColor: "#4CAF50", color: "#fff" }} 
              >
                Join Room
              </Button>
            </Box>
          </Paper>
        ) : (
          <Chat socket={socket} username={username} room={room} setShowChat={setShowChat} />
        )}
      </Box>
    </>
  );
}

export default App;
