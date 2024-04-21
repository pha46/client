import React, { useState, useEffect } from "react";
import './Home.css';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Card, CardContent } from "@mui/material";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import axios from "axios";

function Movies() {
      // State variables
  const [trendingContent, setTrendingContent] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [executedSearchQuery, setExecutedSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({data: {results: [], total_results: '', total_pages: ''}});
  const [searchPage, setSearchPage] = useState(1);
  const [loading, setLoading] = useState(true);
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

// Fetch trending content with authorization token
const fetchTrendingContent = () => {
  const requestOptions = {
    headers: {
      Authorization: `${getCookie('_auth')}`,
    },
    params: {
      page: 1
    }
  };

  return axios.get(`${process.env.REACT_APP_BASE_URL}/api/popularMovies`, requestOptions)
    .then(response => {
      setTrendingContent(response.data.results);
    })
    .catch(error => {
      console.log(error);
    });
};

useEffect(() => {
  fetchTrendingContent()
}, []);



const handleSearch = async (page) => {
  setLoading(true);
  if (searchQuery.trim() !== '' || searchQuery !== null) {
    const requestOptions = {
      headers: {
        Authorization: `${getCookie('_auth')}`
      },
      params: {
        page: page, // Use the passed page value here
        query: searchQuery
      }
    };

    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/movies`, requestOptions);
      setSearchResults(data);
      setSearchPage(page); // Update the searchPage state after fetching results
      setExecutedSearchQuery(searchQuery); // Store the executed search query separately
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
};

const previous = () => {
  if (searchPage > 1) {
    const prevPage = searchPage - 1;
    handleSearch(prevPage);
  }
};

const next = () => {
  const nextPage = searchPage + 1;
  handleSearch(nextPage);
};

const handleKeyDown = (event) => {
  if (event.key === 'Enter') {
    setSearchPage(1);
    handleSearch(1);
  }
}

  // Get media type icon
  const getMediaTypeIcon = (mediaType) => {
    if (mediaType === "movie") {
      return <MovieIcon style={{ fontSize: 14, color: '#ffffff' }} />;
    } else if (mediaType === "tv") {
      return <TvIcon style={{ fontSize: 14, color: '#ffffff' }} />;
    }
    return null;
  };

  // Fetch bookmarks upon component mount
useEffect(() => {
  const fetchBookmarks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/auth/bookmarks`, {
        headers: {
          Authorization: `${getCookie('_auth')}`
        }
      });
      setBookmarkedItems(response.data.map(bookmark => bookmark.id));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    }
  };

  fetchBookmarks();
}, []);

const handleBookmark = async (id, backdrop_path, name, date) => {
  try {
    const mediaType = 'movie';
    const token = `${getCookie('_auth')}`;
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/bookmark`, { id, mediaType, backdrop_path, name, date }, {
      headers: {
        'Authorization': token
      }
    });
    setBookmarkedItems([...bookmarkedItems, id]);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const handleUnbookmark = async (id) => {
  try {
    const mediaType = 'movie';
    const token = `${getCookie('_auth')}`
    const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/auth/bookmark/${id}&${mediaType}`, {
      headers: {
        'Authorization': token
      }
    });
    setBookmarkedItems(bookmarkedItems.filter(item => item !== id));
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

    return(
      <>
      <div className="container">
          <div className="search">
              <SearchOutlinedIcon
                  sx={{color:'#FFFFFF', width:'50px', height:'100%', cursor:'pointer'}}/>
              <input
                  type="text"
                  className="search-movies1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for Movies"
              >
              </input>
          </div>

{searchQuery.length === 0 && (
<>
<div>
<h2 style={{ fontWeight: 'normal' }}>Movies</h2>
<div>
  <div className="card-container2" style={{gap: '0px'}}>
    {trendingContent.map((content, index) => (
      <Card
        key={`${content.id}_${index}`}
        className="card2"
        style={{margin: '10px', backgroundImage: `url(https://image.tmdb.org/t/p/w342${content.backdrop_path})` }}
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
                if (bookmarkedItems.includes(content.id)) {
                  handleUnbookmark(content.id, content.mediaType);
                } else {
                  handleBookmark(
                    content.id,
                    content.backdrop_path,
                    content.name || content.title,
                    content.release_date ? content.release_date.slice(0, 4) : (content.first_air_date ? content.first_air_date.slice(0, 4) : '')
                  );
                }
              }}
            >
              {bookmarkedItems.includes(content.id) ? <BookmarkIcon className="bookmark-active" style={{ color: '#FFFFFF' }} /> : 
              <BookmarkBorderOutlinedIcon
               className="bookmark-icon"
               style={{ color: bookmarkedItems.includes(content.id) ? 'black' : 'initial' }} />}
            </button>
        <CardContent className="card-content" style={{ color: '#FFFFFF' }}>
          <p style={{ margin: '0', padding: '0' }}>
            {content.release_date ? content.release_date.slice(0, 4) : (content.first_air_date ? content.first_air_date.slice(0, 4) : '')}
            &nbsp;<span className="bullet">&#8226;&nbsp;</span>
            {getMediaTypeIcon(content.media_type)}&nbsp;
            {content.media_type === 'movie' ? 'Movie' : 'TV Series'}
          </p>
          <h3 style={{ margin: '0', padding: '0' }}>{content.title || content.name}</h3>
        </CardContent>
      </Card>
    ))}
  </div>
</div>
</div>
</>
)} 

