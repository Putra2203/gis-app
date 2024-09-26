import headerImage from "../Asset/fixHeader1.png";

const Header = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${headerImage})`
      }}
      className="flex items-center justify-center w-full bg-center bg-cover lg:h-[31rem] h-[10rem] md:h-[31rem]"
    >
      <div className="flex items-center justify-center lg:py-40 font-semibold text-center text-white translate-y-5 md:translate-y-11 lg:translate-y-10 lg:border-8 border-4 lg:px-96 black font-poppins text-pretty border-[#F5F5F5] lg:max-w-screen-xl flex-col md:max-w-screen-md md:px-40 md:py-40 max-w-screen-sm px-16 py-10">
        <h2 className="mb-0 text-xl tracking-wide lg:mb-4 lg:text-6xl md:text-5xl">Data GIS</h2>
        <p className="text-sm font-medium tracking-wider lg:text-4xl md:text-3xl">Kelurahan di Semarang</p>
      </div>
    </div>
  );
};

export default Header;
