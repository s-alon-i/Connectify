import React, { useState,useRef  } from "react";
import { Typography, TextField, Button } from "@mui/material";
import { useDispatch } from "react-redux";

import { commentPost } from "../actions/posts";

const classes = {
  commentsOuterContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  commentsInnerContainer: {
    height: "200px",
    overflowY: "auto",
    marginRight: "30px",
  },
};

const CommentSection = ({ post }) => {
  const user = JSON.parse(localStorage.getItem("profile"));
 
  const dispatch = useDispatch();
  const commentsRef = useRef();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post?.comments);

//   useEffect(() => {
//     commentsRef.current.scrollIntoView({ behavior: "smooth" });
//   }, [comments]);


  const handleComment = async () => {
    // we can also use useSelector but the issue is comments
    // are not updated automatically it will update when refresh tha page
    // we can do one thing we directly return the comments from commentPost fucntion
    // const { posts } = useSelector((state) => state.postReducer);

    const newComments = await dispatch(commentPost(`${user?.result?.name}: ${comment}`, post._id));

    setComment('');
    setComments(newComments);
    
    commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div style={classes.commentsOuterContainer}>
        <div style={classes.commentsInnerContainer}>
          <Typography gutterBottom variant="h6">
            {" "}
            Comments{" "}
          </Typography>
          {comments?.map((c, i) => (
            <Typography key={i} gutterBottom variant="subtitle1">
              <strong>{c.split(": ")[0]}</strong>
              {c.split(":")[1]}
            </Typography>
          ))}
          <div ref={commentsRef} />
        </div>
        {user?.result?.name && (
          <div style={{ width: "70%" }}>
            <Typography gutterBottom variant="h6">
              {" "}
              Write a comment{" "}
            </Typography>
            <TextField
              fullWidth
              rows={4}
              variant="outlined"
              label="Comment"
              multiline
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <br />
            <Button
              style={{ marginTop: "10px" }}
              fullWidth
              disabled={!comment.length}
              color="primary"
              variant="contained"
              onClick={handleComment}
            >
              Comment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
