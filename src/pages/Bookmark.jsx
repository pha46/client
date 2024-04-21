import React, { useState, useEffect } from "react";
import './Home.css';
import { Card, CardContent } from "@mui/material";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import axios from "axios";

function Bookmark() {
    const [bookmarkedItems, setBookmarkedItems] = useState([]);

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

           // Fetch bookmarks upon component mount
useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/bookmarks`, {
          headers: {
            Authorization: `${getCookie('_auth')}`
          }
        });
        setBookmarkedItems(response.data);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
      }
    };
  
    fetchBookmarks();
  }, []);
  
  const handleUnbookmark = async (id, mediaType) => {
    try {
      const token = getCookie('_auth');
      await axios.delete(`${process.env.REACT_APP_BASE_URL}/auth/bookmark/${id}&${mediaType}`, {
        headers: {
          Authorization: token
        }
      });
      // Filter out the unbookmarked item and update the state
      const updatedBookmarkedItems = bookmarkedItems.filter(item => item.id !== id);
      setBookmarkedItems(updatedBookmarkedItems);
    } catch (error) {
      console.log(error);
    }
  };
  

      console.log(bookmarkedItems);
        // Get media type icon
        const getMediaTypeIcon = (mediaType) => {
            if (mediaType === "movie") {
              return <MovieIcon style={{ fontSize: 14, color: '#ffffff' }} />;
            } else if (mediaType === "tv") {
              return <TvIcon style={{ fontSize: 14, color: '#ffffff' }} />;
            }
            return null;
          };

    return(
        <div className="container">
            {bookmarkedItems.length === 0 ? (
                <h2
                    style={{
                        display:'flex',
                        position:'relative',
                        justifyContent:'center',
                        marginTop:'100px'
                    }}
                >Please Bookmark your favourite Movies & TV Shows, Your Bookmarks will display here !</h2>
            ) : (
                <div className="card-container2" style={{gap: '0px'}}>
                 {bookmarkedItems.map((content, index) => (
      <Card
        key={`${content.id}_${index}`}
        className="card2"
        style={{
            margin: '10px',
            marginTop:'50px',
            backgroundImage: `url(https://image.tmdb.org/t/p/w342${content.backdrop_path})` }}
      >
        <button
              className={`bookmark-icon-cover ${bookmarkedItems.includes(content.id) ? 'active' : ''}`}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                left: '220px',
                right: '0px'
              }}
              onClick={() => {
                    handleUnbookmark(content.id, content.mediaType);
              }}
            >
        
              <DeleteForeverOutlinedIcon
               className="bookmark-icon"
               style={{ color: bookmarkedItems.includes(content.id) ? 'black' : 'initial' }} />
            </button>
        <CardContent className="card-content" style={{ color: '#FFFFFF' }}>
          <p style={{ margin: '0', padding: '0' }}>
            {content.date}
            &nbsp;<span className="bullet">&#8226;&nbsp;</span>
            {getMediaTypeIcon(content.media_type)}&nbsp;
            {content.media_type === 'movie' ? 'Movie' : 'TV Series'}
          </p>
          <h3 style={{ margin: '0', padding: '0' }}>{content.name}</h3>
        </CardContent>
      </Card>
                 ))}
            </div>
            )}
            
        </div>
    );
}

export default Bookmark;