/*eslint-disable*/

import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

//DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userSettingsForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

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

    //construct multipart form data
    const form = new FormData();
    form.append('name', userSettingsForm.querySelector('#name').value);
    form.append('email', userSettingsForm.querySelector('#email').value);
    form.append('photo', userSettingsForm.querySelector('#photo').files[0]);
    updateSettings(form, 'data');
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

if (bookBtn) {
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}
