export default function Advantages(){
    const advantages = [
        {
            title: "Réduire le gaspillage alimentaire",
            content: "Contribuez à un monde plus durable en sauvant des produits encore délicieux, tout en faisant des économies."
          },
          {
            title: "Participer à la protection de l'environnement",
            content: "Faites un geste pour la planète en consommant des aliments locaux et en évitant le gaspillage alimentaire."
          },
          {
            title: "Se faire plaisir à moindre coût",
            content: "Dégustez des plats savoureux à petit prix tout en soutenant les commerçants locaux et en limitant les déchets."
          },
          {
            title: "Interagir avec la communauté pour découvrir de nouvelles recettes",
            content: "Rejoignez une communauté engagée pour échanger des astuces et découvrir des recettes créatives à partir de produits sauvés."
          }
    ]


    return(
        <>
           <section className="advantages bg-primary text-white flex flex-col items-center justify-center gap-4 p-6 sm:grid sm:grid-cols-2 sm:gap-12 sm:h-100">
                {advantages.map((adv, index) => (
                <div key={index} className="flex flex-col items-center justify-center w-full gap-4 text-center">
                    <p className="title text-sm font-bold md:text-3xl">{adv.title}</p>
                    <p className="content text-xs md:text-3xl">{adv.content}</p>
                    {index < advantages.length - 1 && <hr className="w-1/3 text-secondary sm:hidden" />}
                </div>
                ))}
            </section>
        </>
    )
}