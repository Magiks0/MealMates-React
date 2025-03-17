import './Header.css';
import { Link } from "react-router";

export function Header(){
    return (
        <header>
            <div className="hamburger-menu sm:flex">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className='logo invisible sm:visible'>
                <Link to="/" className='flex items-center gap-3'>
                    <img className='w-12' src="/assets/logo_mealmates.png" alt="logo_mealMates"/>
                    <p className='text-white font-lobster font-semibold text-xl'><span className='text-secondary'>Meal</span>Mates</p>
                </Link>
            </div>
            <div className='logo-container visible sm:invisible'>
                <Link to="/">
                    <img src="/assets/logo_mealmates.png" alt="logo_mealMates"/>
                </Link>
            </div>
            <div className='auth-buttons'>
                <Link to="/" className='btn btn-register'>
                    S'inscrire
                </Link>
                <Link to="/" className='btn btn-connect'>
                    Se connecter
                </Link>
            </div>
        </header>
    )
}