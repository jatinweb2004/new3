import React, { useState, useEffect } from "react";
import Navbar from "../../header/Navbar";
import "./problemdetailuser.css";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams to extract parameters
import "./Review.css";
import thumbsUp from "../../assets/thumbs-up.png";
import { Link } from "react-router-dom";


const Problemuser = () => {
  const { problemId } = useParams(); // Extract problem ID from URL
  const [problems, setProblems] = useState([]); // Initialize problems state as an empty array
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [profileDetails, setProfileDetails] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const storedUserData = localStorage.getItem("user"); // Retrieve the stored user data

  const user = JSON.parse(storedUserData); // Parse the stored user data from JSON to JavaScript object

  useEffect(() => {
    axios
      .get(`https://new2-atbw.onrender.com/profile/${user.uid}`)
      .then((Profile) => {
        console.log(Profile);
        setProfiles(Profile.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // Fetch problem details using problem ID
    const fetchProblemDetail = async () => {
      try {
        const response = await axios.get(
          `https://new2-atbw.onrender.com/Problem/${problemId}`
        );
        if (response.data.status === "success") {
          setProblems(response.data.data); // Set problems state to the array of problem data
          setComments(response.data.data.comments || []); // Set comments state from fetched problem data
        } else {
          console.error(
            "Failed to fetch problem details:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching problem details:", error);
      }
    };

    fetchProblemDetail();
  }, [problemId]);


  useEffect(() => {
    if (problems && problems.length > 0 && problems[0].email) {
      const fetchProfileDetails = async () => {
        try {
          const response = await axios.get(
            `https://new2-atbw.onrender.com/ownerprofile/${problems[0].email}`
          );

          console.log(problems[0].email);
      
          setProfileDetails(response.data.profile);
        
          
        } catch (error) {
          console.error("Error fetching profile details:", error);
        }
      };
      fetchProfileDetails();
    }
  }, [problems]);


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://new2-atbw.onrender.com/comments/${problemId}`
        );
        setComments(response.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [problemId]);

  const handleCommentSubmit = async () => {
    try {
      const response = await axios.post("https://new2-atbw.onrender.com/comments", {
        problemId,
        userName: profiles.name, // Replace with actual username or fetch from authentication
        image: profiles.imageUrl,
        userid : profiles.userid,
        content: newComment,
      });
      console.log(response);
      if (response.data.status === "success") {
        setComments([...comments, response.data.comment]);
        setNewComment("");
      } else {
        console.error("Failed to post comment:", response.data.message);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  //LIKES

  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);

  const handleLikeClick = async () => {
    try {
      const response = await fetch(
        `https://new2-atbw.onrender.com/problemslike/${problemId}/${user.uid}/like`,
        { method: "POST" }
      );
      if (response.ok) {
        setLiked(!liked);
        setTotalLikes((prevTotalLikes) =>
          liked ? prevTotalLikes - 1 : prevTotalLikes + 1
        );
      } else {
        console.error("Failed to update like status");
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };
  //LIKES END
  const renderFieldValue = (field) => {
    // Check if the value of the field is an object
    if (typeof field.value === 'object' && field.value !== null) {
      // If it's an object, stringify it for display
      return JSON.stringify(field.value);
    } else {
      // Check for the specific input type that requires splitting by `;`
      if (field.type === 'code-block') { // Replace 'specialType' with the specific type
        return field.value.split(';').map((part, index) => (
          <div key={index}>{part.trim()}</div>
        ));
      }
      // Otherwise, render the value as is
      return field.value;
    }
  };

  const excludedTypes = ['image']; // Add the types you want to exclude here
  const typesWithoutDescription = ['heading', 'subheading'];

  

  return (
    <div>
      <Navbar />
      <div className="pdu-problem-main-pp">
        <div className="pdu-content-shown-pp">
        <form className="pdu-problem-form">
            <div className="pdu-Id-div-pp">
              <input
                type="text"
                className="pdu-problem-problemId"
                placeholder="Enter Problem ID (Compulsory)"
                value={problemId}
                readOnly // Make the input read-only
              />
            </div>
            <div className="pdu-problem-heading">Problem Detail</div>
            {problems && problems.length > 0 && (
        <div>
          <div className="pdu-problem-subheading">Problem ID: {problems[0].problemId}</div>

          <p className="pdu-problem-subheading">Email: <p className="pdu-problem-description">{problems[0].email}</p></p>
          <br/>
          <h2>Problem Content:</h2>
          <div>
          {problems[0].inputFields.filter(field => !excludedTypes.includes(field.type)).map((field, index) => (
              
              <div key={index} >
                {!typesWithoutDescription.includes(field.type) && (
                  <div className="pdu-problem-subheading">{field.type}: </div>
                )}
                <div className={`pdu-problem-${field.type}`}>{renderFieldValue(field)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
          </form>
        </div>
      </div>

      <div className="pdu-review-section">
        <div className="pdu-heading">
          Problem Heading
          {problems && problems.length > 0 && (
          <p className="pd-update-btn">{problems[0].problemDetails.status
}</p>)}
        </div>

        <div className="pdu-section">
          <div className="pdu-user-info">
            <div className="pdu-test">
              <div className="pdu-user-user">
                <div className="pdu-user-name">
                  Owner
                  {problems.length > 0 && profileDetails && (
        <div className="pdu-my-name">
          <img src="" alt={profileDetails.name} />
          <div className="pdu-final-name">
             
          <Link
      to={`/userprofile/${profileDetails.userid}`}>
        <p className="pdu-p1">{profileDetails.name}</p>
    </Link>
          </div>
        </div>
      )}
                </div>

              </div>
            </div>
          </div>

          <div className="pdu-right-review">
            <div className="pdu-right-head">
              <p>Reviews & Feedback</p>
              <button onClick={handleLikeClick}>
                {liked ? "Unlike" : "Like"} {totalLikes}
              </button>
            </div>
            <div className="pdu-right-content">
              <div className="pdu-post-div">
                <input
                  type="text"
                  placeholder="What are your comments on this problem?"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button className="pdu-post-btn" onClick={handleCommentSubmit}>
                  POST
                </button>
              </div>
              <div className="pdu-posted-reviews">
                {comments.map((comment) => (
                  <div className="pdu-one-post" key={comment._id}>
                    <img className="pdu-poster-pic" src=""></img>

                    <div className="pdu-poster-content">
                      <div className="pdu-div-1">
                      <Link
      to={`/userprofile/${comment.userid}`}>
                        <div className="pdu-d1">{comment.userName}</div>
                        </Link>
                        <div className="pdu-d2">
                          &nbsp;. {comment.createdAt}
                        </div>
                      </div>
                      <div className="pdu-the-comment">{comment.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <Review /> */}
    </div>
  );
};

export default Problemuser;