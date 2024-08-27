import React, { useState, useEffect, useRef } from "react";
import "./EditProfile.css";
import Home from "../Contest/ContestList";
import Navbar from "../../header/Navbar";
import { useNavigate } from "react-router-dom";
import '../../../fonts/fonts.css'
import upload_img from '../../assets/upload_img.png'

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../auth/firebase'; // Adjust the path as per your problem structure
import { signInWithMicrosoft, signOut, auth } from '../../../auth/firebase';

function EditProfile() {

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [Data, setData] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if image URL exists in browser storage
    const storedImageUrl = localStorage.getItem('uploadedImageUrl');
    if (storedImageUrl) {
      setUrl(storedImageUrl);
    }
  }, []);

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        // User is signed in
        setUser(currentUser); // Update user state
        // Store user data in local storage
        localStorage.setItem('user', JSON.stringify(currentUser));
      } else {
        // No user is signed in
        setUser(null); // Update user state
        // Remove user data from local storage
        localStorage.removeItem('user');
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      const newImage = e.target.files[0];
      setImage(newImage);
    }
  };


  // Function to handle uploading image to Firebase storage
  const handleImageUpload = () => {
    const storageRef = ref(storage, `${user.email}/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Track upload progress if needed
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Once upload is complete, get the download URL
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadUrl) => {
            console.log(downloadUrl);
            setUrl(downloadUrl);
            // Save image URL to browser storage
            localStorage.setItem('uploadedImageUrl', downloadUrl);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
          });
      }
    );
  };

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({
      ...Data,
      [name]: value,
    });
  };

  // Function to handle submitting form data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image first
    if (image) {
      await handleImageUpload();
    }

    // Proceed with form submission
    console.log(Data);

    // Create the DataSend object with the image URL (assuming `url` is the state holding the image URL)
    const DataSend = {
      imageUrl: url,
      userid: user?.uid,
      age: parseInt(Data.age),
      name: user?.displayName,
      email: user?.email
    };

    try {
      const response = await fetch(
        "https://new2-atbw.onrender.com/profileModel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(DataSend),
        }
      );

      console.log("Data posted to backend successfully");
      navigate('/about'); 
    } catch (error) {
      console.error("Error posting data to backend:", error);
    }
  };


  const [user, setUser] = useState(null); 


  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser); // Update user state
    });
  
    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);
  
const imageClickRef = useRef(null);

const handleImageClick = () =>{
  imageClickRef.current.click(); 
}

  

  return (
    <div className="EditProfile">
      <Navbar />
      <form onSubmit={handleSubmit}>
        <div className="text-title">
          <button type="submit">Save</button>
        </div>

        <div className="main-box">
          <div className="left-box">
            <div className="details">Details</div>

            <div className="userid">
              USER ID
              <input
                type="text"
                id="userid"
                placeholder="make unique"
                name="userid"
                value={user?.uid || ' Loading...'}
              readOnly
              />
            </div>
            <div className="name">
              NAME
              <input
                type="text"
                id="name"
                placeholder="Rishi Kiran"
                name="name"
                value={user?.displayName || 'Loading ...'} // Use optional chaining and provide a default value
                readOnly
              />


            </div>
            {/* <div>hiyejb</div> */}
            <div className="age">
              AGE
              <input
                type="text"
                id="age"
                placeholder="example:15,18"
                name="age"
                value={Data.age}
                onChange={handleInput}
              />
            </div>

            <div className="email">
              EMAIL
              <input
                placeholder="example@iitg.ac.in"
                type="text"
                id="email"
                name="email"
                value={user?.email || ' Loading...'}
               readOnly
              />
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}

export default EditProfile;
