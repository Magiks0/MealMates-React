import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from "@mui/x-date-pickers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { TextField , Button } from "@mui/material";
import Navbar from "../../components/common/navbar/Navbar";
import { useState } from 'react'
import { useNavigate } from "react-router";

const Availability = () => {
    const navigate = useNavigate();

    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

    const [times, setTimes] = useState(
        days.reduce((acc, day) => ({ ...acc, [day]: { from: null, to: null } }), {})
      );
    
      const handleTimeChange = (day, type, newValue) => {
        setTimes((prev) => ({
          ...prev,
          [day]: {
            ...prev[day],
            [type]: newValue,
          },
        }));
      };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex flex-col h-screen bg-white px-4 py-6">
        <div className="flex items-center mb-4">
            <ArrowBackIcon className="cursor-pointer" onClick={() => navigate("/account/profile")} />
            <h1 className="text-xl font-bold mx-auto">Disponibilités</h1>
        </div>

            <p className="text-gray-600 text-center mb-6">
                Renseigner vos préférences / contraintes alimentaires afin de recevoir
                des offres qui correspondent à vos envies
            </p>

            <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md mx-auto">
                {days.map((day) => (
                    <div key={day} className="flex flex-col items-center my-4">
                        <span className="font-medium mb-2">{day} :</span>
                        <div className="flex gap-4">
                            <MobileTimePicker
                            label="De"
                            value={times[day].from}
                            onChange={(newValue) => handleTimeChange(day, "from", newValue)}
                            renderInput={(params) => <TextField {...params} className="w-32" />}
                            />
                            <MobileTimePicker
                            label="à"
                            value={times[day].to}
                            onChange={(newValue) => handleTimeChange(day, "to", newValue)}
                            renderInput={(params) => <TextField {...params} className="w-32" />}
                            />
                        </div>
                    </div>
                ))}
                <div className="flex justify-center mx-auto">
                    <Button variant="contained" color="success" className="w-full">
                    Sauvegarder
                    </Button>
                </div>
            </div>

            <Navbar />
        </div>
    </LocalizationProvider>
  );
};

export default Availability;
