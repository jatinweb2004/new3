// ContinueProblem.js
import React from 'react';
import { Link } from 'react-router-dom';
import './ContinueProblem.css';

const ContinueProblem = ({ close, formData, setFormData, handleSubmit }) => {
  
  const handlePublish = () => {
    handleSubmit && handleSubmit(); // Call the handleSubmit function only if it's defined
    close(); // Close the popup after submitting the form
  };

  return (
    <div className='popup-overlay'>
      <div className="popup">
        <div className='Problem_Overlay_Upper_Part'>
          <div className='Problem_Overlay_Top2'>
            <div className='Problem_Overlay_img'></div>
            <div className='Problem_Overlay_img_right'>
              <div className='Problem_Overlay_Name'>ProblemName</div>
              <input
                className='Problem_Overlay_Problem_Name'
                placeholder='Enter Problem Name'
                value={formData.problemName}
                onChange={(e) => setFormData({ ...formData, problemName: e.target.value })}
              />
            </div>
          </div>
          <div className='Problem_Overlay_Problem_Status'>
            <div className='Problem_Overlay_Problem_Status_Name'>Problem Status</div>
            <div className='Radio'>
              <label className='Radio_Input'>
                <input
                  type='radio'
                  id="option1"
                  name="options"
                  value="bookmark"
                  checked={formData.status === "bookmark"}
                  onChange={() => setFormData({ ...formData, status: 'bookmark' })}
                />
                <span className='Problem_Status_Text'>Bookmark</span>
              </label>
              <label className='Radio_Input' >
                <input
                  type='radio'
                  id="option2"
                  name="options"
                  value="notbookmark"
                  checked={formData.status === "notbookmark"}
                  onChange={() => setFormData({ ...formData, status: 'notbookmark' })}
                />
                <span className='Problem_Status_Text'>Not Bookmarked</span>
              </label>
            </div>
          </div>
          <div className='Problem_Overlay_Bottom'>
            <button className='Problem_Overlay_Cancel' onClick={close}>Cancel</button>
            {handleSubmit && <button className='Problem_Overlay_Publish' onClick={handlePublish}>Publish Problem</button>}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContinueProblem;
