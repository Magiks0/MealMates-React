import React from "react";
import { Link } from "react-router";
import { AiOutlineArrowLeft, AiFillStar } from "react-icons/ai";
import Navbar from "../components/common/navbar/Navbar";
import UserService from "../services/UserService";
import { User } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const user = await UserService.getCurrentUser();

const ProfilePage = () => {
  interface User {
    username: string
    firstName: string
    lastName: string
    email: string
    address: string
  }
  const defaultUser: User = { username: user.username, firstName: user.firstName, lastName: user.lastName, email: user.email, address: user.address }
  
  const form = useForm({
    defaultValues: defaultUser,
    onSubmit: async ({ value }) => {
      console.log(value)
    },
    validators: {
      onChange: z.object({
        username: z.string().min(1, "Username is required"),
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email address"),
        address: z.string().min(1, "Address is required")
      }),
    },
  });

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex items-center p-4 bg-white shadow">
        <Link to="/account" className="text-xl">
          <AiOutlineArrowLeft />
        </Link>
        <h1 className="text-lg font-semibold flex-1 text-center">Profil</h1>
      </div>

      <div className="flex flex-col items-center p-4">
        <div className="flex justify-around items-center w-90 mb-4">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-300 text-xl font-bold">
              {user.username[0]}
            </div>
            <button className="mt-2 px-4 border border-green-500 text-green-500 rounded-full text-sm h-10">
              Ajoutez une photo
            </button>  
        </div>
        <p className="text-xs text-center text-gray-600 mt-2">
          Avec une photo de profil, vous avez de quoi personnaliser votre profil et rassurer les autres membres !
        </p>
      </div>

      <div className="px-4 space-y-3">
        <form onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}>
          <form.Field 
            name="username"
            children={(field) => (
              <div className="flex flex-col">
                <label htmlFor="username" className="text-sm font-semibold mb-1">Nom d'utilisateur</label>
                <input
                  name="username"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />
          <form.Field 
            name="email"
            children={(field) => (
              <div className="flex flex-col">
                <label htmlFor="email" className="text-sm font-semibold mb-1">Email</label>
                <input
                  name="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            )}
          />
        </form>
      </div>

      <div className="px-4 mt-4">
        <Link to="/reviews" className="flex justify-between items-center py-3 border-b">
          <div className="flex items-center space-x-2">
            <p className="text-sm">Avis</p>
            <div className="flex text-green-500">
              {[...Array(5)].map((_, i) => (
                <AiFillStar key={i} />
              ))}
            </div>
            <span className="text-xs text-gray-500">(12)</span>
          </div>
          <span className="text-gray-400">{">"}</span>
        </Link>
      </div>

      <div className="px-4 space-y-3 mt-2">
        <Link to="/account/availability" className="flex justify-between items-center py-3 border-b">
          <p className="text-sm">Mes disponibilités</p>
          <span className="text-gray-400">{">"}</span>
        </Link>
        <Link to="/account/preferences" className="flex justify-between items-center py-3">
          <p className="text-sm">Mes préférences alimentaires</p>
          <span className="text-gray-400">{">"}</span>
        </Link>
      </div>

      <Navbar />

    </div>
  );
};

export default ProfilePage;
