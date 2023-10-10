import React from 'react';
import Note from './SingleNote';
import { CircularProgress, Grid } from '@mui/material';

import { useSelector } from 'react-redux';
// help us to reterive tha data from global store

const Notes = ({ setCurrentId }) => {
  const { posts, isLoading } = useSelector((state) => {
    return state.postReducer
  });

  
  if (!posts?.length && !isLoading) return "No Posts"

  return (
    isLoading ? <CircularProgress /> : (
      <Grid container alignItems="stretch"  spacing={3}>
        {posts?.map((post) => (
          <Grid key={post._id} item xs={12} sm={6} md={6}  >
            <Note post={post} setCurrentId={setCurrentId} />
          </Grid>
        ))}
      </Grid>
    )
  );
};

export default Notes