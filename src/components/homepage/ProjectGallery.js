import { useState, useRef, useEffect } from "react";
import Marquee from "react-fast-marquee";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {FaMapMarkerAlt} from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward, IoIosArrowDroprightCircle } from "react-icons/io";
import { RiBuilding2Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const ProjectGallery = () => {

  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,              
    cssEase: 'ease-in-out',
    slidesToShow: 1, // Show 2 cards on larger screens
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };


   // --------------- API INTEGRATION --------->
      const [projects, setProjects] = useState([]);
  
      useEffect(() => {
          axios.get(`${process.env.REACT_APP_BASE_URL}/latest-with-images`, {
              withCredentials: true, // replaces fetch's `credentials: 'include'`
          })
              .then((res) => {
                  setProjects(res.data);
              })
              .catch((error) => {
                  console.error('Error fetching data:', error);
              });
      }, []);
    // --------------- API INTEGRATION END -------> 

    // Convert price to Lac or Cr format
function formatPrice(price) {
    const num = parseInt(price, 10);
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`;
    return num.toLocaleString(); // fallback
}

 const handleDetailsClick = (id) => {
        window.open(`/details/${id}`, '_blank');
  }

  return (
    <>
      <div className=" bg-[#F4EFE5]">
        <div className="container mx-auto pt-20">
          {/* Title and Link Section */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className=" text-[#3C4142] text-2xl font-bold font-geometric-regular">
                Project Gallery
              </h2>
              <div className="w-12 h-1 bg-yellow-500 mt-1"></div>
            </div>
            <Link
              to="/Projects"
              className="text-[#367588] text-sm sm:text-base font-small font-bold flex items-center no-underline"
            >
              See all Projects <span className="ml-1">→</span>
            </Link>
          </div>


          <div className="float-right flex gap-6 mb-2">
            <button className="gal-slide" onClick={() => sliderRef.current?.slickPrev()}><IoIosArrowBack className="text-xl text-white" /></button>
            <button className="gal-slide" onClick={() => sliderRef.current?.slickNext()}><IoIosArrowForward className="text-xl text-white" /></button>
          </div>
          {/* Marquee Image Section */}
          <div className="w-full h-[350px] rounded-lg overflow-hidden shadow-2xl">
            <Slider ref={sliderRef} {...settings}>
            {projects.map((project, index) => (
              <div key={index} className="relative w-[100%] h-[100%]">
                    <Marquee
                    pauseOnHover={true}
                    speed={50}
                    gradient={true}
                    gradientWidth={100}
                  >
                    {project.images.map((img, index) => (
                      <img
                        key={index}
                        src={img.image_url}
                        alt={`Project ${index + 1}`}
                        className="h-[350px] w-[600px] object-cover"
                      />
                    ))}
                  </Marquee>
                  {/* Overlay Text */}
                  <div className="absolute z-20 bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <RiBuilding2Line className="text-white text-3xl font-semibold"/>
                        <h2 className="text-white text-3xl font-semibold mb-0">
                          {project.project_name}
                        </h2>
                      </div>
                      <p className="text-white text-base mb-2">{project.title}</p>
                      <h5 className="font-bold text-lg">Starting from ₹ {formatPrice(project.price)}</h5>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-white text-base"/>
                        <p className="text-white text-base mb-0">{project.locality}, {project.city}</p>
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <IoIosArrowDroprightCircle className="text-white text-base"/>
                        <p className="text-white text-base mb-0">{project.objective2}</p>
                      </div> */}
                      
                    <button className="absolute bottom-3 right-3 bg-[#367588] hover:bg-[#1386a8] text-white text-base px-4 py-2 rounded-xl transition duration-300"
                    onClick={() => handleDetailsClick(project.id)}>
                      See Details
                    </button>
                  </div>
              </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectGallery;
