import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  Pagination,
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

export const CourseList = () => {
  const [searchParams] = useSearchParams();
  const p = Number(searchParams.get("page"));
  const token = useSelector((state) => state.token.token);
  const user = useSelector((state) => state.user.user);
  const [course, setCourse] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [page, setPage] = useState(p);
  const handleChange = (event, value) => {
    setPage(value);
    navigate(`/course/list?page=${value}`);
  };

  useEffect(() => {
    if (token !== "") {
      axios
        .get(`http://localhost:5000/course/lists?page=${page}`, {
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
  }, [page, token]);

  const handleBtnClick = (e) => {
    console.log(e.target.id);
    navigate(`/course/details?id=${e.target.id}`);
  };

  const handleEnroll = (e) => {
    axios
      .get(
        `http://localhost:5000/course/enroll?courseId=${e.target.id}&userId=${user.id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then((res) => {
        let newCourse = course.map((c) => {
          if (c.id === Number(e.target.id)) {
            c.students.push(Number(user.id));
          }
          return c;
        });
        console.log(newCourse);
        setCourse(newCourse);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
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
                  {console.log(c.students)}
                  {!c.students.includes(Number(user.id)) && (
                    <Button id={c.id} onClick={(e) => handleEnroll(e)}>
                      Enroll
                    </Button>
                  )}
                </CardActions>
              </Card>
            ))}
        </Stack>
        <Stack direction={"row"}>
          <Pagination
            count={3}
            size='small'
            page={page}
            onChange={handleChange}
          />
        </Stack>
      </Stack>
    </>
  );
};
