import React, { useState } from "react";
import './Navbar.css';
import { NavLink, useNavigate} from "react-router-dom";
import MovieIcon from '@mui/icons-material/Movie';
import GridViewSharpIcon from '@mui/icons-material/GridViewSharp';
import TheatersIcon from '@mui/icons-material/Theaters';
import TvIcon from '@mui/icons-material/Tv';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import axios from "axios";

function Navbar() {
    const [key, setKey] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }
    
      function deleteAllCookies() {
        var cookies = document.cookie.split("; ");
      
        for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i];
          var eqPos = cookie.indexOf("=");
          var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
      }

    function refreshComponent() {
        setKey(key + 1);
    }

    const openPopup = () => {
        setShowPopup(true);
      };
    
    const closePopup = () => {
        setShowPopup(false);
      };

      const handleLogout = async () => {
  try {
    const authToken = getCookie('_auth');
    console.log('Auth Token:', authToken);

    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/logout`, {
      token: authToken
    });

    console.log('Response Status:', response.status);

    if (response.status === 200) {
      // Delete all cookies upon successful logout
      deleteAllCookies();

      //navigate to home page
      navigate('/');
      // Refresh the page
      window.location.reload();
    } else {
      alert('Logout failed');
    }
  } catch (error) {
    console.error('Error during logout:', error);
    alert('An error occurred during logout');
  }

  closePopup();
};

    return (
        <div key={key} className="nav-container">
            <div className="logo">
                <MovieIcon
                    sx={{color:'red', width:'100%'}} 
                />
            </div>
            <div className="navbar">
            <nav>
                <ul>
                    <li>
                        <NavLink to="/secure/home" onClick={refreshComponent} activeClassName="active">
                        <GridViewSharpIcon className="menu-icon"
                            sx={{color:'#5A698F', width:'100%'}}
                        />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/secure/movies" onClick={refreshComponent} activeClassName="active">
                            <TheatersIcon className="theater1"
                                sx={{color:'#5A698F', width:'100%'}}
                            />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/secure/series" onClick={refreshComponent} activeClassName="active">
                            <TvIcon className="series1"
                                sx={{color:'#5A698F', width:'100%'}}
                            />
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/secure/bookmark" activeClassName="active" onClick={refreshComponent}>
                                <BookmarkIcon className="bookmark1"
                                    sx={{color:"#5A698F", width:'100%'}}
                                />
                        </NavLink>
                    </li>
                </ul>
            </nav>
            </div>
            <div className="login-profile">
            <div className="show-popup" onClick={openPopup}></div>

            {/* Pop-up for logout with smooth animation */}
            {showPopup && (
              <div className="logout-popup">
                <div className="popup-content"
                  style={{
                    display:'flex',
                    flexDirection:'column',
                    alignItems:'center',
                    justifyContent:'space-between',
                    gap:'15px'
                  }}
                >
                  <button
                    style={{
                      fontSize:'12px',
                      fontWeight:'bold',
                      backgroundColor:'#FFFFFF',
                      color:'#10141E',
                      border:'none',
                      cursor:'pointer'
                    }}
                   onClick={handleLogout}>Logout</button>
                  <button style={{backgroundColor:'transparent', color:'#FC4747', border:'none', fontWeight:'bolder', fontSize:'20px', cursor:'pointer'}} onClick={closePopup}>X</button>
                </div>
              </div>
            )}</div>
        </div>
    )
}

export default Navbar;