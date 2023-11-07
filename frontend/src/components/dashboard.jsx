import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { updateUser } from "../app/userSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import { resetToken } from "../app/loginSlice";

export const Dashboard = () => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.token.token);
  const [course, setCourse] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token !== "") {
      axios
        .get(`http://localhost:5000/course/enrolled?userId=${user.id}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          setCourse(res.data.courses);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user, token]);

  const handleBtnClick = (e) => {
    console.log(e.target.id);
    navigate(`/course/details?id=${e.target.id}`);
  };

  const handleCompleteClick = (e) => {
    console.log(e.target.id);
    axios
      .get(
        `http://localhost:5000/course/completed?courseId=${e.target.id}&userId=${user.id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        dispatch(updateUser(Number(e.target.id)));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  console.log(user.courseCompleted);

  return (
    <Stack spacing={4} direction={"column"}>
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
      <Typography variant='h4'>{user.name}</Typography>
      <Divider></Divider>
      <Typography variant='h5'>Enrolled Courses</Typography>
      <Stack spacing={2} direction={"column"}>
        {course.length > 0 &&
          course.map((c) => (
            <Card
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
                {!user.courseCompleted.includes(c.id) && (
                  <Button id={c.id} onClick={(e) => handleCompleteClick(e)}>
                    Mark Completed
                  </Button>
                )}
              </CardActions>
            </Card>
          ))}
      </Stack>
    </Stack>
  );
};
