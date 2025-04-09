import SearchEvent from "./components/Acceuil/SearchEvent";

export default function Home() {
  return (
    <>
      <section className="relative">
        <div className="section-container ">
          <div className="h-[800px] rounded-2xl overflow-hidden relative z-0 bg-Header_bg bg-no-repeat bg-cover flex justify-center p-8">
            <div className="text-center flex flex-col items-center w-full gap-4">
              <h1 className="text-white font-light z-20 text-3xl sm:text-4xl md:text-5xl lg:text-7xl 2xl:w-11/12 2xl:text-[90px]">
                La méthode la plus fiable pour acheter{" "}
                <span className="text-lightBlue">et revendre des billets</span>
              </h1>
              <p className="text-white z-20 lg:w-2/3 2xl:w-1/2 lg:text-lg font-normal">
                Repose sur l’utilisation de plateformes sécurisées et reconnues,
                garantissant la transparence des transactions et la protection
                des acheteurs comme des vendeurs.
              </p>

              <SearchEvent />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
