import Position from "./Position";
import RocketCanvas from "./Rocket.jsx";

const Hero = ({ scrollContainer }) => {
  return (
    <section className="parallax">
      <div className="parallax__content absolute top-[10%] sm:top-[16%] lg:top-[14%] xl:top-[22%] w-full mx-auto lg:pl-36 lg:pr-4 xl:px-40 2xl:px-40 3xl:px-60 flex flex-col lg:flex-row items-start z-10">
        <div className="flex-1 lg:mb-0">
          <h1 className="font-bold text-white text-[40px] xs:text-[50px] sm:text-[68px] md:text-[80px] lg:text-[90px] xl:text-[110px] 2xl:text-[180px] leading-[110px] 2xl:leading-[160px]">
            PHI LONG
          </h1>
          <Position />
        </div>
        <div className="flex-1 flex justify-start lg:justify-end mt-4 sm:mt-14 ml-8 xs:ml-[-4vh] sm:ml-[-17vh] md:ml-[-26vh] lg:mt-10 2xl:mt-0">
          <div className="font-bold text-[20px] sm:text-[30px] md:text-[36px] lg:text-[30px] 2xl:text-[46px] sm:leading-[40px] md:leading-[50px] 2xl:leading-[60px] streaky-glow max-w-sm 2xl:max-w-lg text-white text-left">
            I love crafting <br /> captivating experiences for the digital world
            to savor.
          </div>
        </div>
      </div>

      <img className="parallax__stars" src="./parallax/1Stars.svg" alt="" />
      <img className="parallax__planets" src="./parallax/2Planets.svg" alt="" />
      <img
        className="parallax__mountain1"
        src="./parallax/3Mountain.svg"
        alt=""
      />
      <img
        className="parallax__mountain2"
        src="./parallax/4Mountain.svg"
        alt=""
      />
      <img className="parallax__sun" src="./parallax/6Sun.svg" alt="" />
      <img className="parallax__crater" src="./parallax/5Crater.svg" alt="" />

      <RocketCanvas scrollContainer={scrollContainer} />
    </section>
  );
};

export default Hero;
