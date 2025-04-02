import React from "react";
import Navbar from "../../components/common/navbar/Navbar";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';

const Map = () => {

  return (
    
    <div>
      <MapContainer style={{ height: "100vh", width: "100%" }} center={[49.21057328867782, 2.581954706737226]} zoom={25} >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
      <Navbar></Navbar>
    </div>
  );
};

export default Map;
