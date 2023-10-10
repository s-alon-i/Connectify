
import React, { useState } from 'react'
import jwt_decode from 'jwt-decode'

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signin, signup } from '../../actions/auth';

import Input from './Input';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

import { GoogleLogin } from '@react-oauth/google';

const style = {
  paper: {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem'
  },
  root: {
    '& .MuiTextField-root': {
      margin: '5px'
    },
  },
  avatar: {
    margin: '10px'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: '2rem'
  },
  submit: {
    margin: '20px 0 10px 0'
  },
  googleButton: {
    // marginBottom: theme.spacing(2),
    marginBottom: '10px'
  },
}

const initialState = { given_name: '', family_name: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);


  //------------ For sign in ---------------
  const switchMode = () => {
    setForm(initialState);
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  //------- After clicking on Google button ----------
  const handleCallbackSuccess = (credentialResponse) => {
    const token = credentialResponse?.credential;
    const result = jwt_decode(token);


    try {
      dispatch({ type: 'AUTH', data: { result, token } })
      navigate('/');
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      dispatch(signup(form, navigate));
    } else {
      dispatch(signin(form, navigate));
    }

  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <>
      <Container component="main" maxWidth="sm" sx={{ position: "relative", top: "8rem" }}>
        <Paper style={style.paper} elevation={3}>
          <Avatar style={style.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">{isSignup ? 'Sign up' : 'Sign in'}</Typography>
          <form style={style.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {isSignup && (
                <>
                  <Input name="given_name" label="given_name Name" handleChange={handleChange} autoFocus half />
                  <Input name="family_name" label="family_name" handleChange={handleChange} half />
                </>
              )}
              <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
              <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
              {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" />}
            </Grid>
            <Button type="submit" fullWidth variant="contained" color="primary"  size="large" style={style.submit}>
              {isSignup ? 'Sign Up' : 'Sign In'}
            </Button>

            <GoogleLogin
              onSuccess={handleCallbackSuccess}
              onError={() => {
                console.log('Login Failed');
              }}
            />

            <Grid container justify="flex-end">
              <Grid item>
                <Button onClick={switchMode}>
                  {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </>
  )
}

export default Auth