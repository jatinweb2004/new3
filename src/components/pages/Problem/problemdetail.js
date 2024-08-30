import React, { useState, useEffect } from "react";
import Navbar from "../../header/Navbar";
// import "./PostedProblem.css";
// import "./Review.css";
import "./problemdetail.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams to extract parameters
import Review from "./Review";
import thumbsUp from "../../assets/thumbs-up.png";

const Problem = () => {
  const { problemId } = useParams(); // Extract problem ID from URL
  const [problems, setProblems] = useState([]); // Initialize problems state as an empty array
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [profiles, setProfiles] = useState([]);
  const storedUserData = localStorage.getItem("user"); // Retrieve the stored user data

  const [profileDetails, setProfileDetails] = useState(null);

  const user = JSON.parse(storedUserData); // Parse the stored user data from JSON to JavaScript object
  console.log(user.uid);

  useEffect(() => {
    axios
      .get(`https://new2-atbw.onrender.com/api/v1/profile/${user.uid}`)
      .then((Profile) => {
      
        setProfiles(Profile.data);

        console.log(profiles);
       
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // Fetch problem details using problem ID
    const fetchProblemDetail = async () => {
      try {
        const response = await axios.get(
          `https://new2-atbw.onrender.com/api/v1/Problem/${problemId}`
        );
        if (response.data.status === "success") {
          setProblems(response.data.data); // Set problems state to the array of problem data
         
          console.log(problems);
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
          `https://new2-atbw.onrender.com/api/v1/comments/${problemId}`
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
  
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`https://new2-atbw.onrender.com/problemslike/status/${problemId}/${user.uid}`);
        if (response.status === 200) {
          setLiked(response.data.liked);
          setTotalLikes(response.data.totalLikes);
        } else {
          console.error("Failed to fetch like status");
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };
  
    fetchLikeStatus();
  }, [problemId, user.uid]);
  
  const handleLikeClick = async () => {
    try {
      const response = await axios.post(`https://new2-atbw.onrender.com/problemslike/${problemId}/${user.uid}/like`);
      if (response.status === 200) {
        const responseData = response.data;
        setLiked(responseData.liked);
        setTotalLikes(responseData.totalLikes);
      } else {
        console.error("Failed to update like status");
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };
  
  
  
  //LIKES END



  

  //Collaboration
  const [text, setText] = useState("");
  const [receiverId, setReceiverId] = useState("");

  const handleCollaboration = async () => {
    try {
      const senderId = profiles.email; // Assuming profiles contains sender information
      const senderName = profiles.name; // Assuming profiles contains sender information

      let problemName = ""; // Initialize problemName
      let problemactname = ""; // Initialize problemName
       let problemid = "";
      // Check if problems array is not empty and problems[0].name is defined
      if (problems.length > 0 && problems[0].name) {
        problemName = problems[0].name; // Assign problemName if conditions are met
        problemactname = problems[0].problemDetails.problemName;
        problemid = problems[0].problemId;
      } else {
        console.error("Problem name is not available.");
        return; // Exit the function if problem name is not available
      }

      const messageText = `Message from ${senderName} to collab on  ${problemactname}: ${text}`;

      const requestBody = {
        text: messageText,
        senderuserid: user.uid,
        receiveruserid: profileDetails.userid,
        senderId: senderId, // Use actual senderId
        senderName: user.displayName,
        receiverName: profileDetails.name,
        senderImg: profiles.imageUrl,
        receiverImg: profileDetails.imageUrl,
        problemName: problemactname,
        problemid : problemid,
        receiverId: problems[0].email, // Use actual receiverId from state
        
      };

      console.log(requestBody);

      // Send POST request to the server
      await axios.post("https://new2-atbw.onrender.com/send-collab-request", requestBody);
      alert("Message sent successfully");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  
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

  // const headingField = problems[0].inputFields.find(field => field.type === 'heading');


  return (
    <div>
      <Navbar />
      <div className="pd-problem-main-pp">
        <div className="pd-content-shown-pp">
          <form className="pd-problem-form">
            {/* <div className="pd-Id-div-pp">
              <input
                type="text"
                className="pd-problem-problemId"
                placeholder="Enter Problem ID (Compulsory)"
                value={problemId}
                readOnly // Make the input read-only
              />
            </div> */}
            <div className="pd-problem-heading">Problem Detail</div>
            {problems && problems.length > 0 && (
        <div>
          <div className="pd-problem-subheading">Problem ID: {problems[0].problemId}</div>

          {/* <p className="pd-problem-subheading">Email: <p className="pdu-problem-description">{problems[0].email}</p></p> */}
          <p className="pd-problem-image">
            <img src={problems[0].images} alt="Problem Image" />
          </p>
          <br/>
          <h2>Problem Content:</h2>
          <div>
            {problems[0].inputFields.filter(field => !excludedTypes.includes(field.type)).map((field, index) => (
              
              <div key={index} >
                {!typesWithoutDescription.includes(field.type) && (
                  <div className="pd-problem-subheading">{field.type}: </div>
                )}
                <div className={`pd-problem-${field.type}`}>{renderFieldValue(field)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
          </form>
        </div>
      </div>

      <div className="pd-review-section">
        <div className="pd-heading">
          Problem Heading
          {problems && problems.length > 0 && (
          <p className="pd-update-btn">{problems[0].problemDetails.status
}</p>
          )}
        </div>

        <div className="pd-section">
          <div className="pd-user-info">
            <div className="pd-test">
              <div className="pd-user-user">
                <div className="pd-user-name">
                  Owner
                  {problems.length > 0 && profileDetails && (
        <div className="pd-my-name">
          <img src={profileDetails.imageUrl} alt={profileDetails.name} />
          <div className="pd-final-name">
          
          <Link
      to={`/userprofile/${profileDetails.userid}`}>
        <p className="pd-p1">{profileDetails.name}</p>
    </Link>
            <p className="pd-p2">134 problems - 3 following</p>
          </div>
        </div>
      )}
                </div>

              </div>
              {/* <button className="pd-edit-me">Edit Problem</button> */}
              <button className="pd-edit-me" onClick={handleCollaboration}>Collaborate</button>

            </div>
          </div>

          <div className="pd-right-review">
            {/* <div className="pd-right-review"> */}
            <div className="pd-right-head">
              <p>Reviews & Feedback</p>
              <button onClick={handleLikeClick}>
        {liked ? "Unlike" : "Like"} {totalLikes}
      </button>
            </div>
            {/* </div> */}

            {/* <button onClick={() => handleCollaborationRequest(problemId)}>Request Collaboration</button> */}
            <div className="pd-right-content">
              <div className="pd-post-div">
                <input
                  type="text"
                  placeholder="What are your comments on this problem?"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button className="pd-post-btn" onClick={handleCommentSubmit}>
                  POST
                </button>
              </div>
              <div className="pd-posted-reviews">
                {comments.map((comment) => (
                  <div className="pd-one-post" key={comment._id}>
                    <img className="pd-poster-pic" src={comment.image}></img>

                    <div className="pd-poster-content">
                      <div className="pd-div-1">
                      <Link
      to={`/userprofile/${comment.userid}`}>
                        <div className="pd-d1">{comment.userName}</div>
                        </Link>
                        <div className="pd-d2">&nbsp;. {comment.createdAt}</div>
                      </div>
                      <div className="pd-the-comment">{comment.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;
