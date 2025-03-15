import './App.css';
import { Header } from './components/common/Header'


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
        <div className='advantages w-full h-1/2 bg-primary flex flex-col items-center text-white gap-5'>
          <div className='text-black bg-white w-full p-5'>
            <h2>Les avantages de <span className='text-secondary'>Meal</span>Mates</h2>
          </div>
          <div className='mt-6 w-2/3'>
            <p className='title'>Réduire le gaspillage alimentaire</p>
            <p className='content'>Contribuez à un monde plus durable en sauvant des produits encore délicieux, tout en faisant des économies.</p>
          </div>
          <hr />
          <div className='w-2/3'>
            <p className='title'>Participer à la protection de l'environement</p>
            <p className='content'>Faites un geste pour la planète en consommant des aliments locaux et en évitant le gaspillage alimentaire.</p>
          </div>
          <hr />
          <div className='w-2/3'>
            <p className='title'>Se faire plaisir a moindre coût</p>
            <p className='content'>Dégustez des plats savoureux à petit prix tout en soutenant les commerçants locaux et en limitant les déchets.</p>
          </div>
          <hr />
          <div className='w-2/3'>
            <p className='title'>Intéragir avec le communauté pour découvrir de nouvelles recettes</p>
            <p className='content'>Rejoignez une communauté engagée pour échanger des astuces et découvrir des recettes créatives à partir de produits sauvés.</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default App
