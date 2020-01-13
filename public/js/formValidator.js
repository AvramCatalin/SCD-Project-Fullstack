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
  sendJSON(json);
}

function sendJSON(json) {
  //ready state de 4 => Done
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      window.location.replace('/monitor');
    }
    else {
      if (this.status == 400) {
        window.location.replace('/login/?error=Date de autentificare gresite!');
      }
    }
  };
  xhttp.open('POST', '/login', true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(json);
}