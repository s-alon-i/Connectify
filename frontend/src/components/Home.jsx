import React, { useState } from "react";
import {
  Container,
  Grow,
  Grid,
  Paper,
  TextField,
  Button,
} from "@mui/material";

import { useDispatch } from "react-redux";
import { getPostsBySearch } from "../actions/posts";

import { useNavigate, useLocation } from "react-router-dom";
import { MuiChipsInput } from "mui-chips-input";

import Notes from "./AllPosts";
import Form from "./Form";
import Pagination from "./Pagination";

function useQuery() {
  // Suppose the link is -->  https://example.com?foo=1&bar=2
  // Using URLSearchParamas we get "?foo=1&bar=2"
  return new URLSearchParams(useLocation().search);
}

const Home = () => {
  const [currentId, setCurrentId] = useState(null);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tags, setTags] = useState([]); // for chip Inputs

  const query = useQuery();
  const page = query.get("page") || 1;
  const searchQuery = query.get("searchQuery");

  const searchPost = () => {
    if (search.trim() || tags) {
      dispatch(getPostsBySearch({ search, tags: tags.join(",") }));
      navigate(
        `/posts/search?searchQuery=${search || "none"}&tags=${tags.join(",")}`
      );
    } else navigate("/");
  };

  const handleKeyPress = (e) => {
    // That e.keycode === 13 means enter
    if (e.keyCode === 13) {
      searchPost();
    }
  };

  const handleDeleteChip = (tagToDelete) =>
    setTags(tags.filter((tag) => tag !== tagToDelete));
    
  const handleAddChip = (tagValue) => setTags([...tags, tagValue]);

  return (
    <>
      <Grow in>
        <Container maxWidth="xl" sx={{ position: "relative", top: "8rem", marginBottom:'9rem' }}>
          <Grid
            container
            justify="space-between"
            alignItems="stretch"
            spacing={3}
            sx={{ width :"100%" }}
          >
            <Grid item xs={12} sm={6} md={8}>
              <Notes setCurrentId={setCurrentId} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper style={{ padding: "1rem" }}>
                <TextField
                  onKeyDown={handleKeyPress}
                  name="search"
                  variant="outlined"
                  label="Search Memories"
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <MuiChipsInput
                  value={tags}
                  onDeleteChip={(chip) => handleDeleteChip(chip)}
                  onChange={(chip) => handleAddChip(chip)}
                  style={{ margin: "10px 0",width: "100%"  }}
                  hideClearAll
                />
                <Button
                  onClick={searchPost}
                  variant="contained"
                  color="secondary"
                  size="large"
                  fullWidth
                >
                  Search
                </Button>
              </Paper>
              <Form currentId={currentId} setCurrentId={setCurrentId}/>
              {!searchQuery && !tags.length && (
                <Paper sx={{padding:'10px', marginTop:2}}>
                  <Pagination page={page} />
                </Paper>
              )}
            </Grid>
          </Grid>
        </Container>
      </Grow>
    </>
  );
};

export default Home;
