import * as React from "react";
import { useLocation, useNavigate } from "react-router";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import "./Navbar.css";
import "/public/assets/user.svg" 

const Navbar = () => {
  const location = useLocation(); 
  const navigate = useNavigate();
  const [value, setValue] = React.useState(location.pathname);

  const getIcon = (path, defaultIcon, activeIcon) => {
    return location.pathname === path ? (
      <img src={activeIcon} alt={path} className="navbar-icon" />
    ) : (
      <img src={defaultIcon} alt={path} className="navbar-icon" />
    );
  };

  return (
    <Box className="navbar-container">
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          navigate(newValue);
        }}
        showLabels
      >
        <BottomNavigationAction
          label="Accueil"
          value="/home"
          icon={getIcon("/home", "../../../assets/home.svg", "../../../assets/home-active.svg")}
        />
        <BottomNavigationAction
          label="Parcourir"
          value="/search"
          icon={getIcon("/search", "/assets/search.svg", "/assets/search-active.svg")}
        />
        <BottomNavigationAction
          label="Publier"
          value="/add"
          icon={getIcon("/add", "/assets/add.svg", "/assets/add-active.svg")}
        />
        <BottomNavigationAction
          label="Message"
          value="/message"
          icon={getIcon("/message", "/assets/message.svg", "/assets/message-active.svg")}
        />
        <BottomNavigationAction
          label="Profil"
          value="/profile"
          icon={getIcon("/profile", "/assets/user.svg", "/assets/user-active.svg")}
        />
      </BottomNavigation>
    </Box>
  );
};

export default Navbar;
