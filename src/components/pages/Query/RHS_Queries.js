// import React,{useState,useEffect} from 'react'
// import './RHS_Queries.css'
// import axios from 'axios'

// function RHS_Queries(props) {

//   const [Show_Queries,setShow_Queries]=useState(true)
//   const [ShowMy_Queries,setShowMy_Queries]=useState(true)

//   const AddClicked_Queries = () => {
//       setShow_Queries(!Show_Queries)
//   }

//   const [myQueries,setMyQueries] = useState([])

//   useEffect(() => {
//     let isMounted = true;
//     async function fetchMyQueries() {
//       const resp = await axios.post('http://localhost:8080/api/myQueryPosts',{userEmail : JSON.parse(localStorage.getItem('msalAccount')) });
//       console.log(resp.data);
//       if(isMounted){
//         resp.data.forEach(element => {
//           setMyQueries(myQueries => [...myQueries,element])
//           console.log(element);
//         });
//       }
      
//     }
//     fetchMyQueries();


//     console.log("FIRE :: ",myQueries);
//     return () => {
//       isMounted = false;
//     };
//   },[])

//   return (
//     <div className='RHS_Queries'>
//         <div className='RHS_Queries-Biggest-Container'>

//           <div className='RHS_Queries-Add' onClick={props.ShowOrNotAnswer_Queries}>
//                  <div className='RHS_Queries-Add-Ask-Question'>Ask Question</div>
//                  <button className='RHS_Queries-Add-Ask-Question-Add-Button'
                   
//                  >
//                     <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
//                         <path d="M13.75 16.25H6.25V13.75H13.75V6.25H16.25V13.75H23.75V16.25H16.25V23.75H13.75V16.25Z" fill="black"/>
//                     </svg>
//                  </button>
//           </div>

          
//           {
//             ShowMy_Queries ? (
              
  
//               <div className='RHS_Queries-My'>

//              <div className='RHS_Queries-My-Upper-Part'>

//                 <button className='RHS_Queries-Add-My-Arrow'>
//                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="30" viewBox="0 0 14 30" fill="none">
//                       <path d="M2 27L12 16L2 6" stroke="#656565"/>
//                    </svg>
//                 </button>

//                 <div className='RHS_Queries-My-Text'>My Queries</div>

//                 <div className='RHS_Queries-My-Text-View-All'>View All</div>

//              </div>

//              <div className='RHS_Queries-My-Content'>

//              {myQueries.map(elm => 
//                 <div className='RHS_Queries-My-Content-Main'>  
//                 <div className='RHS_Queries-My-Content-Text'>  {elm.question} </div>  
//                 <div className='RHS_Queries-My-Content-Text-Below-Part'>    
//                 <div className='RHS_Queries-My-Content-Text-Below-Part-LHS'>    
//                 <div className='RHS_Queries-My-Content-Text-Below-Part-Circle-Img'>       
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"> < circle cx="12" cy="12" r="12" fill="#D9D9D9"/> </svg> 
//                 </div> 
//                 <div className='RHS_Queries-My-Content-Text-Below-Part-Club-Name'>  {JSON.parse(localStorage.getItem('msalAccount'))['name']} </div> 
//                 </div>    
//                 <div className='RHS_Queries-My-Content-Text-Below-Part-Date'> {new Date(elm.createdAt).toLocaleString()} </div> </div></div>
//               )}

//              </div>
             
//           </div>


//             ) : null
//           }


//         </div>
//     </div>
//   )
// }

// export default RHS_Queries

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RHS_Queries.css';

function RHS_Queries(props) {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const [ShowMy_Queries, setShowMy_Queries] = useState(true);
  const [myQueries, setMyQueries] = useState([]);
  useEffect(() => {
    async function fetchMyQueries() {
      try {
        const storedUserData = localStorage.getItem('user');
        if (!storedUserData) {
          console.error('User data not found in localStorage');
          return;
        }
        const user = JSON.parse(storedUserData);
        const response = await axios.get(`${SERVER_URL}/getqueries/${user.email}`);
        
        // Check if the response status is 'success' and if it contains the 'queries' array
        if (response.data.status === 'success' && Array.isArray(response.data.queries)) {
          setMyQueries(response.data.queries);
        } else {
          console.error('Invalid API response:', response.data);
        }
      } catch (error) {
        console.error('Error fetching queries:', error);
        // Set an error state or display an error message to the user
      }
    }
  
    fetchMyQueries();
  
    return () => {
      // Cleanup
    };
  }, []);


  const openPost = (id) => {
    console.log("Opening post with ID:", id);
    sessionStorage.setItem('pidVal', id);
    const url = `/detailquery?id=${id}`;
    // Navigate to the constructed URL
    window.location.href = url;
};
  
  return (
    <div className='RHS_Queries'>
    <div className='RHS_Queries-Biggest-Container'>
      <div className='RHS_Queries-Add' onClick={props.ShowOrNotAnswer_Queries}>
        <div className='RHS_Queries-Add-Ask-Question'>
          <h1 className='addit'>Ask</h1> 
          <h1 className='addit'>+</h1>
        </div>
      </div>
    </div>
  </div>
  
  );
}

export default RHS_Queries;
