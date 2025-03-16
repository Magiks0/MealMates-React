import './App.css';
import { Header } from './components/common/Header';
import Advantages from './components/LandingPage/Advantages';


function App() {

  return (
    <>
      <Header />
      <section className='flex flex-col h-1/3 px-4 py-8 sm:px-16 sm:py-12 sm:gap-6'>
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
        <div className='h-1/2'>
          Test
        </div>
        <div className='text-black w-full p-5 flex justify-center x'>
            <h2 className='text-xl md:text-3xl'>Les avantages de <span className='text-secondary'>Meal</span>Mates</h2>
        </div>
        <Advantages />
      </section>
    </>
  )
}

export default App
