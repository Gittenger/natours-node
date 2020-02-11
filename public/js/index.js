/*eslint-disable*/

import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

//DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userSettingsForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

//DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = loginForm.querySelector('#email').value;
    const password = loginForm.querySelector('#password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (userSettingsForm) {
  userSettingsForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = userSettingsForm.querySelector('#name').value;
    const email = userSettingsForm.querySelector('#email').value;
    updateSettings({ name, email }, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    userPasswordForm.querySelector('.btn--save-password').textContent =
      'Updating...';

    //getting values
    const passwordCurrent = userPasswordForm.querySelector('#password-current')
      .value;
    const password = userPasswordForm.querySelector('#password').value;
    const passwordConfirm = userPasswordForm.querySelector('#password-confirm')
      .value;

    //update db
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    //reset values of password form input fields after update
    userPasswordForm.querySelector('.btn--save-password').textContent =
      'Save password';
    userPasswordForm.querySelector('#password-current').value = '';
    userPasswordForm.querySelector('#password').value = '';
    userPasswordForm.querySelector('#password-confirm').value = '';
  });
}
