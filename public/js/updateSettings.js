/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

//type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url:
        type === 'password'
          ? //dev
            // ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
            // : 'http://127.0.0.1:3000/api/v1/users/updateMe',
            //production
            '/api/v1/users/updateMyPassword'
          : '/api/v1/users/updateMe',
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      if (type === 'data') {
        window.setTimeout(() => {
          location.assign('/me');
        }, 1500);
      }
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
