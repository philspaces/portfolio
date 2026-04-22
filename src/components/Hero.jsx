import Position from "./Position";
import RocketCanvas from "./Rocket.jsx";

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden bg-primary"
    >
      <div className="parallax pointer-events-none absolute inset-0">
        <img className="parallax__stars" src="./parallax/1Stars.svg" alt="" />
        <img className="parallax__planets" src="./parallax/2Planets.svg" alt="" />
        <img className="parallax__mountain1" src="./parallax/3Mountain.svg" alt="" />
        <img className="parallax__mountain2" src="./parallax/4Mountain.svg" alt="" />
        <img className="parallax__sun" src="./parallax/6Sun.svg" alt="" />
        <img className="parallax__crater" src="./parallax/5Crater.svg" alt="" />
        <RocketCanvas />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 pb-16 pt-28 sm:px-10 lg:px-16">
        <div className="max-w-4xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-quaternary sm:text-base">
            Product UI • automation • AI tooling • self-hosted systems
          </p>
          <h1 className="text-5xl font-bold leading-none text-white sm:text-7xl lg:text-8xl xl:text-[7rem]">
            Phi Long
          </h1>
          <div className="mt-4">
            <Position />
          </div>
          <p className="mt-8 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            I build practical software with a product mindset — from browser
            agents and UI systems to self-hosted infrastructure and internal
            tools that actually get used.
          </p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Public repos show the direction. Private work carries a lot of the
            current volume.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-full bg-quaternary px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500"
            >
              See selected work
            </a>
            <a
              href="#proof"
              className="rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white"
            >
              See proof
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
