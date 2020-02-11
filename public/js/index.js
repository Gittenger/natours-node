/*eslint-disable*/

import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login } from './login';

//DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

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
