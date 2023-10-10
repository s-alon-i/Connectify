import React, { useState, useEffect } from "react";
import { TextField, Button, Paper, Typography } from "@mui/material";
import { createPost, updatePost } from "../actions/posts";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FileBase from "react-file-base64";
import { MuiChipsInput } from "mui-chips-input";

const classes = {
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  fileInput: {
    width: '97%',
    margin: '10px 0',
  },
  buttonSubmit: {
    margin: "10 0",
  },
}

const Form = ({ setCurrentId, currentId }) => {
 
  const [chips, setChips] = useState([]) 
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: [],
    selectedFile: "",
  });
  const post = useSelector((state) =>
    currentId ? state.postReducer.posts?.find((e) => e._id === currentId) : null
  );
  const user = JSON.parse(localStorage.getItem("profile"));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({ title: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = user?.result?.given_name + " " + user?.result?.family_name;
    if (currentId) {
     if(postData?.title) dispatch(updatePost(currentId, { ...postData, name: name,tags:chips }));
    }
    else dispatch(createPost({ ...postData, name: name,tags:chips },navigate));
  
    setChips([]);
    clear();
  };

  const handleAddChip = (newChips) => {
    setChips(newChips)
  }

  const handleDeleteChip = (chipToDelete) => {
    setPostData({
      ...postData,
      tags: postData.tags.filter((tag) => tag !== chipToDelete),
    });
  };


  if (!user?.result?.name) {
    return (
      <Paper sx={{marginTop:'4px',padding:'10px'}}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own memories and like other's memories.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper style={{ padding: "1rem",margin:'10px 0' }}>
      <form
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
      >
        <Typography variant="h5" sx={{textAlign:'center'}}>
          {currentId ? `Editing : ${postData.title}` : "Creating a Memory"}
        </Typography>

        <TextField
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
          sx={{margin:'10px 0'}}
        />

        <TextField
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          multiline
          rows={4}
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />
        <div style={{ padding: "3px 0" }}>
          <MuiChipsInput
            value={chips}
            onDeleteChip={(chip) => handleDeleteChip(chip)}
            onChange={(chip) => handleAddChip(chip)}
            style={{ margin: "10px 0" ,width: "100%" }}
            // hideClearAll
            hideClearAll={false} 
   
          />
        </div>
        <div style={classes.fileInput}>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
          style={{ margin: "10px 0" }}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          fullWidth
          onClick={clear}
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;
