import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css/autoplay';
import NewNav from "./NewNav";
import RealEstateTabs from "../homepage/RealEstateTabs";
import axios from "axios";
import { Link } from "react-router-dom";

const SearchBar = () => {
  // ============= add after 5 second End ===========>

    
const [slides, setSlides] = useState([]);

  useEffect(() => {
    axios
       .get(`${process.env.REACT_APP_BASE_URL}/hero`, {
        withCredentials: true,
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          const urls = response.data.map(item => item.image_url);
          setSlides(urls);
        }
      })
      .catch((error) => {
        console.error("Error fetching hero images:", error);
      });
  }, []);

  // const slides = [
  //    "https://res.cloudinary.com/djqpz99jb/image/upload/v1748412331/hero1_tgfln0.jpg",
  //    "https://res.cloudinary.com/djqpz99jb/image/upload/v1748412426/hero2_ffm5us.jpg",
  //   "https://res.cloudinary.com/djqpz99jb/image/upload/v1748412459/hero3_t9zruj.jpg"
  // ];


  // --------------------->
  const [propertyCounts, setPropertyCounts] = useState([]);

  const apiEndpoints = [
    {
      name: "Project",
      image:
        "https://cdn.staticmb.com/magicservicestatic/images/mb-home-web/collection/buy/webp/owner-property.webp",
      url: `${process.env.REACT_APP_BASE_URL}/getoldproperty`,
      visit: "/projects"
    },
    {
      name: "Ready to move",
      image:
        "https://cdn.staticmb.com/magicservicestatic/images/mb-home-web/collection/buy/webp/new-projects.webp",
      url: `${process.env.REACT_APP_BASE_URL}/getreadytomoveproperty`,
      visit: "/readytomoveproperties"
    },
    {
      name: "New Project",
      image:
        "https://cdn.staticmb.com/magicservicestatic/images/mb-home-web/collection/buy/webp/ready-to-move-in.webp",
      url: `${process.env.REACT_APP_BASE_URL}/getnewproperty`,
      visit: "/newprojects"
    },
    {
      name: "Resale Property",
      image:
        "https://cdn.staticmb.com/magicservicestatic/images/mb-home-web/collection/buy/webp/budget-homes.webp",
      url: `${process.env.REACT_APP_BASE_URL}/getresaleproperty`,
      visit: "/resaleproperty"
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          apiEndpoints.map((endpoint) => axios.get(endpoint.url))
        );

        const counts = responses.map((response, index) => ({
          name: apiEndpoints[index].name,
          img: apiEndpoints[index].image,
          count: Array.isArray(response.data) ? response.data.length : 0,
        }));

        setPropertyCounts(counts);
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    };

    fetchData();
  }, []);
  // --------------------->

  return (
    <>
      <div className="relative w-full h-screen">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 3000 }}
          loop
          className="w-full h-screen"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="w-full h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${slide})` }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-[#282521] bg-opacity-50"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="absolute mt-[32%] md:mt-[17%] top-0 left-0 w-full flex flex-col items-center px-6 z-10">
        <h1 className="text-white mb-1 font-bold text-3xl md:text-5xl lg:text-5xl text-center font-roboto-bold">
           Luxury Living, Priceless Memories
        </h1>

        <RealEstateTabs/>
      </div>
      {/* Property Cards Inside Carousel */}
      {/* Container for the section */}
      <div className="z-[1] container mx-auto  absolute top-[80%] md:top-[63%] left-1/2 transform -translate-x-1/2 w-full">
        <h2 className="font-bold text-white text-2xl font-geometric-regular">
          We've got properties for everyone
        </h2>
        <div className="w-16 border-b-4 border-yellow-500 my-2 "></div>

        <Swiper
          spaceBetween={24}
          loop={true}
          autoplay={{ delay: 2000 }}
          modules={[Autoplay]}
          breakpoints={{
            320: { slidesPerView: 1 },
            425: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
        >
          {propertyCounts.map((property, index) => (
            <SwiperSlide>
               <Link to={apiEndpoints[index].visit}>
               <div key={property.index}
                className="cursor-pointer sm:me-5 mt-4 bg-gray-900 rounded-xl overflow-hidden shadow-lg relative">
                <div
                  className="h-48 bg-cover bg-center relative rounded-xl"
                  style={{ backgroundImage: `url(${property.img})` }}
                >
                  <div className="absolute inset-0 bg-black opacity-30 rounded-xl"></div>
                </div>
                <div className="absolute bottom-0 p-4 text-white">
                  <h4 className="font-bold text-[40px] font-geometric-regular">{property.count}</h4>
                  <p className="text-sm sm:text-lg font-geometric-regular">{property.name}</p>
                  <a
                    href="#"
                    className="text-[#E4BA46] font-bold flex items-center mt-1 font-geometric-regular no-underline"
                  >
                    Explore →
                  </a>
                </div>
              </div>
               </Link>
            </SwiperSlide>
          ))}
        </Swiper>


      </div>

      {/* Navbar */}
      <NewNav />


      <ToastContainer />
      {/* =========== Add Modal Start =========== */}
    </>
  );
};

export default SearchBar;