import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './Sidebar.css';
import { Avatar } from "flowbite-react";
import Side_arrow from "../../assets/side-arrow.png";
import { useNavigate } from "react-router-dom";
import {  auth } from "../../../auth/firebase";

function Sidebar() {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const [profiles, setProfiles] = useState(null); // Initialize as null
  const storedUserData = localStorage.getItem('user');
  const { userid } = useParams(); // Extract userid from URL

  const [user1, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser); // Update user state
      if (currentUser) {
        // If user is signed in, store the username and email in local storage
        localStorage.setItem("username", currentUser.displayName);
        localStorage.setItem("email", currentUser.email);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    axios.get(`${SERVER_URL}/profile/${userid}`)
      .then(response => {
        console.log(response);
        setProfiles(response.data);
      })
      .catch(err => console.log(err));
  }, [userid]);

  const [activeSection, setActiveSection] = useState("profile");

  const handleSectionToggle = (section) => {
    setActiveSection(activeSection === section ? "" : section);
  };

//   console.log(user1.di)
console.log(user1)

  return (
    <div className="app">
      <div className="profile-nav">
        <div className={activeSection === "profile" ? "view-profile-open" : "view-profile-close"}>
          <button className="profile-btn" onClick={() => handleSectionToggle("profile")}>
            <img src={Side_arrow} className="Sidarrow" alt="arrow" />Profile 
          </button>
          {/* { profiles && ( // Ensure profiles is not null */}
            <div className="profile-details">
              <div className="profile-head">
                {/* <Avatar  alt="avatar" rounded /> */}
                <div className="profile-name">
                  {/* <p className="p1">{user1.displayName}</p> */}
                  <p className="p1">name</p>
                  
                </div>
              </div>

              {/* <button className="line"></button> */}
            </div>
          {/* )} */}
          
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
