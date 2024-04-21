import React, { useState} from "react";
import "./Login.css";
import useSignIn from 'react-auth-kit/hooks/useSignIn'
import {useNavigate} from 'react-router-dom'
import MovieIcon from "@mui/icons-material/Movie";
import { Link } from "react-router-dom";
import axios from 'axios';

function Login() {
  const signIn = useSignIn()
  const navigate = useNavigate()
  const [showSignUp, setShowSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reenteredPassword, setReenteredPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loginResponseMessage, setLoginResponseMessage] = useState('');
  const [signupResponseMessage, setsignupResponseMessage] = useState('');

  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  const handleReturnToLoginClick = () => {
    setShowSignUp(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/login`, {
        username: username,
        password: password,
      });


      if (signIn({
        auth: {
          token: response.data.token,
        },
        // userState: {name: 'React User', uid: 123456}
      })){
        navigate('/secure')
     } else {
      console.log("error");
     }
      
    } catch (error) {
      setLoginResponseMessage(error.response.data.message);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password === reenteredPassword) {

      try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/register`, {
        username: username,
        password: password,
      });
      setsignupResponseMessage(response.data.message);
    } catch (error) {
      setsignupResponseMessage(error.response.data.message);
    }
    } else {
      // Passwords don't match - handle mismatch error
      setPasswordsMatch(false);
    }
    
  };

  return (
    <div className="Login-container">
      <div>
        <MovieIcon style={{ color: "red", margin: "50px" }} />
      </div>
      {showSignUp ? (
        <div className="Signup">
          <h2>Sign Up</h2>
          <form onSubmit={handleSignUp}>
      <div className="login-div">
        <input
          className="login-input"
          type="email"
          id="email"
          placeholder="Email address"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="login-div">
        <input
          className="login-input"
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="login-div">
        <input
          className="login-input"
          type="password"
          id="reenter-password"
          placeholder="Re-enter Password"
          value={reenteredPassword}
          onChange={(e) => setReenteredPassword(e.target.value)}
          required
        />
      </div>
      {!passwordsMatch && <p className="error-message">Passwords do not match</p>}
      <button className="signup-submit" type="submit">
        Sign Up
      </button>
    </form>
          {signupResponseMessage && <p style={{ color: 'red', margin: '0' }}>{signupResponseMessage}</p>}
          <div className="return-to-login" style={{ margin: "5px" }}>
            Already have an account? &nbsp;
            <Link onClick={handleReturnToLoginClick} style={{ color: "red" }}>
              Login
            </Link>
          </div>
        </div>
      ) : (
        <div className="Login">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="login-div">
              <input
                className="login-input"
                type="email"
                id="username"
                placeholder="Email address"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              ></input>
            </div>
            <div className="login-div">
              <input
                className="login-input"
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              ></input>
            </div>
            <button className="login-submit" type="submit">
              Login
            </button>
          </form>
          {loginResponseMessage && <p style={{ color: 'red', margin: '0' }}>{loginResponseMessage}</p>}
          <div className="signup-div" style={{ margin: "5px" }}>
            Don't have an account? &nbsp;
            <Link onClick={handleSignUpClick} style={{ color: "red" }}>
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;