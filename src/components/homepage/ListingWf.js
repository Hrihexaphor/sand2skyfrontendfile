import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useNavigate } from "react-router-dom";
import BudgetRange from "./BudgetRange";
import { FaMapMarkerAlt, FaRupeeSign } from "react-icons/fa";
import { FaBuildingUser, FaArrowsLeftRightToLine } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import axios from 'axios';

const ListingWf = () => {
  const navigate = useNavigate();

  // --------------- API INTEGRATION --------->
  const [topLocations, setTopLocations] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/top-localities`, {
      withCredentials: true, // replaces fetch's `credentials: 'include'`
    })
      .then((res) => {
        setTopLocations(res.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  // --------------- API INTEGRATION END -------> 

  const handleDetailsClick = (locality) => {
    if (locality) {
      navigate(`/propertyByArea?locality=${encodeURIComponent(locality)}`);
    } else {
      console.warn("Locality is undefined");
    }
  };

  return (
    <div className="bg-[#F4EFE5]">
      <div className="text-center container mx-auto pb-16 pt-10">
        <div class="one">
          <h1 className="text-yellow-700 text-lg font-semibold uppercase tracking-widest mb-2">
            Top Locations
          </h1>
        </div>

        <h1 className=" font-bold text-[#3C4142] mt-1 text-2xl  font-geometric-regular">
          Find Property in Popular Areas
        </h1>
        <p className="text-gray-500 mt-2 mb-10 max-w-xl mx-auto font-sans">
          Explore trending locations where your dream home might be waiting for
          you.
        </p>

        {/* Marquee Image Section */}
        <div className="relative w-full rounded-lg overflow-hidden bg-transparent">
          <Marquee
            pauseOnHover={true}
            speed={50}
            gradient={true}
            gradientWidth={100}
          >
            {topLocations.map((loc, i) => (
              <div
                key={i}
                className="relative cursor-pointer rounded-lg overflow-hidden shadow-md me-4 h-40 group w-[260px] object-cover"
                style={{
                  // backgroundImage: `url('https://houssed.com/assets/images/locality/locality2.webp')`,
                  backgroundImage: `url('https://media.istockphoto.com/id/184962061/photo/business-towers.jpg?s=612x612&w=0&k=20&c=gLQLQ9lnfW6OnJVe39r516vbZYupOoEPl7P_22Un6EM=')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() => handleDetailsClick(loc.locality)}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300"></div>

                {/* Text Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-2 text-center">
                  <h3 className="text-lg font-semibold">{loc.locality}</h3>
                  {/* <p className="text-sm">
                    <span className="text-lg font-bold text-[#FFD700]">
                      {loc.hit_count}
                    </span>+ Properties
                  </p> */}
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>

      <BudgetRange />
    
    </div>
  );
};

export default ListingWf;
