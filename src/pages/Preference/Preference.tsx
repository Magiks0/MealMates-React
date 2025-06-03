import React, { useState } from "react";
import { Switch, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";
import Navbar from "../../components/common/navbar/Navbar";

const Preferences = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    "Végétarien": true,
    "Vegan": false,
    "Intolérent au lactose": true,
    "Intolérent au gluten": true,
  });

  const handleToggle = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-white px-4 py-6">
      <div className="flex items-center mb-4">
        <ArrowBackIcon className="cursor-pointer" onClick={() => navigate("/account/profile")} />
        <h1 className="text-xl font-bold mx-auto">Préférences</h1>
      </div>

      <p className="text-gray-600 text-center mb-6">
        Renseigner vos préférences / contraintes alimentaires afin de recevoir
        des offres qui correspondent à vos envies
      </p>

      <div className="space-y-4">
        {Object.entries(preferences).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
          >
            <span>{key}</span>
            <Switch
              checked={value}
              onChange={() => handleToggle(key)}
              color="success"
            />
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button variant="contained" color="success" className="w-full">
          Sauvegarder
        </Button>
      </div>

      <Navbar />
    </div>
  );
};

export default Preferences;
