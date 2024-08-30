import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../header/Navbar';
import './Problem.css';
import axios from 'axios';
import ContinueProblem from './ContinueProblem';
import ImageUpload from './problemimage'; // Import the ImageUpload component
import { auth } from '../../../auth/firebase';
const API_URI = 'https://new2-atbw.onrender.com/api/v1';

const PopupPage = ({ onClose, formData, setFormData, handleSubmit }) => {
  return (
    <div className='popup-overlay'>
      <div className="popup">
        <ContinueProblem
          close={onClose}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

const Problem = () => {
  const [user, setUser] = useState(null);
  const [problemId, setProblemId] = useState('');
  const [inputFields, setInputFields] = useState([]);
  const [file, setFile] = useState('');
  const [result, setResult] = useState([]);
  const fileInputRef = useRef();
  const [url, setUrl] = useState('');
  const [formData, setFormData] = useState({
    problemName: '',
    category: '',
    tools: '',
    status: 'bookmark',
  });

  useEffect(() => {
    // Check if image URL exists in browser storage
    const ImageUrl = localStorage.getItem('imageURL');
    setUrl(ImageUrl);
  }, []);

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if (currentUser) {
        setUser(currentUser); // Update user state
        localStorage.setItem('user', JSON.stringify(currentUser));
      } else {
        setUser(null); // Update user state
        localStorage.removeItem('user');
      }
    });

    return () => unsubscribe();
  }, []);

  const uploadFile = async (data) => {
    try {
      const response = await axios.post(`${API_URI}/upload`, data);
      console.log("response is:", response)
      return response.data;
    } catch (error) {
      console.log('Error while calling the API ', error.message);
    }
  }

  useEffect(() => {
    const getImage = async () => {
      if (file) {
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);

        const response = await uploadFile(data);
        console.log(response.path)
        setResult(prev => [...prev, response.path]);
      }
    }
    getImage();
  }, [file])

  const onUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error("fileInputRef.current is null or undefined");
    }
  }

  useEffect(() => {
    const storedInputFields = JSON.parse(localStorage.getItem('inputFields')) || [];
    setInputFields(storedInputFields);
  }, []);

  const addInputField = (type) => {
    const imageFieldExists = inputFields.some(field => field.type === 'image');

    if (type === 'image' && imageFieldExists) {
      alert('You can only add one image.');
      return;
    }

    if (type === 'image') {
      const newInputField = { type, value: <ImageUpload setFile={setFile} /> };
      setInputFields((prevFields) => [...prevFields, newInputField]);
    } else {
      const newInputField = { type, value: '' };
      setInputFields((prevFields) => [...prevFields, newInputField]);
    }
  };

  useEffect(() => {
    localStorage.setItem('inputFields', JSON.stringify(inputFields));
  }, [inputFields]);

  const inputType = (field, index) => {
    const adjustHeight = (e) => {
      e.target.style.height = 'inherit';
      e.target.style.height = `${e.target.scrollHeight}px`;
    };

    if (field.type === 'heading' || field.type === 'subheading') {
      return (
        <input
          type="text"
          className={`problem-${field.type}`}
          placeholder={`Enter ${field.type} here`}
          value={field.value}
          onChange={(e) => handleInputChange(index, e.target.value)}
        />
      );
    } else if (field.type === 'description' || field.type === 'code-block') {
      return (
        <textarea
          className={`problem-${field.type}`}
          placeholder={`Enter ${field.type} here`}
          value={field.value}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onInput={adjustHeight}
        />
      );
    } else if (field.type === 'image') {
      return field.value;
    }
  };

  const handleInputChange = (index, value) => {
    setInputFields((prevFields) => {
      const updatedFields = prevFields.map((f, i) =>
        i === index ? { ...f, value } : f
      );
      return updatedFields;
    });
  };

  const handleSubmit = async () => {
    try {
      const requestData = {
        problemId: problemId,
        email: user?.email,
        name: user?.displayName,
        images: url,
        inputFields: inputFields,
        problemDetails: formData,
      };
  
      console.log('Combined Form Data:', requestData);
  
      const response = await fetch('https://new2-atbw.onrender.com/api/v1/saveProblem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save problem data');
      }
  
      console.log('Problem data saved successfully');
      setProblemId('');
      setInputFields([]);
      setFormData({
        problemName: '',
        category: '',
        tools: '',
        status: 'bookmark',
      });
  
      // Save form data to localStorage
      // localStorage.setItem('formData', JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving problem data:', error);
    }
  
  
  };

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    if (problemId.trim() === "") {
      window.alert('Enter Problem Id First!');
    } else {
      setIsPopupOpen(!isPopupOpen);
    }
  };

  const handleDiscardClick = () => {
    const isConfirmed = window.confirm('Are you sure you want to discard your changes?');
    if (isConfirmed) {
      resetToDefault();
    }
  };

  const resetToDefault = () => {
    setInputFields([]);
    localStorage.removeItem('inputFields');
  };

  return (
    <div>
      <Navbar />
      <div className="problem-main">
        <div className="content-shown">
          <form onSubmit={handleSubmit}>
            <div className='Id-div'>
              <input
                type="text"
                className="problem-problemId"
                placeholder="Enter Problem ID (Compulsory)"
                value={problemId}
                onChange={(e) => setProblemId(e.target.value)}
              />
            </div>
            {inputFields.map((field, index) => (
              <div key={index}>{inputType(field, index)}</div>
            ))}
            <div className='confirm-content'>
              <button type="button" className="continue-btn" onClick={togglePopup}>Continue</button>
              <button type="button" className="remove-btn" onClick={handleDiscardClick}>Discard</button>
            </div>
          </form>
        </div>

        <div className="add-box">
          <div className="add-content">
            Add Content
            <div className="add-btns">
              <button className="main-btn" onClick={() => addInputField('heading')}>
                Add Heading
              </button>
              <button className="main-btn" onClick={() => addInputField('description')}>
                Add Description
              </button>
              <button className="main-btn" onClick={() => addInputField('code-block')}>
                Code Block
              </button>
            </div>
          </div>
        </div>
      </div>

     {isPopupOpen && (
  <PopupPage
    onClose={togglePopup}
    formData={formData}
    setFormData={setFormData}
    handleSubmit={handleSubmit ? handleSubmit : null} // Pass null if handleSubmit is not defined
  />
)}
    </div>
  );
};

export default Problem;
