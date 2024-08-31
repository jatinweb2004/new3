import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./Profile.css";
import axios from "axios";
import Navbar from "../../header/Navbar";

const Profile = () => {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const [selectedStatus, setSelectedStatus] = useState("bookmark"); // Initialize selectedStatus with "bookmark"
  const [problems, setProblems] = useState([]);
  const storedUserData = localStorage.getItem('user');
  const user = JSON.parse(storedUserData);

  const fetchProblemDetails = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/fetchProblem/${user.email}?status=${selectedStatus}`);
      if (response.ok) {
        const data = await response.json();
        setProblems(data.data);
      } else {
        throw new Error('Failed to fetch problem details');
      }
    } catch (error) {
      console.error('Error fetching problem details:', error);
    }
  };

  useEffect(() => {
    fetchProblemDetails();
  }, [selectedStatus]); // Refetch problems whenever selectedStatus changes

  const handleStatusClick = (status) => {
    setSelectedStatus(status); // Update selectedStatus when the status button is clicked
  };

  return (
    <div>
      <Navbar />
      <div className="Profile">
        <div className="prof-homer">
          <div className="profile_nav">
            <div className="profile_pjt_view">Problem Overview</div>
            <div className="profile_btn">
              <div className={selectedStatus === 'bookmark' ? 'activeStatus profile_bookmark_btn' : 'profile_bookmark_btn'} onClick={() => handleStatusClick('bookmark')}>Bookmark</div>
              <div className={selectedStatus === 'notbookmark' ? 'activeStatus profile_notbookmark_btn' : 'profile_notbookmark_btn'} onClick={() => handleStatusClick('notbookmarked')}>Not Bookmarked</div>
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
    <div className="problem-box">
      <img
        src={problem.images}
        alt="Problem"
        className="problem-image"
        style={{ width: '28vw' }}
      />
      <div className="problem-details">
        <h3>{problem.problemId}</h3>
        {problem.inputFields.map((field, index) => {
          if (field.type === 'heading') {
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
