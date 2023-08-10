import React, { useRef, useEffect, useState } from "react";
import TitleCard from "../../../components/Cards/TitleCard";
import {
  useDeleteLocationMutation,
  useGetLocationQuery,
  useUpdateLocationMutation,
} from "../../../app/service/api";
import { showNotification } from "../../common/headerSlice";
import { useDispatch } from "react-redux";

const MapWithPolygonDrawing = () => {
  const [drawnPolygons, setDrawnPolygons] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);

  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);

  const { data: locations, isLoading } = useGetLocationQuery();
  const [addOrUpdateLocation, { isLoading: isAdding, isSuccess: isAdded }] =
    useUpdateLocationMutation();
  const [deleteAllLocations, { isLoading: isDeleting, isSuccess: isDeleted }] =
    useDeleteLocationMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    console.log(4);
    if (currentLocation) {
      console.log(5);
      const mapOptions = {
        center: currentLocation,
        zoom: 9,
      };
      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      setMapInstance(map);

      const drawingManager = new window.google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
        },
      });

      drawingManagerRef.current = drawingManager;

      map.addListener("click", () => {
        if (drawingManagerRef.current) {
          drawingManagerRef.current.setDrawingMode(null);
        }
      });
    }
  }, [currentLocation]);

  useEffect(() => {
    console.log("1");
    if (mapInstance) {
      console.log("2");
      if (locations && locations.length > 0) {
        console.log("3");
        locations.forEach((location) => {
          const Polygon = new window.google.maps.Polygon({
            paths: [...location.path],
            editable: true,
          });

          Polygon.setMap(mapInstance);
        });
      }

      const drawingManager = drawingManagerRef.current;

      window.google.maps.event.addListener(
        drawingManager,
        "overlaycomplete",
        (event) => {
          if (event.type === window.google.maps.drawing.OverlayType.POLYGON) {
            const newPolygon = event.overlay;
            const path = newPolygon
              .getPath()
              .getArray()
              .map((latLng) => ({
                lat: latLng.lat(),
                lng: latLng.lng(),
              }));

            setDrawnPolygons((prevPolygons) => [
              ...prevPolygons,
              { path, polygon: newPolygon },
            ]);
          }
        }
      );

      drawingManager.setMap(mapInstance);
    }
  }, [mapInstance, locations]);

  useEffect(() => {
    if (isAdded) {
      document.body.classList.remove("loading-indicator");
      dispatch(
        showNotification({
          message: "Location has been successfully added!",
          status: 1,
        })
      );
    }

    if (isDeleted) {
      document.body.classList.remove("loading-indicator");
      dispatch(
        showNotification({
          message: "All locations have been deleted!",
          status: 1,
        })
      );
    }
  }, [isAdded, isDeleted]);

  const clearDrawnPolygons = () => {
    drawnPolygons.forEach(({ polygon }) => {
      polygon.setMap(null);
    });
    setDrawnPolygons([]);
  };

  const updatePolygon = () => {
    drawnPolygons.forEach(async ({ path }) => {
      await addOrUpdateLocation(path);
    });

    setDrawnPolygons([]);
  };

  const deleteAllPolygons = () => {
    deleteAllLocations();
  };

  if (isLoading || isAdding || isDeleting) {
    document.body.classList.add("loading-indicator");
  } else {
    document.body.classList.remove("loading-indicator");
  }

  return (
    <TitleCard title={"Draw polygon to select the area of operation"}>
      <div ref={mapRef} style={{ width: "100%", height: 450 }}></div>
      <div className="my-4 flex justify-around">
        <button
          disabled={drawnPolygons.length < 1}
          className="btn btn-primary"
          onClick={clearDrawnPolygons}
        >
          Clear Drawn Polygons
        </button>
        <button
          disabled={drawnPolygons.length < 1}
          className="btn btn-success"
          onClick={updatePolygon}
        >
          Update Drawn Polygons
        </button>
        <button
          disabled={!locations || locations.length < 1}
          className="btn btn-error"
          onClick={deleteAllPolygons}
        >
          Delete Drawn Polygons
        </button>
      </div>
    </TitleCard>
  );
};

export default MapWithPolygonDrawing;
