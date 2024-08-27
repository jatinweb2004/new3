





import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams to extract parameters

const ProblemDetail = () => {
  const { problemId } = useParams(); // Extract problem ID from URL
  
  const [problems, setProblems] = useState([]); // Initialize problems state as an empty array

  useEffect(() => {
    // Fetch problem details using problem ID
    const fetchProblemDetail = async () => {
      try {
        const response = await axios.get(`https://new2-atbw.onrender.com/Problem/${problemId}`);
        console.log(response);
        if (response.data.status === "success") {
          setProblems(response.data.data); // Set problems state to the array of problem data
        } else {
          console.error("Failed to fetch problem details:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching problem details:", error);
      }
    };

    fetchProblemDetail();
  }, [problemId]);

  return (
    <div>
      <h1>Problem Detail</h1>
      {problems.map((problem) => (
        <div key={problem.problemId}>
          <h2>Problem ID: {problem.problemId}</h2>
          <p>Email: {problem.email}</p>
          <p className="posted-prob-img">Images: <img src={problem.images} alt="Problem Image" /></p>

          <h3>Input Fields:</h3>
          <ul>
            {problem.inputFields.map((field, index) => (
              <li key={index}>Type: {field.type}, Value: {field.value}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ProblemDetail;
