import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const AdCards = ({ location }) => {
  const [adCard, setAdCard] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/advertisement`, {
      withCredentials: true,
    })
      .then((res) => {
        const now = new Date();

        const filteredAds = res.data.filter(ad => {
          const adLocation = ad.location?.toLowerCase();
          const matchLocation = location?.toLowerCase();

          const start = new Date(ad.start_date);
          const end = new Date(ad.end_date);

          // Check if ad matches location and is within date range
          return (
            adLocation === matchLocation &&
            now >= start &&
            now <= end
          );
        });

        setAdCard(filteredAds);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [location]);

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
          target="_blank"
          rel="noreferrer"
          className="relative block cursor-pointer mb-2"
        >
          <p className="text-sm text-white absolute top-1 left-1">AD.</p>
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
        </a>
      ))}
    </>
  );
};

export default AdCards;
