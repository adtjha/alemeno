import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { resetToken } from "../app/loginSlice";

export const SearchList = () => {
  const [course, setCourse] = useState();
  const token = useSelector((state) => state.token.token);
  const navigate = useNavigate();
  const [query, setQuery] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token === "") {
      navigate("/");
    }
  }, [token]);

  const handleBtnClick = (e) => {
    console.log(e.target.id);
    navigate(`/course/details?id=${e.target.id}`);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    axios
      .get(`http://localhost:5000/search?q=${query}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setCourse(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Stack direction={"column"} spacing={4}>
      <AppBar position='static'>
        <Toolbar>
          <Link to='/'>
            <Button sx={{ color: "#fff" }}>Dashboard</Button>
          </Link>
          <Link to='/course/list?page=1'>
            <Button sx={{ color: "#fff" }}>Course List</Button>
          </Link>
          <Link to='/course/search'>
            <Button sx={{ color: "#fff" }}>Search</Button>
          </Link>
          <LogoutIcon onClick={() => dispatch(resetToken())} />
        </Toolbar>
      </AppBar>
      <TextField
        id='outlined-basic'
        label='Search'
        variant='outlined'
        value={query}
        onChange={handleChange}
      />
      <Button variant='contained' onClick={handleSearch}>
        Search
      </Button>
      <Stack spacing={2} direction={"column"}>
        {course?.length > 0 &&
          course?.map((c, i) => (
            <Card
              key={i}
              elevation={1}
              sx={{
                padding: "6px",
                margin: "auto",
                width: "350px",
              }}>
              <h4>{c.name}</h4>
              <p>{c.description}</p>
              <CardContent>
                <Typography variant='overline'>Instructor</Typography>
                <Typography>{c.instructor}</Typography>
              </CardContent>
              <CardActions>
                <Button id={c.id} onClick={(e) => handleBtnClick(e)}>
                  Show Details
                </Button>
              </CardActions>
            </Card>
          ))}
      </Stack>
    </Stack>
  );
};
