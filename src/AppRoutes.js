import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import BrowserRouter
import EditProfile from "../src/components/pages/Profile/EditProfile";

import Problem from "./components/pages/Problem/Problem";
import About from "./components/pages/AboutUs/About";
import Profile from "./components/pages/Profile/Profile";
import Queries from "./components/pages/Query/Queries";
import Test from "./components/pages/Test";
import Open_Queries from "./components/pages/Query/Open_Queries";
import PostedProblem from "./components/pages/Problem/PostedProblem";
import Login from './auth/Login';
import ProblemDetail from "./components/pages/Problem/problemdetail";
import Problemuser from "./components/pages/Problem/problemdetailuser";
import ContestList from "./components/pages/Contest/ContestList";
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/Contest" element={<ContestList />} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/userprofile/:userid" element={<Profile />} />
        <Route path="/About" element={<About />} />
        <Route path="/Queries" element={<Queries />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/Problem" element={<Problem />} />
        <Route path="/PostedProblem" element={<PostedProblem />} />
        <Route path="/detailquery" element={<Open_Queries />} />
        <Route path="/fullproblem" element={<Test />} />
        <Route path="/problem/:problemId" element={<ProblemDetail/>} /> 
        <Route path="/profile/:problemId" element={<Problemuser/>} /> 
      </Routes>
    </Router>
  );
};

export default AppRoutes;
