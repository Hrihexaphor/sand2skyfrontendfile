import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const AdBanner = ({ location }) => {
  const [adCard, setAdCard] = useState([]);
  const [city, setCity] = useState("");

  // Detect city on mount
  useEffect(() => {
    const getCity = async () => {
      try {
        const res = await axios.get("https://ipapi.co/json/");
        setCity(res.data.city || "Bhubaneswar"); // fallback if empty
      } catch (error) {
        console.error("Failed to detect city, using fallback:", error);
        setCity("Bhubaneswar");
      }
    };

    getCity();
  }, []);

  // Fetch ads and filter by location, city, and date
  useEffect(() => {
    if (!city) return; // wait for city detection

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/advertisement`, {
        withCredentials: true,
      })
      .then((res) => {
        const now = new Date();

        const filteredAds = res.data.filter((ad) => {
          const adLocation = ad.location?.toLowerCase();
          const matchLocation = location?.toLowerCase();
          const start = new Date(ad.start_date);
          const end = new Date(ad.end_date);
          const cityMatch = ad.cities?.some(
            (c) => c.name?.trim().toLowerCase() === city.trim().toLowerCase()
          );
          const isActive = now >= start && now <= end;
          const isCorrectSize = ad.image_size === "856x72";

          return adLocation === matchLocation && cityMatch && isActive && isCorrectSize;
        });
        setAdCard(filteredAds);
      })
      .catch((error) => {
        console.error("Error fetching advertisement data:", error);
      });
  }, [location, city]);

  return (
    <>
      {adCard.length === 0 && (
        <p className="text-center text-gray-500">No advertisements available.</p>
      )}

      {adCard.map((ad) => (
        <a
          href={ad.link}
          key={ad.id}
          target="_blank"
          rel="noreferrer"
          className="relative block cursor-pointer mb-4"
        >
          <p className="text-sm text-white absolute top-1 left-1 bg-black bg-opacity-50 px-1 rounded-sm">
            AD.
          </p>

          <img
            src={ad.image_url}
            alt={`Ad ${ad.id}`}
            className="w-full rounded-lg"
            loading="lazy"
          />
        </a>
      ))}
    </>
  );
};

export default AdBanner;