{searchQuery.length !== 0 && (

<div className="search-results">
            
            {loading ? (
              <div style={{display:"flex", fontSize:'large', justifyContent: 'center', alignItems:'center', width:'80%' , height: '50vh'}}>Search for Movies...</div>
          ) : (
            <div>
              <h2 style={{ fontWeight: 'normal' }}>
                {executedSearchQuery && `Found ${searchResults.data.total_results} results for '${executedSearchQuery}'`}
              </h2>
            <div className="card-container2">
              {searchResults.data.results.map((content) => (
              <div key={content.id} className="card-wrapper">
                <Card
                  className="card2"
                  style={{
                    backgroundImage: content.backdrop_path
                      ? `url(https://image.tmdb.org/t/p/w342${content.backdrop_path})`
                      : 'none',
                  }}
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
                if (bookmarkedItems.includes(content.id)) {
                  handleUnbookmark(content.id, content.mediaType);
                } else {
                  handleBookmark(
                    content.id,
                    content.backdrop_path,
                    content.name || content.title,
                    content.release_date ? content.release_date.slice(0, 4) : (content.first_air_date ? content.first_air_date.slice(0, 4) : '')
                  );
                }
              }}
            >
              {bookmarkedItems.includes(content.id) ? <BookmarkIcon className="bookmark-active" style={{ color: '#FFFFFF' }} /> : 
              <BookmarkBorderOutlinedIcon
               className="bookmark-icon"
               style={{ color: bookmarkedItems.includes(content.id) ? 'black' : 'initial' }} />}
            </button>
                    <CardContent>
                      {!content.backdrop_path && (
                        <div 
                          style={{
                            backgroundColor:'gray',
                            width:'100%',
                            height:'100%',
                            margin:'0',
                            padding: '0',
                          }}>
                          <ImageOutlinedIcon style={{ fontSize: 48, color: '#FFFFFF' }} />
                        </div>
                      )}
                    </CardContent>
                </Card>
                {content.backdrop_path && ( // Implement lazy loading for the image
                  <img
                    loading="lazy" // Adding lazy loading attribute
                    src={`https://image.tmdb.org/t/p/w342${content.backdrop_path}`}
                    alt={content.title || content.name}
                    style={{ display: 'none' }} // Hide the image initially
                  />
                )}
                  <p style={{ margin: '0', padding: '0' }}>
                  {content.release_date ? content.release_date.slice(0, 4) : (content.first_air_date ? content.first_air_date.slice(0, 4) : '')}
                    &nbsp;<span className="bullet">&#8226;&nbsp;</span>
                  {getMediaTypeIcon(content.media_type)}&nbsp;
                  {content.media_type === 'movie' ? 'Movie' : 'TV Series'}
                  </p>
                <h3 style={{ margin: '0', padding: '0' }}>{content.title || content.name}</h3>
              </div>
              ))}
            </div>
            <div>
              <button onClick={previous} disabled={searchPage === 1}>
                Previous
              </button>
              <span>
                {searchPage} of {searchResults.data.total_pages}
              </span>
              <button onClick={next}>Next</button>
            </div>
            </div>)}
            
            </div>
)}
      </div>
      </>
    );
}

export default Movies;