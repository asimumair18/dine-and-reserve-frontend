import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { ClipLoader } from "react-spinners";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const SearchControl = ({ setPosition, setLocationValue }) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: false,
      autoClose: true,
      retainZoomLevel: false,
      animateZoom: true,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result) => {
      const { x, y } = result.location;
      setPosition([y, x]);
      setLocationValue(`${y},${x}`);
      map.setView([y, x], 50);
    });

    return () => map.removeControl(searchControl);
  }, [map, setPosition]);

  return null;
};

const ClickableMap = ({ setPosition, setLocationValue }) => {
  useMapEvents({
    click: (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
      setLocationValue(`${e.latlng.lat},${e.latlng.lng}`);
    },
  });
  return null;
};

const Overview = ({ setLocationValue, locationValue }) => {
  const [position, setPosition] = useState(locationValue?.split(","));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleMarkerDragEnd = (event) => {
    const marker = event.target;
    const newPosition = marker.getLatLng();
    setPosition([newPosition.lat, newPosition.lng]);
    setLocationValue(`${newPosition?.lat},${newPosition?.lng}`);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <ClipLoader color={"#123abc"} loading={loading} size={50} />
      </div>
    );
  }

  return (
    <div>
      <MapContainer
        center={
          locationValue
            ? locationValue.split(",")
            : [22.313443334480283, 113.91375269452455]
        }
        zoom={13}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {position && (
          <Marker
            position={position}
            draggable={true}
            eventHandlers={{ dragend: handleMarkerDragEnd }}
          >
            <Popup>
              Latitude: {position[0]}, Longitude: {position[1]}
            </Popup>
          </Marker>
        )}
        <ClickableMap
          setPosition={setPosition}
          setLocationValue={setLocationValue}
        />
        <SearchControl
          setPosition={setPosition}
          setLocationValue={setLocationValue}
        />
      </MapContainer>
    </div>
  );
};

export default Overview;
