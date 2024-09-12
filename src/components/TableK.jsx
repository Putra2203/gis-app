import React, { useEffect, useState } from "react";

const TableK = () => {
  const [kelurahanData, setKelurahanData] = useState([]);
  const [userPosition, setUserPosition] = useState({ lat: null, lon: null });
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Halaman aktif
  const [itemsPerPage] = useState(10); // Jumlah item per halaman

  // Fungsi untuk menghitung jarak menggunakan rumus Haversine
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius bumi dalam kilometer
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Jarak dalam kilometer
  };

  useEffect(() => {
    // Fetch data kelurahan dari server
    fetch("http://localhost:5000/api/kelurahan")
      .then((res) => res.json())
      .then((data) => {
        setKelurahanData(data);
        setLoading(false); // Set loading to false after fetching
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Even if there's an error, we stop loading
      });

    // Dapatkan lokasi pengguna
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

  // Fungsi untuk mendapatkan data yang akan ditampilkan berdasarkan halaman
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = kelurahanData.slice(indexOfFirstItem, indexOfLastItem);

  // Fungsi untuk mengubah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Loading data kelurahan...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen overflow-x-auto">
      <table className="table w-1/2 bg-blue-300">
        {/* head */}
        <thead>
          <tr>
            <th>No.</th>
            <th>Kecamatan</th>
            <th>Kelurahan</th>
            <th>Gambar</th>
            <th>Link Map</th>
            <th>Jarak (km)</th>
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
                ).toFixed(2) // Membulatkan jarak ke 2 desimal
              : locationError || "Menunggu lokasi pengguna...";

            return (
              <tr key={indexOfFirstItem + index}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{kelurahan.nama_kecamatan}</td>
                <td>{kelurahan.nama_kelurahan}</td>
                <td>
                  {kelurahan.gambar ? (
                    <img
                      src={`http://localhost:5000${kelurahan.gambar}`}
                      alt={kelurahan.nama_kelurahan}
                      width="100px"
                    />
                  ) : (
                    <p>No Image</p>
                  )}
                </td>
                <td>
                  <a
                    href={`https://www.google.com/maps?q=${kelurahan.latitude},${kelurahan.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buka Map
                  </a>
                </td>
                <td>{distance}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 pagination">
        {Array.from(
          { length: Math.ceil(kelurahanData.length / itemsPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default TableK;
