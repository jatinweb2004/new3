import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Profile.css";
import axios from "axios";
import Sidebar from "./Sidebar";
import Navbar from "../../header/Navbar";
import { useParams } from "react-router-dom";

const Profile = () => {
  const [selectedStatus, setSelectedStatus] = useState("bookmarked"); // Initialize selectedStatus with "bookmark"
  const [problems, setProblems] = useState([]);
  const storedUserData = localStorage.getItem("user");
  const user = JSON.parse(storedUserData);
  
  const [profiles, setProfiles] = useState([]);
  const { userid } = useParams(); // Extract userid from URL
  
  // Define fetchProblemDetails function before using it in useEffect hooks
  const fetchProblemDetails = async () => {
    try {
      const response = await fetch(
        `https://new2-atbw.onrender.com/api/v1/fetchProblem/${profiles.email}?status=${selectedStatus}`
      );
      if (response.ok) {
        const data = await response.json();
        setProblems(data.data);
      } else {
        throw new Error("Failed to fetch problem details");
      }
    } catch (error) {
      console.error("Error fetching problem details:", error);
    }
  };
  
  useEffect(() => {
    // Fetch user profile data when the component mounts
    axios
      .get(`https://new2-atbw.onrender.com/profile/${userid}`)
      .then((Profile) => {
        console.log(Profile);
        setProfiles(Profile.data);
      })
      .catch((err) => console.log(err));
  }, [userid]); // Make sure to include userid as a dependency
  
  useEffect(() => {
    // Fetch problem details based on the default selected status when the component mounts
    fetchProblemDetails();
  }, [userid, selectedStatus, profiles.email]); // Refetch problems when userid, selectedStatus, or profiles.email changes
  
  const handleStatusClick = (status) => {
    setSelectedStatus(status); // Update selectedStatus when the status button is clicked
  };
  

  return (
    <div>
      <Navbar />
      <div className="Profile">
        <Sidebar/>
        <div className="prof-homer">
          <div className="profile_nav">
            <div className="profile_pjt_view">Problem Overview</div>
            <div className="profile_btn">
              <div
                className={
                  selectedStatus === "bookmark"
                    ? "activeStatus profile_bookmark_btn"
                    : "profile_bookmark_btn"
                }
                onClick={() => handleStatusClick("bookmark")}
              >
                Bookmark
              </div>
              <div
                className={
                  selectedStatus === "bookmarked"
                    ? "activeStatus profile_notbookmark_btn"
                    : "profile_notbookmark_btn"
                }
                onClick={() => handleStatusClick("bookmarked")}
              >
                Not Bookmarked
              </div>
            </div>
          </div>

          <div className="show-problem">
            <div className="problems">
              {problems.map((problem) => (
                <Link
                  to={`/profile/${encodeURIComponent(problem.problemId)}`}
                  key={problem.problemId}
                  className="problem-box"
                >
                  <div className="problem-boxx">
                    <div className="problem-details">
                      <h3>{problem.problemId}</h3>
                      {problem.inputFields.map((field, index) => {
                        if (field.type === "heading") {
                          return <p key={index}>{field.value}</p>;
                        }
                        return null; // Return null if the field type is not 'heading'
                      })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
