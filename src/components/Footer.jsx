import logo from "../Asset/footer-icon.png";
import map from "../Asset/map.png";

const Footer = () => {
  return (
    <footer className="p-10 font-normal footer font-poppins bg-[#000126] text-white flex justify-center mx-auto">
      <div className="flex flex-row max-w-screen-xl gap-14 ">
        <aside className="w-64 ">
          <img src={logo} alt="" />
          <p className="mt-4">
            Aplikasi ini menampilkan data lokasi strategis dari berbagai
            kelurahan di Kota Semarang, membantu akses informasi geografis yang
            akurat dan relevan.
          </p>
        </aside>

        <nav className="flex flex-col gap-4">
          <h6 className="underline footer-title">Link Terkait</h6>
          <a className="link link-hover hover:text-slate-200">
            Semarangkota.co.id
          </a>
          <a className="link link-hover hover:text-slate-200">
            Call Centre 112
          </a>
          <a className="link link-hover hover:text-slate-200">Sapa Mbak Ita</a>
        </nav>

        <nav className="flex flex-col gap-4">
          <h6 className="underline footer-title">Kontak Kami</h6>
          <a className="link link-hover hover:text-slate-200">08112681112</a>
          <a className="link link-hover hover:text-slate-200">
            Call Center Darurat 112
          </a>
          <a className="link link-hover hover:text-slate-200">
            infomudik@semarangkota.go.id
          </a>
          <a className="link link-hover hover:text-slate-200">
            Jl. Pemuda No.148, Kota Semarang
          </a>
        </nav>

        <aside className="w-56">
          <a
            className="underline cursor-pointer footer-title hover:text-slate-200"
            href="https://maps.app.goo.gl/ufsdSqcF1jpADiic7"
            target="_blank"
          >
            Lokasi
          </a>
          <img src={map} alt="" className="mt-4"/>
        </aside>
      </div>
    </footer>
  );
};

export default Footer;
