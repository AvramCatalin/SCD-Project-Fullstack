(function () {
  'use strict';
  //pentru a nu putea folosi variabile nedeclarate (use strict)
  window.addEventListener('load', function () {
    // luam toate functiile la care vrem sa adaugam form validator
    let form = document.querySelector('form');
    // le parcurgem si le adaugam event listener de submit (nu le lasam sa fie transmise by default)
    form.addEventListener('submit', function (event) {
      //oprim event-ul (ii dam cancel)
      event.preventDefault();
      //opreste propagarea (bubble up)
      event.stopPropagation();
      if (form.checkValidity() === true) {
        formToJSON();
      }
      form.classList.add('was-validated');
    });
  });
})();

function formToJSON() {
  let form = document.querySelector('form');
  let formData = new FormData(form);
  var object = {};
  formData.forEach(function (value, key) {
    object[key] = value;
  });
  var json = JSON.stringify(object);
  pathSetter(json);
}

function pathSetter(json) {
  var path = window.location.pathname;

  var nextPagePath;
  var errorPath;
  var postPath;

  if (path === '/login' || path === '/login/') {
    nextPagePath = '/monitor';
    errorPath = '/login/?error=Date de autentificare gresite!';
    postPath = '/login';
  }
  else if (path === '/register' || path === '/register/') {
    nextPagePath = '/login';
    errorPath = '/register/?error=Exista deja un utilizator cu acest email!';
    postPath = '/admin'
  }
  sendJSON(nextPagePath, errorPath, postPath, json)
}

function sendJSON(nextPagePath, errorPath, postPath, json) {
  //ready state de 4 => Done
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      window.location.replace(nextPagePath);
    }
    else {
      if (this.status == 404) {
        window.location.replace(errorPath);
      }
    }
  };
  xhttp.open('POST', postPath, true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(json);
}