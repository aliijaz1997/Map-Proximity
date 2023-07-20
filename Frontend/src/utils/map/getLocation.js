export const getLocation = (coordinates) => {
  return new Promise((resolve, reject) => {
    const { latitude, longitude } = coordinates;
    const geocoder = new window.google.maps.Geocoder();
    const location = new window.google.maps.LatLng(latitude, longitude);

    geocoder.geocode({ location }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
        resolve(results[0]);
      } else {
        reject(new Error("Geocoder request failed."));
      }
    });
  });
};
