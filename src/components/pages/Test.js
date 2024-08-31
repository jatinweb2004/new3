import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function Test() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const receivedData = params.get('id');
  const [problem, setProblem] = useState([]);
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    axios.get(`${SERVER_URL}/addProblem/?problemId=${receivedData}`)
      .then(Problem => {
        setProblem(Problem.data);
      })
      .catch(error => console.error('Error fetching problem details:', error));
  }, []);

  return (
    <div>
      <h2>Problem Details</h2>
      {problem.map(problemItem => (
        <div key={problemItem.problemId}>
          <strong>Problem ID:</strong> {problemItem.problemId}
          <br />
          <strong>Image:</strong> <img src={problemItem.image} alt="Problem" />
          <br />
          <strong>Input Fields:</strong>
          <ul>
            {problemItem.inputFields.map((field, index) => (
              <li key={index}>
                {field.type === 'heading' && (
                  <>
                    <strong>Heading:</strong> {field.value}
                    <br />
                  </>
                )}
                {field.type === 'subheading' && (
                  <>
                    <strong>Subheading:</strong> {field.value}
                    <br />
                  </>
                )}
              </li>
            ))}
          </ul>
          {/* Add more problem details here */}
        </div>
      ))}
    </div>
  );
}

export default Test;