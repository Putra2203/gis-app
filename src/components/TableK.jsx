import React, { useEffect, useState } from "react";

const MainComp = () => {
  const [kelurahanData, setKelurahanData] = useState([]);
  const [userPosition, setUserPosition] = useState({ lat: null, lon: null });
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState(""); // Input for search term in uppercase
  const [filteredData, setFilteredData] = useState([]); // Data after search

  // Function to calculate distance using Haversine formula
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
  };

  useEffect(() => {
    // Fetch kelurahan data from server
    fetch("http://localhost:5000/api/kelurahan")
      .then((res) => res.json())
      .then((data) => {
        setKelurahanData(data);
        setFilteredData(data); // Set initial filtered data to be all data
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });

    // Get user's location
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
          setLocationError("Unable to access user location.");
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Function to handle search when the search button is clicked
  const handleSearch = () => {
    const filtered = kelurahanData.filter(
      (kelurahan) =>
        kelurahan.nama_kecamatan.toUpperCase().includes(searchTerm) ||
        kelurahan.nama_kelurahan.toUpperCase().includes(searchTerm)
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page after search
  };

  // Get the current items to display based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Fungsi untuk mengubah halaman
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const visiblePages = [];
  const pageLimit = 5;
  let startPage = Math.max(currentPage - Math.floor(pageLimit / 2), 1);
  let endPage = Math.min(
    startPage + pageLimit - 1,
    Math.ceil(filteredData.length / itemsPerPage)
  );

  if (endPage - startPage < pageLimit - 1) {
    startPage = Math.max(endPage - pageLimit + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  if (loading) {
    return <p>Loading kelurahan data...</p>;
  }

  if (locationError) {
    return <p>{locationError}</p>;
  }

  return (
    <div className="flex max-w-screen-sm p-4 mx-auto my-32 lg:max-w-screen-lg md:max-w-screen-md">
      <div className="container p-4 mx-auto text-sm lg:p-10 rounded-2xl bg-slate-200 ">
        {/* Search Input and Button */}

        <div className="flex flex-col justify-between lg:flex-row">
          <div className="flex mb-4">
            <label htmlFor="itemsPerPage" className="mr-2 text-slate-900">
              Show Entries :
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-2 py-1 text-black bg-white border rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </select>
          </div>

          <div className="flex gap-4 lg:w-2/3">
            <button
              onClick={handleSearch}
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Search
            </button>
            <input
              type="text"
              placeholder="Search by Kecamatan or Kelurahan"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toUpperCase())} // Automatically convert to uppercase
              className="w-full px-4 py-2 bg-white border rounded-lg"
            />
          </div>
        </div>

        <div className="items-center hidden gap-4 p-4 mt-4 md:grid lg:grid-cols-8 md:grid-cols-6">
          <span className="text-gray-600 lg:col-span-1 md:col-span-1">No</span>
          <span className="text-gray-600 lg:col-span-2 md:col-span-1">
            Kecamatan
          </span>
          <span className="text-gray-600 lg:col-span-2 md:col-span-1">
            Kelurahan
          </span>
          <span className="text-gray-600 lg:col-span-1 md:col-span-1">
            Distance
          </span>
          <span className="text-gray-600 lg:col-span-1 md:col-span-1">
            Map Link
          </span>
          <span className="text-gray-600 lg:col-span-1 md:col-span-1">
            Photo
          </span>
        </div>

        {currentItems.map((kelurahan, index) => (
          <div
            key={kelurahan.id}
            className="flex flex-col items-center justify-center gap-4 p-4 mt-4 bg-gray-100 rounded-lg lg:grid lg:grid-cols-8 md:grid-cols-6"
          >
            <div className="lg:col-span-1 md:col-span-1">
              <span className="text-gray-700">
                {index + 1 + indexOfFirstItem}
              </span>
            </div>
            <div className="lg:col-span-2 md:col-span-1">
              <span className="text-gray-700">{kelurahan.nama_kecamatan}</span>
            </div>
            <div className="lg:col-span-2 md:col-span-1">
              <span className="text-gray-900 ">{kelurahan.nama_kelurahan}</span>
            </div>
            <div className="lg:col-span-1 md:col-span-1">
              {userPosition.lat && userPosition.lon ? (
                <span className="text-gray-700">
                  {haversineDistance(
                    userPosition.lat,
                    userPosition.lon,
                    kelurahan.latitude,
                    kelurahan.longitude
                  ).toFixed(2)}{" "}
                  km
                </span>
              ) : (
                <span className="text-gray-700">Location unknown</span>
              )}
            </div>
            <div className="items-center lg:col-span-1 md:col-span-1">
              <a
                href={`https://www.google.com/maps?q=${kelurahan.latitude},${kelurahan.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-white bg-blue-500 rounded-md lg:py-1 lg:px-2 md:px-1 md:py-1 hover:bg-blue-600"
              >
                Buka Maps
              </a>
            </div>
            <div className="lg:col-span-1 md:col-span-1">
              <img
                src={`http://localhost:5000${kelurahan.gambar}`}
                alt={kelurahan.nama_kelurahan}
                className="object-cover rounded-lg lg:h-24 lg:w-32"
              />
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div className="flex justify-center mt-6 join no">
          <button
            className="text-black bg-white border-none hover:bg-slate-200 join-item btn"
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            «
          </button>
          <button className="text-black bg-white border-none hover:bg-slate-200 join-item btn">
            Page {currentPage} of{" "}
            {Math.ceil(filteredData.length / itemsPerPage)}
          </button>
          <button
            className="text-black bg-white border-none hover:bg-slate-200 join-item btn"
            onClick={() =>
              paginate(
                Math.min(
                  currentPage + 1,
                  Math.ceil(filteredData.length / itemsPerPage)
                )
              )
            }
            disabled={
              currentPage === Math.ceil(filteredData.length / itemsPerPage)
            }
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainComp;
