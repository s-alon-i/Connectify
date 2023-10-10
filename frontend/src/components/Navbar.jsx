import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppBar, Typography, Toolbar, Avatar, Button } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";

const classes = {
  appBar: {
    marginBottom: "30px 0",
    padding: "10px 50px",
  },

  heading: {
    textDecoration: 'none',
    fontWeight: 300,
    cursor: 'pointer',
  },

  toolbar: {
    backgroundColor: "red"
  },
  profile: {
    display: "flex",
    justifyContent: "space-between",
    width: "400px",
  },
  userName: {
    display: "flex",
    alignItems: "center",
  },
  brandContainer: {
    display: "flex",
    alignItems: "center",
  },
};

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/auth");
    setUser(null);
  };
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  return (
    <AppBar
      position="fixed"
      color="inherit"
      style={classes.appBar}
      sx={{ display: 'flex',flexDirection: {xs:"column",md:"row"},justifyContent:'space-between',alignItems:'center'}}
    >
      <Typography
        component={Link}
        to="/"
        style={classes.heading}
        sx={{ cursor: "pointer",fontSize:{xs:'30px',md:'50px'},fontWeight:'bold' }}
      >
        Connectify
      </Typography>

      <Toolbar sx={{ width:{xs:'350px',md:'400px'}}}>
        {user?.result ? (
          <div style={classes.profile}>
            <Avatar
              style={classes.purple}
              alt={user?.result.name}
              src={user?.result?.picture}
            >
              {user?.result.name.charAt(0)}
            </Avatar>
            <Typography style={classes.userName} variant="h6">
              {user?.result.name}
            </Typography>
            <Button
              variant="contained"
              className={classes.logout}
              color="secondary"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            component={Link}
            to="/auth"
            variant="contained"
            color="primary"
          >
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
