/*eslint-disable*/

const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiZ2l0dGVuZ2VyIiwiYSI6ImNrNmdzYmQ5ZDJtb3Uza3BqenhjeWltcHEifQ.-rC28navd7CS_JdLLBnpOA';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/gittenger/ck6gt8lpt21501iqvtend7q4h',
  scrollZoom: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  //create marker
  const el = document.createElement('div');
  el.className = 'marker';

  //add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  //add popup
  new mapboxgl.Popup({
    offset: 40
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  //extends map bounds for current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100
  }
});
