import { useState } from "react";
import Paper from "@mui/material/Paper";
import { Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setToken } from "../app/loginSlice";
import { setUser } from "../app/userSlice";

export const Login = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = () => {
    axios
      .post("http://localhost:5000/login", {
        username,
        password,
      })
      .then(function (response) {
        console.log(response.data.token);
        dispatch(setToken(response.data.token));
        dispatch(setUser(response.data.user));
      })
      .catch(function (error) {
        console.log(error);
      });
    console.log(username, password);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        width: "fit-content",
        padding: "16px",
        margin: "auto",
      }}>
      <Typography variant='h4'>Login</Typography>
      <form>
        <TextField
          label='username'
          variant='outlined'
          fullWidth
          margin='normal'
          value={username}
          onChange={(e) => setusername(e.target.value)}
        />
        <TextField
          label='password'
          type='password'
          variant='outlined'
          fullWidth
          margin='normal'
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
      </form>
      <Button
        variant='contained'
        color='primary'
        fullWidth
        sx={{
          marginTop: "2rem",
        }}
        onClick={handleLogin}>
        Login
      </Button>
    </Paper>
  );
};
