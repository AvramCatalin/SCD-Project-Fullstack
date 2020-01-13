function loadUserData() {
    const selectedUser = document.querySelector('.selected');
    if (selectedUser === null) {
        alert('Trebuie sa selectezi un user!');
    }
    else {
        //ready state de 4 => Done
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                initMap(JSON.parse(this.response));
            }
        };
        var startDate = document.querySelector('#startDate').value;
        var endDate = document.querySelector('#endDate').value;

        xhttp.open('GET', `/users/${selectedUser.id}/locations?start=${startDate}&end=${endDate}`, true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send();
    }
}

function initMap(userLocation) {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: { lat: 46.778662, lng: 23.618571 }
    });
    if (userLocation.length !== 0) {
        userLocation.forEach(location => {
            setMarker(location, map);
        });
    }
}

function setMarker(location, map) {
    var marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.long },
        map: map
    });
    map.setCenter(marker.getPosition());
    map.panTo(marker.getPosition());
}