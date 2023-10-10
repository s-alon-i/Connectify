import * as api from '../api/index.js';

export const signin = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    dispatch({ type: "AUTH", data });
    navigate('/');
  } catch (error) {
    console.log(error);
  }
};

export const signup = (formData, navigate) => async (dispatch) => {
  console.log(formData);
  try {
    const { data } = await api.signUp(formData);
    console.log(data)
    dispatch({ type: "AUTH", data });
    navigate('/');
  } catch (error) {
    console.log(error);
  }
};