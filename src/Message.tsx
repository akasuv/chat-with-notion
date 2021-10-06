import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { KeyboardEventHandler } from "react";

type MessageType = { name: string; text: string };
export default function Message() {
  const [list, setList] = React.useState<MessageType[]>();
  const [value, setValue] = React.useState<string>();

  const sendMessage: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" && value) {
      fetch("https://cwn001.herokuapp.com/updateMessage", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          name: "akasuv",
          message: value,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.res === "success") {
            setValue("");
            fetch("https://cwn001.herokuapp.com/messages")
              .then((res) => res.json())
              .then((data) => setList(data?.reverse()));
          }
        });
    }
  };

  React.useEffect(() => {
    fetch("https://cwn001.herokuapp.com/messages")
      .then((res) => res.json())
      .then((data) => setList(data?.reverse()));
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1 style={{ textAlign: "center" }}>Chat with Notion</h1>
      <List
        sx={{
          width: "100%",
          maxHeight: "70vh",
          height: "70vh",
          overflow: "scroll",
          bgcolor: "background.paper",
        }}
      >
        {list?.map((item) => (
          <>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={item.name} src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary={item.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {item.text}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
      <TextField
        value={value}
        sx={{ width: "90%", boxSizing: "border-box" }}
        id="standard-basic"
        label="Start chatting..."
        variant="outlined"
        onChange={(e) => setValue(e.target.value)}
        onKeyUp={(e) => sendMessage(e)}
      />
    </div>
  );
}
