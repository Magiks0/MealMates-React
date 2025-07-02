import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Plus, Trash2, Save, Loader2, CheckCircle, XCircle } from 'lucide-react';
import UserService from '../../services/UserService';

const Availability = () => {
  const daysMapping = {
    'Lundi': 'Monday',
    'Mardi': 'Tuesday',
    'Mercredi': 'Wednesday',
    'Jeudi': 'Thursday',
    'Vendredi': 'Friday',
    'Samedi': 'Saturday',
    'Dimanche': 'Sunday'
  };

  const daysFr = Object.keys(daysMapping);
  const initialAvailabilities = daysFr.reduce((acc, day) => ({ ...acc, [day]: [] }), {});

  const [availabilities, setAvailabilities] = useState(initialAvailabilities);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      const data = await UserService.getAvailabilities();
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;

      const groupedByDay = {};
      daysFr.forEach(day => {
        groupedByDay[day] = [];
      });

      parsed.forEach(availability => {
        const dayEn = availability.dayOfWeek;
        const dayFr = Object.keys(daysMapping).find(key => daysMapping[key] === dayEn);

        if (dayFr && availability.min_time && availability.max_time) {
          groupedByDay[dayFr].push({
            from: availability.min_time.substring(0, 5),
            to: availability.max_time.substring(0, 5)
          });
        }
      });

      setAvailabilities(groupedByDay);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTimeSlot = (day) => {
    setAvailabilities(prev => ({
      ...prev,
      [day]: [...prev[day], { from: '09:00', to: '17:00' }]
    }));
  };

  const removeTimeSlot = (day, index) => {
    setAvailabilities(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (day, index, field, value) => {
    setAvailabilities(prev => ({
      ...prev,
      [day]: prev[day].map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const validateTimeSlots = () => {
    for (const day of daysFr) {
      for (const slot of availabilities[day]) {
        if (slot.from >= slot.to) {
          return `Erreur pour ${day}: l'heure de début doit être antérieure à l'heure de fin`;
        }
      }
    }
    return null;
  };

  const handleSave = async () => {
    const validation = validateTimeSlots();
    if (validation) {
      setMessage({ type: 'error', text: validation });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const apiData = [];

      Object.entries(availabilities).forEach(([dayFr, slots]) => {
        const dayEn = daysMapping[dayFr];
        slots.forEach(slot => {
          if (slot.from && slot.to) {
            apiData.push({
              dayOfWeek: dayEn,
              min_time: `${slot.from}:00`,
              max_time: `${slot.to}:00`
            });
          }
        });
      });

      await UserService.updateAvailabilities(apiData);
      setMessage({ type: 'success', text: 'Disponibilités sauvegardées avec succès !' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      const errMsg = error?.response?.data?.message || 'Erreur lors de la sauvegarde';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setIsSaving(false);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button onClick={goBack} className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Mes disponibilités</h1>
          <div className="w-6 h-6"></div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Définissez vos créneaux de disponibilité</h3>
              <p className="text-sm text-blue-700">
                Indiquez les horaires où vous êtes disponible pour récupérer ou livrer des produits pour chaque jour de la semaine.
              </p>
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`flex items-center space-x-2 p-3 rounded-lg mb-4 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        <div className="space-y-4">
          {daysFr.map(day => (
            <div key={day} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-800">{day}</h3>
                <button
                  onClick={() => addTimeSlot(day)}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm">Ajouter un créneau</span>
                </button>
              </div>

              {availabilities[day].length === 0 ? (
                <p className="text-gray-500 text-sm italic py-2">Aucune disponibilité définie pour ce jour</p>
              ) : (
                <div className="space-y-2">
                  {availabilities[day].map((slot, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 w-8">De</span>
                      <input
                        type="time"
                        value={slot.from}
                        onChange={(e) => updateTimeSlot(day, index, 'from', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <span className="text-sm text-gray-600">à</span>
                      <input
                        type="time"
                        value={slot.to}
                        onChange={(e) => updateTimeSlot(day, index, 'to', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <button
                        onClick={() => removeTimeSlot(day, index)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 pb-6">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sauvegarde en cours...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Sauvegarder mes disponibilités</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Availability;
