import React, { useState , useEffect} from 'react';
import './AskQuery.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';


function AskQuery(props) {
    const [ques, setQues] = useState('');
    const [desc, setDesc] = useState('');

    const[profiles,setProfiles]=useState([]);
    const storedUserData = localStorage.getItem('user');
    const user = JSON.parse(storedUserData);


    
   
    

  useEffect(() => {
    axios.get(`https://new2-atbw.onrender.com/profile/${user.uid}`)
      .then(Profile => {

        console.log(Profile);
        setProfiles(Profile.data);
      })
      .catch(err => console.log(err));
  }, []);
  




    const handleSubmit = async () => {
        if (user) {
            if (ques && desc) {
                try {
                    const res = await axios.post('https://new2-atbw.onrender.com/addPost', {
                        authorEmail: profiles.email,
                        authorName: profiles.name,
                        autherimage: profiles.imageUrl,
                        question: ques,
                        description: desc,
                        postType: "QUERY"
                    });
                    console.log(res);
                    console.log("post request success");
                    window.location.reload();
                } catch (err) {
                    console.log(err);
                }
            } else {
                alert('Empty Question or Description');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'question') {
            setQues(value);
        } else {
            setDesc(value);
        }
    };

    return (
        <div className='boss'>
            <div className='ques'>
                <div className='q'>
                    Question
                    <textarea
                        name="question"
                        className='type-ques'
                        placeholder='How to increase my CP rating'
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div className='description'>
                    Description
                    <textarea
                        name="description"
                        className='desp'
                        placeholder='Add a Description'
                        onChange={handleChange}
                    ></textarea>
                </div>
            </div>
            <div className='cancel'>
                <button className='can' onClick={props.ShowMain}>Cancel</button>
                <button className='post' onClick={handleSubmit}>Post</button>
            </div>
        </div>
    );
}

export default AskQuery;
