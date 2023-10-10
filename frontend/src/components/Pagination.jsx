import React, { useEffect } from "react";
import { Pagination, PaginationItem } from "@mui/material";
import { Link } from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux'
import { getPosts  } from "../actions/posts";

const Paginate = ({page}) => {
  
  const { numberOfPages } = useSelector((state) => state.postReducer)
  const dispatch = useDispatch()

  useEffect(()=>{
    if(page)  dispatch(getPosts (page));
  },[dispatch, page]);

  return (
    <Pagination
      classes={{}}
      page={Number(page)|| 1}
      count={numberOfPages}
      variant="outlined"
      color="primary"
      renderItem={(item) => (
        <PaginationItem {...item} component={Link} to={`/posts?page=${item.page}`} />
      )}
    />
  );
};

export default Paginate;
