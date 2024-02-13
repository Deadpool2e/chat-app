import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ScrollToBottom from "react-scroll-to-bottom";
import SendIcon from "@mui/icons-material/Send";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./App.css";

const Chat = ({ socket, username, room, setShowChat }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);
  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    const receiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", receiveMessage);

    return () => {
      socket.off("receive_message", receiveMessage);
    };
  }, [socket]);

  const leaveRoom = () => {
    setShowChat(false);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {isMobile ? (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            padding: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1" sx={{ marginRight: 1 }}>
            Hello, {username}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={leaveRoom}
            sx={{ textTransform: "none" }}
          >
            Leave Room
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            padding: 2,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" sx={{ marginRight: 1 }}>
            Hello, {username}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={leaveRoom}
            sx={{ textTransform: "none" }}
          >
            Leave Room
          </Button>
        </Box>
      )}
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          height: 500,
          width: 300,
          marginTop: 2,
          padding: 5,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom mb={3}>
          Chat Messages
        </Typography>

        <Box sx={{ flex: 1, overflowY: "auto", paddingX: 1 }}>
          {messageList.length === 0 ? (
            <Typography variant="body1" align="center" sx={{
              color: "grey",
              marginY:"50%"
            }}>
              No messages here, start chatting...
            </Typography>
          ) : (
            <ScrollToBottom>
              {messageList.map((messageContent, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems:
                      messageContent.author === username
                        ? "flex-end"
                        : "flex-start",
                    mb: 1,
                  }}
                >
                  {index === 0 ||
                  messageContent.author !== messageList[index - 1].author ? (
                    <Box
                      sx={{
                        textAlign: "left",
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        {messageContent.author === username
                          ? "You"
                          : messageContent.author}
                      </Typography>
                    </Box>
                  ) : null}
                  <Box
                    sx={{
                      backgroundColor:
                        messageContent.author === username
                          ? "#2ad9eb"
                          : "#e3e3e3",
                      borderRadius: 1,
                      p: 1,
                      maxWidth: "70%",
                      display: "flex",
                      flexDirection: "column",

                      "&:before":
                        messageContent.author === username &&
                        (index === 0 ||
                          messageContent.author !==
                            messageList[index - 1].author)
                          ? {
                              content: '""',
                              position: "absolute",
                              right: "-8px",
                              borderBottom: "10px solid transparent",
                              borderLeft: "11px solid #2ad9eb",
                              transform: "translateY(-80%)",
                            }
                          : (index === 0 ||
                              messageContent.author !==
                                messageList[index - 1].author) && {
                              content: '""',
                              position: "absolute",
                              left: "-8px",
                              borderBottom: "10px solid transparent",
                              borderRight: "11px solid #e3e3e3",
                              transform: "translateY(-80%)",
                            },
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      {messageContent.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{
                        fontSize: 9,
                        marginTop: "auto",
                        textAlign: "right",
                      }}
                    >
                      {messageContent.time}
                    </Typography>
                    {index === messageList.length - 1 && (
                      <div ref={messagesEndRef} />
                    )}
                  </Box>
                </Box>
              ))}
            </ScrollToBottom>
          )}
        </Box>
        <Box sx={{ mt: 1, display: "flex" }}>
          <TextField
            type="text"
            value={currentMessage}
            label="Type a Message"
            variant="standard"
            sx={{ flexGrow: 1, mr: 1 }}
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <IconButton onClick={sendMessage} color="primary">
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </>
  );
};

export default Chat;
