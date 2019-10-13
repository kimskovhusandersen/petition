let markers = [];
const token = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

$.ajax({
    url: "/geolocations",
    method: "POST",
    data: { _csrf: token },
    success: function(geolocations) {
        let api = geolocations.pop();
        geolocations.forEach(obj => {
            markers.push({
                lat: parseFloat(obj.lat),
                lng: parseFloat(obj.lng)
            });
        });
        $.getScript(
            `https://maps.googleapis.com/maps/api/js?key=${api}&callback=initMap`
        );
    },
    error: function() {
        console.log("something went wrong");
    }
});

function initMap() {
    const options = {
        zoom: 4,
        center: { lat: 52.520008, lng: 13.404954 }
    };
    const map = new google.maps.Map(document.getElementById("map"), options);

    const addMarker = (lat, lng) => {
        const marker = new google.maps.Marker({
            position: { lat, lng },
            map
            // title: `{{first}} {{last}}`
        });
        // if (iconImage) {
        //     marker.setIcon(iconImage);
        // }
        // if (content) {
        //     const infoWindow = new google.maps.InfoWindow({
        //         content
        //     });
        //     marker.addListener("click", () => {
        //         infoWindow.open(map, marker);
        //     });
        // }
    };
    markers.forEach(obj => {
        addMarker(obj.lat, obj.lng);
    });
}
