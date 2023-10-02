export const getNearestDriver = ({ driversList, pickupLocation }) => {
  let nearestDriver = null;
  let minDistanceInMeters = Infinity;

  driversList.forEach((driver) => {
    const driverData = driver.info;
    if (
      driverData.driverStatus === "engaged" ||
      driverData.driverStatus === "offline"
    ) {
      return;
    }
    const point1 = new window.google.maps.LatLng(
      driverData.location.lat,
      driverData.location.lng
    );
    const point2 = new window.google.maps.LatLng(
      pickupLocation.lat,
      pickupLocation.lng
    );

    const distanceInMeters =
      window.google.maps.geometry.spherical.computeDistanceBetween(
        point1,
        point2
      );

    if (distanceInMeters < minDistanceInMeters) {
      nearestDriver = driver;
      minDistanceInMeters = distanceInMeters;
    }
  });

  return nearestDriver;
};
