import headerImage from "../Asset/fixHeader.png";

const Header = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${headerImage})`
      }}
      className="flex items-center justify-center w-full bg-center bg-cover h-[31rem]"
    >
      <div className="flex items-center justify-center py-40 font-semibold text-center text-white translate-y-8 border-8 px-96 black font-poppins text-pretty border-[#F5F5F5]">
        <h2 className="mb-4 text-5xl">Data GIS<br />Kelurahan di Semarang</h2>
      </div>
    </div>
  );
};

export default Header;
