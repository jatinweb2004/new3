import React from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./About.css";
import { useNavigate } from "react-router-dom";
import { signInWithMicrosoft, signOut, auth } from "../../../auth/firebase";

const About = () => {
  const [user, setUser] = useState(null);
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

  // Function to handle sign-in
  const handleSignIn = async () => {
    try {
      await signInWithMicrosoft();
      navigate("/EditProfile");
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle sign-out
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  // Use the useRef hook to create a reference to the animated div
  const animatedDivRef = useRef(null);

  // Use the useEffect hook to set up the Intersection Observer
  useEffect(() => {
    const options = {
      threshold: 0.5, // Trigger when 50% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (animatedDivRef.current) {
      observer.observe(animatedDivRef.current);
    }

    // Clean up the observer on component unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="About-boss">
      {/* NAVBAR  */}
      <nav className="Navbar-abt">
        <div className="About-logo">Zcoder</div>
        {user ? (
          <>
            {/* Display user information and sign-out button */}
            <p className="user-1">Welcome, {user.displayName}</p>
            {/* <p className="email">Email: {user.email}</p> */}
            <button className="btn" onClick={handleSignOut}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <button className="querie" onClick={handleSignIn}>
              Login
            </button>
            <button className="add" onClick={handleSignIn}>
              Signup with Outlook
            </button>
          </>
        )}
      </nav>

      {/* MAIN CONTENT  */}
      <div className="about-main">
        <div className="welcome">
          <div className="well-content">
            {user ? (
              <>
                {/* Display user information and sign-out button */}
                <p className="user-2">Welcome, {user.displayName}</p>
                {/* <p className="email">Email: {user.email}</p> */}
                {/* <button className="btn" onClick={handleSignOut}>Sign out</button> */}
                <div className="well-btn">
                  <Link to="/Contest" className="sign-up">
                    Contest
                  </Link>
                  <Link to="/Editprofile" className="sign-up">
                    Complete your Profile
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="well-btn">
                  <button className="sign-up" onClick={handleSignIn}>
                    Signup with Outlook
                  </button>
                  <button className="log" onClick={handleSignIn}>
                    Login
                  </button>
                </div>
              </>
            )}
          </div>




          <div class="container--about">
        <h1 class="h1--about">About ZCoder</h1>

        <div class="mission--about">
            <h2 class="h2--about">Our Mission</h2>
            <p class="p--about">At ZCoder, we believe in empowering coders of all levels by providing a comprehensive platform where they can enhance their skills, share knowledge, and connect with a like-minded community. Our goal is to foster a collaborative learning environment that supports both individual growth and collective improvement in the coding community.</p>
        </div>

        <div class="features--about">
            <h2 class="h2--about">What We Offer</h2>

            <div class="feature--about">
                <h3 class="h3--about">Personalized Profiles</h3>
                <p class="p--about">ZCoder allows you to craft a unique coding identity. Customize your profile, showcase your skills, and connect with fellow coders. Your profile is your digital resume – make it stand out and let others know about your achievements and expertise.</p>
            </div>

            <div class="feature--about">
                <h3 class="h3--about">Collaborative Learning</h3>
                <p class="p--about">Engage in meaningful exchanges and feedback on solutions. At ZCoder, we understand the power of community in learning. Comment on solutions, share your insights, and learn from the diverse perspectives of others. Our platform encourages collaborative learning and peer-to-peer support.</p>
            </div>

            <div class="feature--about">
                <h3 class="h3--about">Comprehensive Calendar</h3>
                <p class="p--about">Stay on top of your coding game with our comprehensive calendar. Keep track of upcoming coding contests, events, and important dates. Never miss an opportunity to challenge yourself and showcase your skills.</p>
            </div>
        </div>

        <div class="additional-features--about">
            <h2 class="h2--about">Additional Features</h2>

            <div class="feature--about">
                <h3 class="h3--about">Rooms</h3>
                <p class="p--about">Interact with other users in real-time through our Rooms feature. Whether you need help with a problem, want to discuss new coding trends, or just chat about tech, our Rooms provide the perfect space for interaction and collaboration.</p>
            </div>

            <div class="feature--about">
                <h3 class="h3--about">Inbuilt Code Editor</h3>
                <p class="p--about">Write, test, and debug your code right on the platform with our inbuilt code editor. Enjoy real-time output and streamline your coding process without the need to switch between different applications. Our code editor supports multiple languages and provides a seamless coding experience.</p>
            </div>
        </div>

        <div class="join--about">
            <h2 class="h2--about">Join Us</h2>
            <p class="p--about">Become a part of the ZCoder community today and take your coding journey to the next level. Whether you are a beginner looking to learn or an experienced coder eager to share your knowledge, ZCoder is the place for you.</p>
        </div>
    </div>




        </div>
      </div>



      {/* PLZ LOGIN  */}
      {/* <div className="abt-login">
              <Link to ="/Login" className="bottom-log1">Sign Up with Outlook</Link>
              <Link to ="/Login" className="bottom-log2">Login</Link>
            </div> */}

      {/* <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
            <script>
              AOS.init();
            </script> */}
    </div>
  );
};
export default About;
