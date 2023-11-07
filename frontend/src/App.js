import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from './components/login';
import { useSelector } from 'react-redux';
import { Dashboard } from './components/dashboard';
import { CourseDetails } from './components/courseDetails';
import { CourseList } from './components/courseList';
import { SearchList } from './components/searchList';

function App() {
  const token = useSelector(state => state.token.token);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={token === '' ? <Login /> : <Dashboard />} />
          <Route path="course">
            <Route path="details" element={<CourseDetails />}></Route>
            <Route path="list" element={<CourseList />}></Route>
            <Route path="search" element={<SearchList />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
