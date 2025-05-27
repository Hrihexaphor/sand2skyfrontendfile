import React, {useState, useEffect} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { FaBuildingUser, FaArrowsLeftRightToLine } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import axios from "axios";
import {
  FaRupeeSign,
  FaMapMarkerAlt
} from "react-icons/fa";

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

const DetailsDemo = () => {

  const navigate = useNavigate();
    const [topProjects, setTopProjects] = useState([]);
  
    useEffect(() => {
      axios
        .get(`${process.env.REACT_APP_BASE_URL}/projectfromtopbuilder`, {
          withCredentials: true,
        })
        .then((res) => {
          setTopProjects(res.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, []);
  
    const handleDetailsClick = (id) => {
      navigate(`/details/${id}`);
    };
  
    const handleDeveloper = (developer_name) => {
      if (developer_name) {
        navigate(
          `/builderProject?developer_name=${encodeURIComponent(developer_name)}`
        );
      } else {
        console.warn("Developer Name is undefined");
      }
    };
  
    const formatPrice = (price) => {
      const num = parseInt(price, 10);
      if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
      if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`;
      return num.toLocaleString();
    };

  return (
    <>
      <div className="bg-[#F4EFE5] ">
        <div className="container mx-auto p-6">
          <div className="mb-3">
            <h2 className="mb-2  text-2xl text-[#3C4142] font-bold font-geometric-regular">Top Projects from Builders</h2>
            <div className="w-12 h-1 bg-yellow-500"></div>
          </div>
          <Slider {...settings}>
            {topProjects.map((project) => (
              <div key={project.id} className="p-2">
                <div className="bg-white rounded-lg overflow-hidden relative">
                  <img
                    src={project.primary_image}
                    alt={project.project_name}
                    className="w-full h-48 object-cover"
                  />
                  {project.is_featured === true && (
                    <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 text-[#fff] py-[5px] px-[10px] rounded-[5px]">
                      Featured
                    </p>
                  )}
                  <div className="p-3">
                    <h3 className="text-lg text-[#3C4142] bold mb-2 mt-[-2px]">{project.project_name}</h3>
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="flex gap-2 items-center w-[50%] mb-2">
                        <FaRupeeSign className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Price</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{project.price}</p>
                        </div>

                      </div>
                      <div className="flex gap-2 items-center w-[50%]  mb-2">
                        <IoHome className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Type</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{project.subcategory_name}</p>
                        </div>

                      </div>
                      <div className="flex gap-2 items-center w-[50%] mb-2">
                        <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">SBA</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{project.built_up_area}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center w-[50%]">
                        <FaBuildingUser className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Builder</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px] w-[90px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer" onClick={() =>
                              handleDeveloper(project.developer_name)
                            }>{project.developer_name}</p>
                        </div>

                      </div>
                    </div>
                    <div className="flex gap-2 items-center mb-2">
                      <FaMapMarkerAlt className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                      <div>
                        <p className="text-[#3C4142] text-[13px] font-bold mb-0">Location</p>
                        <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{project.locality}, {project.city}</p>
                      </div>
                    </div>
                    <button
                      className="px-3 py-1 bg-[#367588] w-full text-white text-base rounded-md hover:bg-[#1386a8]"
                       onClick={() => handleDetailsClick(project.id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

    </>
  );
};

export default DetailsDemo;
