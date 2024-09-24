import React, { useEffect, useState } from "react";
import '../components/TableK.scss';
import logofooter from '../storage/logofooter.png';

const TableK = () => {
  const [kelurahanData, setKelurahanData] = useState([]);
  const [userPosition, setUserPosition] = useState({ lat: null, lon: null });
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState("");
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage] = useState(5); 
  const [searchTerm, setSearchTerm] = useState(''); // State untuk search

  const totalPages = Math.ceil(kelurahanData.length / itemsPerPage);

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Menghasilkan jarak dalam kilometer
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/kelurahan")
      .then((res) => res.json())
      .then((data) => {
        setKelurahanData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Tidak dapat mengakses lokasi pengguna.");
        }
      );
    } else {
      setLocationError("Geolocation tidak didukung oleh browser ini.");
    }
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Fungsi untuk menangani input search
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset ke halaman 1 saat pencarian diubah
  };

  // Memfilter data kelurahan berdasarkan input pencarian (kecamatan dan kelurahan)
  const filteredData = kelurahanData.filter((kelurahan) =>
    kelurahan.nama_kecamatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kelurahan.nama_kelurahan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Menentukan item yang akan ditampilkan berdasarkan halaman dan pencarian
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const visiblePages = [];
  const pageLimit = 5;  
  let startPage = Math.max(currentPage - Math.floor(pageLimit / 2), 1);
  let endPage = Math.min(startPage + pageLimit - 1, Math.ceil(filteredData.length / itemsPerPage));

  if (endPage - startPage < pageLimit - 1) {
    startPage = Math.max(endPage - pageLimit + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  if (loading) {
    return <p>Loading data kelurahan...</p>;
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="overlay"></div>
        <div className="header-content">
          <h1>Data GIS</h1>
          <h2>Kelurahan di Semarang</h2>
        </div>
      </header>

      <div className="table-container">
        <div className="search-bar">
          <label>Search :</label>
          <input 
            type="text" 
            placeholder="Cari Data" 
            value={searchTerm} 
            onChange={handleSearch} 
          />
        </div>

        <table className="kelurahan-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Kecamatan</th>
              <th>Kelurahan || Alamat</th>
              <th>Link Map</th>
              <th>Foto</th>
              <th>Jarak (km)</th> {/* Tambahkan kolom Jarak */}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((kelurahan, index) => {
              const distance = userPosition.lat
                ? haversineDistance(
                    userPosition.lat,
                    userPosition.lon,
                    kelurahan.latitude,
                    kelurahan.longitude
                  ).toFixed(2)
                : locationError || "Menunggu lokasi pengguna...";

              return (
                <tr key={indexOfFirstItem + index}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{kelurahan.nama_kecamatan}</td>
                  <td>
                    {kelurahan.nama_kelurahan} <br /> {kelurahan.alamat}
                  </td>
                  <td>
                    <a
                      href={`https://www.google.com/maps?q=${kelurahan.latitude},${kelurahan.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-link"
                    >
                      Buka Maps
                    </a>
                  </td>
                  <td>
                    {kelurahan.gambar ? (
                      <img
                        src={`http://localhost:5000${kelurahan.gambar}`}
                        alt={kelurahan.nama_kelurahan}
                        className="kelurahan-image"
                      />
                    ) : (
                      <p>No Image</p>
                    )}
                  </td>
                  <td>{distance}</td> {/* Tambahkan kolom untuk jarak */}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="pagination">
          <button
            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
            className="pagination-prev-next"
          >
            &lt; Preview
          </button>

          {startPage > 1 && (
            <>
              <button onClick={() => paginate(1)} className="pagination-button">
                1
              </button>
              {startPage > 2 && <span className="pagination-ellipsis">...</span>}
            </>
          )}

          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`pagination-button ${currentPage === page ? "active" : ""}`}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
              <button onClick={() => paginate(totalPages)} className="pagination-button">
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-prev-next"
          >
            Next &gt;
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section footer-logo">
          <img src={logofooter} alt="Logo" className="logo" />
            <p>
              Aplikasi ini menampilkan data lokasi strategis dari berbagai kelurahan
              di Kota Semarang, membantu akses informasi geografis yang akurat dan
              relevan.
            </p>
          </div>
          <div className="footer-section footer-links">
            <h3>Link Terkait</h3>
            <ul>
              <li><a href="#">Semarangkota.co.id</a></li>
              <li><a href="#">Call Center 112</a></li>
              <li><a href="#">Sapa Mba Ita</a></li>
            </ul>
          </div>
          <div className="footer-section footer-contact">
            <h3>Kontak Kami</h3>
            <p><a href="tel:08112681112">08112681112</a></p>
            <p>Call Center Darurat 112</p>
            <p><a href="mailto:infomudik@semarangkota.go.id">infomudik@semarangkota.go.id</a></p>
            <p>Jl. Pemuda No.148, Kota Semarang</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>2024 copyright © all right reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default TableK;
