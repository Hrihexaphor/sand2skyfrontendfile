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

  // const topLocations = [
  //   { icon: "📍", title: "Patia", value: "45+", unit: "Properties" },
  //   { icon: "📍", title: "Khandagiri", value: "32+", unit: "Projects" },
  //   { icon: "📍", title: "Chandaka", value: "28+", unit: "Listings" },
  //   { icon: "📍", title: "Cuttack Road", value: "50+", unit: "Deals" },
  //   { icon: "📍", title: "Jagamara", value: "20+", unit: "Flats" },
  // ];
  const properties = [
    {
      id: 1,
      title: "Luxury 3BHK Apartment",
      price: "₹1.2 Cr",
      type: "2 BHK",
      area: "1850 sqft",
      location: "Patia, Bhubaneswar",
      rentsell: "Sell",
      image:
        "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
      category: "Luxury",
      builder: "RK Builders",
    },
    {
      id: 2,
      title: "Affordable 2BHK Flat",
      price: "₹52 Lac",
      type: "2 BHK",
      area: "1250 sqft",
      location: "Jayadev Vihar, Bhubaneswar",
      rentsell: "Sell",
      image:
        "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
      category: "Affordable",
      builder: "RK Builders",
    },
    {
      id: 3,
      title: "Affordable 1BHK Flat",
      price: "₹52 Lac",
      type: "2 BHK",
      area: "1250 sqft",
      location: "Jayadev Vihar, Bhubaneswar",
      rentsell: "Sell",
      image:
        "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
      category: "Affordable",
      builder: "RK Builders",
    },
    {
      id: 4,
      title: "Affordable 2BHK Flat",
      price: "₹53 Lac",
      type: "2 BHK",
      area: "1350 sqft",
      location: "Jayadev Vihar, Bhubaneswar",
      rentsell: "Sell",
      image:
        "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
      category: "Affordable",
      builder: "RK Builders",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  // --------------- API INTEGRATION --------->
  const [topLocations, setTopLocations] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/localities`, {
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
                  backgroundImage: `url('https://houssed.com/assets/images/locality/locality2.webp')`,
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
                  <p className="text-sm">
                    <span className="text-lg font-bold text-[#FFD700]">
                      {loc.property_count}
                    </span>+ Properties
                  </p>
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
