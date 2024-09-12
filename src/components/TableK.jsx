import React, { useEffect, useState } from "react";

const TableK = () => {
  const [kelurahanData, setKelurahanData] = useState([]);
  const [userPosition, setUserPosition] = useState({ lat: null, lon: null });

  // Fungsi untuk menghitung jarak menggunakan rumus Haversine
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius bumi dalam kilometer
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Jarak dalam kilometer
  };

  useEffect(() => {
    // Fetch data kelurahan dari server
    fetch("http://localhost:5000/api/kelurahan")
      .then((res) => res.json())
      .then((data) => setKelurahanData(data))
      .catch((error) => console.error("Error fetching data:", error));

    // Dapatkan lokasi pengguna
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  return (
    <div className="flex items-center justify-center h-screen overflow-x-auto">
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
          {kelurahanData.map((kelurahan, index) => {
            const distance = userPosition.lat
              ? haversineDistance(
                  userPosition.lat,
                  userPosition.lon,
                  kelurahan.latitude,
                  kelurahan.longitude
                ).toFixed(2) // Membulatkan jarak ke 2 desimal
              : "Menunggu lokasi pengguna...";

            return (
              <tr key={index}>
                <td>{index + 1}</td>
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
    </div>
  );
};

export default TableK;
