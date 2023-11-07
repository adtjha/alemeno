import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { resetToken } from "../app/loginSlice";

export const CourseDetails = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [course, setCourse] = useState();
  const token = useSelector((state) => state.token.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token === "") {
      navigate("/");
    }
  }, [token]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/course?id=${id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setCourse(res.data.course);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.log(course);
  }, [course]);

  return (
    <Stack direction={"column"}>
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
      <Box width={400}>
        <Card>
          <CardMedia
            component='img'
            alt={course?.name}
            height='240'
            image={course?.thumbnail}
          />
          <CardContent>
            <Typography variant='h5' component='div'>
              {course?.name}
            </Typography>
            <Typography color='textSecondary'>
              Instructor: {course?.instructor}
            </Typography>
            <Typography color='textSecondary'>
              Location: {course?.location}
            </Typography>
            <Typography color='textSecondary'>
              Duration: {course?.duration}
            </Typography>
            <Typography color='textSecondary'>
              Schedule: {course?.schedule}
            </Typography>
            <Typography color='textSecondary'>
              Enrollment Status: {course?.enrollmentStatus}
            </Typography>
            <Divider></Divider>
            <Typography variant='h6' component='div'>
              Course Description:
            </Typography>
            <Typography variant='body2' gutterBottom>
              {course?.description}
            </Typography>
            <Typography variant='h6' component='div'>
              Prerequisites:
            </Typography>
            <Typography variant='body2' gutterBottom>
              {course?.prerequisites?.join(",")}
            </Typography>
            <Divider></Divider>
            <Typography variant='h6' component='div'>
              Syllabus:
            </Typography>
            <List>
              {course?.syllabus?.map((item) => (
                <ListItem key={item.week}>
                  <ListItemText
                    primary={`Week ${item.week}: ${item.topic}`}
                    secondary={item.content}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
};
