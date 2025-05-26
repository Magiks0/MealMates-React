import './LandingPage.css';
import { Header } from '../../components/LandingPage/Header';
import { Footer } from '../../components/LandingPage/Footer'
import Advantages from '../../components/LandingPage/Advantages';
import Testimonials from '../../components/LandingPage/Testimonials';

export default function LandingPage() {

  return (
    <>
      <Header />
      <section className='flex flex-col h-1/3 px-4 pt-8 sm:px-16 sm:py-12 sm:gap-6'>
        <div className='h-auto gap-3 sm:flex'>
          <div className='relative w-10/11 h-[50vw] sm:w-3/5 sm:h-[30vw]'>
            <div className='img absolute w-[95%] h-11/12 aspect-[1/1] rounded-2xl'>
            </div>
            <div className='absolute bottom-0 right-0 text-xs sm:text-lg md:text-2xl md:p-10 text-white font-extrabold bg-primary p-5 w-3/5 '>
              Rejoins les <span className='text-secondary'>milliers d’utilisateurs</span> pour la lutte anti-gaspi !
            </div>
          </div>
          <div className='invisible sm:visible'>
            S'inscrire
          </div>
        </div>
        <div className='flex justify-center'>
          <p className='mw-auto text-xs text-center p-5 italic sm:text-sm md:text-lg md:px-25'>MealMates est une plateforme à but non-lucratif dont l’objectif principal est de lutter contre le gaspillage alimentaire et de permettre aux particuliers de réaliser des économies tout en participant à la protection de l’environnement</p>
        </div>
        <hr className='mx-auto w-10/12'/>
      </section>
      <section>
        <div className="w-full flex justify-center">
          <h2 className='text-3xl p-3 text-semibold'><span className='text-secondary'>Meal</span>Mates c'est ...</h2>
        </div>
        <div className='h-1/2 pb-24 relative flex flex-col md:flex-row'>
          <img src="./assets/leaf_left.png" alt="" className='absolute right-0 z-[-10] md:hidden' />
          <img src="./assets/leaf_right.png" alt="" className='absolute left-0 top-1/2 z-[-10] md:hidden' />
          <div className='w-full flex flex-col gap-3 md:w-1/3 px-6'>
            <div className='w-full h-1/2 flex flex-col justify-center p-6 bg-primary rounded-xl md:bg-transparent'>
              <p className='text-center font-semibold text-xl text-white md:text-black'>Rechercher des offres</p>
              <p className='text-center p-6 text-white md:text-black'>Trouvez facilement des offres alimentaires près de chez vous pour réduire le gaspillage</p>
            </div>
            <div className='md:mt-36 p-6 h-1/2 bg-primary md:bg-transparent rounded-xl'>
              <p className='text-center font-semibold text-xl text-white md:text-black'>Publier des offres</p>
              <p className='text-center p-6 text-white md:text-black'>Partagez vos surplus alimentaires avec la communauté en quelques clics</p>
            </div>
          </div>
          <div className='hidden w-1/3 relative flex-col items-center justify-center md:flex'>
            <div className=''>
              <img src="./assets/logo_arrows.png" alt="logo_mealmates"/>
            </div>
          </div>
          <div className='flex flex-col gap-3 md:w-1/3 w-full px-6'>
            <div className='mt-3 md:mt-12 p-6 bg-primary md:bg-transparent rounded-xl'>
              <p className='text-center font-semibold text-xl text-white md:text-black '>Messagerie intégrée</p>
              <p className='text-center p-6 text-white md:text-black'>Communiquez facilement avec les autres membres pour organiser vos échanges</p>
            </div>
            <div className='md:mt-36 p-6 bg-primary md:bg-transparent rounded-xl'>
              <p className='text-center font-semibold text-xl text-white md:text-black'>Système de notation</p>
              <p className='text-center p-6 text-white md:text-black'>Evaluez vos expériences et construisez une communauté de confiance</p>
            </div>
          </div>
        </div>
        <div className='text-black w-full p-5 flex justify-center sm:bg-primary'>
            <h2 className='text-xl md:text-3xl sm:text-white'><span className='sm:text-secondary'>Les avantages de</span> <span className='text-secondary font-lobster'>Meal</span>Mates</h2>
        </div>
        <Advantages />
      </section>
      <section className='p-12'>
        <Testimonials />
        <div className='flex flex-col items-center justify-center pt-12'>
          <h2 className='text-md sm:text-2xl'>Suivez nous sur les réseaux sociaux</h2>
          <div className='w-full flex justify-around p-6 md:w-4/12'>
            <a href="instagram.com" className='block'>
              <img src="./assets/logo_instagram.png" alt="logo_instagram" className='w-8' />
            </a>
            <a href="facebook.com" className='block'>
              <img src="./assets/logo_facebook.png" alt="logo_facebook" className='w-8' />
            </a>
            <a href="" className='block'>
              <img src="./assets/logo_x.png" alt="logo_x" className='w-8' />
            </a>
            <a href="" className='block'>
              <img src="./assets/logo_tiktok.png" alt="logo_tiktok" className='w-8' />
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
