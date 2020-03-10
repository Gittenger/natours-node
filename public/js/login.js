/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const login = async (email, password) => {
  //   console.log(email, password);

  try {
    const res = await axios({
      method: 'POST',
      //dev
      //url: 'http://127.0.0.1:3000/api/v1/users/login'
      //production
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      //dev
      //url: 'http://127.0.0.1:3000/api/v1/users/logout'
      //production
      url: '/api/v1/users/logout'
    });
    //force reload from server instead of from cache
    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
