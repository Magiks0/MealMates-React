import { Link } from "react-router";

export function Footer(){
  return (
    <footer className="bg-primary text-white py-6">
      <div className="container mx-auto px-4">
        {/* Structure responsive */}
        <div className="flex flex-col gap-2.5 items-center justify-center md:flex-row md:justify-between">
          {/* Logo et slogan - visible en toutes tailles */}
          <div className="mb-6 md:mb-0">
            <Link to="/" className="flex items-center mb-2">
              <img 
                src="/assets/logo_mealmates.png" 
                alt="MealMates Logo" 
                className="w-20 h-20 md:w-15 md:h-15" 
              />
              <h2 className="text-5xl ml-2 md:text-3xl">
                <span className="text-secondary">Meal</span>
                <span className="text-white">Mates</span>
              </h2>
            </Link>
            <p className="text-sm text-gray-300 hidden md:block">
              Lutter ensemble contre le gaspillage alimentaire.
            </p>
          </div>
          
          {/* Liens rapides */}
          <div className="mb-6 w-full text-center md:mb-0 md:w-auto">
            <h3 className="text-lg font-medium mb-3">Liens rapides</h3>
            <ul>
              <li className="mb-1"><Link to="/" className="text-sm hover:text-green-300">Accueil</Link></li>
              <li className="mb-1"><Link to="/about" className="text-sm hover:text-green-300">Qui sommes-nous ?</Link></li>
              <li className="mb-1"><Link to="/features" className="text-sm hover:text-green-300">Fonctionnalités</Link></li>
              <li className="mb-1"><Link to="/contact" className="text-sm hover:text-green-300">Contact</Link></li>
            </ul>
          </div>
          
          {/* Section légale */}
          <div className="mb-6 w-full text-center md:mb-0 md:w-auto">
            <h3 className="text-lg font-medium mb-3">Légal</h3>
            <ul>
              <li className="mb-1"><Link to="/terms" className="text-sm text-center hover:text-green-300">Conditions d'utilisation</Link></li>
              <li className="mb-1"><Link to="/privacy" className="text-sm hover:text-green-300">Politique de confidentialité</Link></li>
              <li className="mb-1"><Link to="/legal" className="text-sm hover:text-green-300">Mentions légales</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="mb-6 w-full text-center md:mb-0 md:w-auto">
            <h3 className="text-lg font-medium mb-3 mx-auto">Contact</h3>
            <p className="text-sm mb-1">contact@mealmates.fr</p>
            <p className="text-sm">Senlis, France</p>
          </div>
        </div>
        
        {/* Copyright - en bas, centré */}
        <div className="text-center text-xs mt-8 pt-4 border-t border-gray-700">
          <p>© 2025 MealMates. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}