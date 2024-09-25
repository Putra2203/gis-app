// import React, { useState, useEffect } from "react";

// const ImageUpload = () => {
//   const [kelurahanData, setKelurahanData] = useState([]);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [selectedKelurahan, setSelectedKelurahan] = useState("");
//   const [searchKelurahan, setSearchKelurahan] = useState("");

//   useEffect(() => {
//     // Fetch kelurahan data
//     fetch("http://localhost:5000/api/kelurahan")
//       .then((res) => res.json())
//       .then((data) => setKelurahanData(data));
//   }, []);

//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const filteredKelurahan = kelurahanData
//     .sort((a, b) => a.nama_kelurahan.localeCompare(b.nama_kelurahan)) // Urutkan alfabet
//     .filter((kelurahan) =>
//       kelurahan.nama_kelurahan.toLowerCase().includes(searchKelurahan.toLowerCase())
//     );

//   const handleUpload = (e) => {
//     e.preventDefault();
//     if (!selectedFile || !selectedKelurahan) {
//       alert("Please select a file and kelurahan.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", selectedFile);
//     formData.append("id", selectedKelurahan);

//     fetch("http://localhost:5000/api/kelurahan/upload", {
//       method: "POST",
//       body: formData,
//     })
//       .then((res) => res.json())
//       .then((data) => alert(data.message))
//       .catch((error) => console.error("Error uploading file:", error));
//   };

//   return (
//     <div className="image-upload">
//       <h2>Upload Image for Kelurahan</h2>
//       <form onSubmit={handleUpload}>
//         <div>
//           <label htmlFor="kelurahan">Select Kelurahan:</label>
//           <input
//             type="text"
//             placeholder="Cari kelurahan"
//             value={searchKelurahan}
//             onChange={(e) => setSearchKelurahan(e.target.value)} // Perbarui searchTerm
//           />

//           {/* Dropdown kelurahan */}
//           <select
//             id="kelurahan"
//             value={selectedKelurahan}
//             onChange={(e) => setSelectedKelurahan(e.target.value)}
//           >
//             <option value="">-- Choose Kelurahan --</option>
//             {filteredKelurahan.length > 0 ? (
//               filteredKelurahan.map((kelurahan) => (
//                 <option key={kelurahan.id} value={kelurahan.id}>
//                   {kelurahan.nama_kelurahan}
//                 </option>
//               ))
//             ) : (
//               <option value="" disabled>
//                 Tidak ada hasil
//               </option>
//             )}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="file">Upload Image:</label>
//           <input type="file" id="file" onChange={handleFileChange} />
//         </div>

//         <button type="submit">Upload Image</button>
//       </form>
//     </div>
//   );
// };

// export default ImageUpload;
