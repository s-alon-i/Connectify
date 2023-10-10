import React,{useEffect} from 'react'
import { Paper, Typography, CircularProgress, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {  getPost } from '../actions/posts';
import CommentSection from './CommentSection';
import moment from 'moment'; 

const classes = {
  media: {
    borderRadius: '20px',
    objectFit: 'cover',
    width: '100%',
    maxHeight: '600px',

  },
  card: {
    display: 'flex',
    width: '100%',
  },
  section: {
    borderRadius: '20px',
    margin: '10px',
    flex: 1,
  },
  imageSection: {
    marginLeft: '20px',
    width: '50%',
  },
  recommendedPosts: {
    display: 'flex',
  },
  loadingPaper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '15px',
    height: '39vh',
  },
  commentsOuterContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  commentsInnerContainer: {
    height: '200px',
    overflowY: 'auto',
    marginRight: '30px',
  },
}

const ImageURL = 'https://images.unsplash.com/photo-1686226347032-b82efa11af93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0MHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=60'


const PostDetails = () => {
  const { post,posts, isLoading } = useSelector((state) => {
    return state.postReducer
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [dispatch, id]);


  const openPost = (_id) => {
    console.log(_id)
    navigate(`/posts/${_id}`);
  }

  if (isLoading) {
    return (
      <Paper  style={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== post?._id);

  return (
    <Paper style={{ padding: '20px', borderRadius: '15px', marginTop:'6rem' }}>
      <div style={classes.card}>
        <div style={classes.section}>
          <Typography variant="h3" component="h2">{post?.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post?.tags.map((tag) => `#${tag} `)}</Typography>
          <Typography gutterBottom variant="body1" component="p">{post?.message}</Typography>
          <Typography variant="h6">Created by: {post?.name}</Typography>
          <Typography variant="body1">{moment(post?.createdAt).fromNow()}</Typography>
          <Divider style={{ margin: '20px 0' }} />
          {/* <Typography variant="body1"><strong>Realtime Chat - coming soon!</strong></Typography> */}
          <Divider style={{ margin: '20px 0' }} />
       
          <Divider style={{ margin: '20px 0' }} />
        </div>
        <div style={classes.imageSection}>
          <img style={classes.media} src={post?.selectedFile || ImageURL} alt={post?.title} />
        </div>
      </div>
      <CommentSection post={post} />
      {!!recommendedPosts.length && (
        <div style={classes.section}>
          <Typography gutterBottom variant="h5">You might also like:</Typography>
          <Divider />
          <div style={classes.recommendedPosts}>
            {recommendedPosts.map(({ title, name, message, likes, selectedFile, _id }) => (
              <div style={{ margin: '20px', cursor: 'pointer' }} onClick={()=>openPost(_id)} key={_id}>
                <Typography gutterBottom variant="h6">{title}</Typography>
                <Typography gutterBottom variant="subtitle2">{name}</Typography>
                <Typography gutterBottom variant="subtitle2">{message}</Typography>
                <img src={selectedFile || ImageURL} width="200px" alt=""/>
                <Typography gutterBottom variant="subtitle1">Likes: {likes.length}</Typography>
              </div>
            ))}
          </div>
        </div>
      )}
    </Paper>
  )
}

export default PostDetails;