import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const AdCards = () => {
  const [adCard, setAdCard] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/advertisement`, {
      withCredentials: true,
    })
      .then((res) => {
        setAdCard(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleClose = (id, e) => {
    e.preventDefault(); // prevent navigation
    setAdCard((prev) => prev.filter((ad) => ad.id !== id));
  };

  return (
    <>
      {adCard.map((ad) => (
        <a
          href={ad.link}
          key={ad.id}
          className="relative block cursor-pointer mb-2"
        >
          {/* Mobile-only close button */}
          <p className="test-sm text-white absolute top-1 right-1">AD.</p>
          <button
            onClick={(e) => handleClose(ad.id, e)}
            className="absolute top-2 right-2 text-gray-600 bg-white bg-opacity-75 rounded-full p-1 z-10 lg:hidden"
          >
            <FaTimes size={18} />
          </button>

          <img
            src={ad.image_url}
            alt="Ad"
            className="w-full rounded-lg"
          />
          {/* <div className="bg-white shadow-lg p-2 rounded-lg mt-2 ">
                  <p className="text-sm text-semibold font-sans mb-0">₹90.0 L - 2.13 Cr</p>
                  <p className="text-sm text-gray-600 font-sans mb-0">JBMR Green Vista, Alwar</p>
                </div> */}
        </a>
      ))}
    </>
  );
};

export default AdCards;
