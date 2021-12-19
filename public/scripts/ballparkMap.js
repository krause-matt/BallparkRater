mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [long, lat],
  zoom: 15
});

const marker = new mapboxgl.Marker({
  color: "#FF0000"
})
.setLngLat([long, lat])
.addTo(map);