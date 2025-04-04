import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import AdvancedFilter from '../../AdvancedFilter';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: '2px solid #009b6a',
    backgroundColor: "#FFFF",
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '20ch',
            '&:focus': {
                width: '25ch',
            },
        },
    },
}));

const SuggestionsContainer = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 1300,
    maxHeight: 200,
    overflowY: 'auto',
    backgroundColor: theme.palette.background.paper,
}));

const SearchBar = () => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useSearchParams();
    const [activeFilters, setActiveFilters] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (inputValue.length > 2) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${inputValue}&limit=5`)
                .then((response) => response.json())
                .then((data) => {
                    setSuggestions(data.map(item => item.display_name));
                    setOpen(true);
                })
                .catch((error) => console.error("Erreur :", error));
        } else {
            setSuggestions([]);
            setOpen(false);
        }
    }, [inputValue]);

    const handleSelect = (address) => {
        setInputValue(address);
        setOpen(false);
    };

    return (
        <div className='flex w-[100%] items-center justify-between py-5 fixed z-402 bg-white/80'>
            <Search className='ml-5 w-[3rem] bg-white'>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="Rechercher…"
                    inputProps={{ 'aria-label': 'search' }}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                {open && suggestions.length > 0 && (
                    <SuggestionsContainer>
                        <List>
                            {suggestions.map((address, index) => (
                                <ListItem key={index} button onClick={() => handleSelect(address)}>
                                    <ListItemText primary={address} />
                                </ListItem>
                            ))}
                        </List>
                    </SuggestionsContainer>
                )}
            </Search>
            
            <button 
                className="flex justify-center items-center w-[100%] h-[3rem] max-w-[3rem] max-h-[3rem] border-2 border-[#009b6a] rounded-md bg-white hover:border-[#007b54] transition mx-5"
                onClick={() => setFilterOpen(true)}
            >
                <img src="../../../assets/filter.svg" alt="Filtrer" className="w-6 h-6" />
            </button>

            {activeFilters && (
                <div className="px-4 py-2 bg-green-50 flex items-center justify-between">
                    <div className="text-sm text-green-800">
                        Filtres actifs ({Object.values(activeFilters.dietary).filter(Boolean).length + 
                                        Object.values(activeFilters.pickupTimes).filter(Boolean).length + 
                                        activeFilters.categories.length} sélections)
                    </div>
                    <button 
                        onClick={() => {
                            setActiveFilters(null);
                        }}
                        className="text-xs text-green-700 font-medium"
                    >
                        Réinitialiser
                    </button>
                </div>
            )}

            <AdvancedFilter
                isOpen={filterOpen} 
                onClose={() => setFilterOpen(false)}
            />

            {filterOpen && (
                <div 
                    className="fixed inset-0 bg-black opacity-20 z-40"
                    onClick={() => setFilterOpen(false)}
                ></div>
            )}
        </div>
        
    );
};

export default SearchBar;
