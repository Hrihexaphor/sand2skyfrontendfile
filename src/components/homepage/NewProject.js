import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaArrowsLeftRightToLine, FaBuildingUser } from "react-icons/fa6";
import { BsCurrencyRupee } from "react-icons/bs";
import { IoHome } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  gap: 3,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 3 },
    },
    {
      breakpoint: 768,
      settings: { slidesToShow: 2 },
    },
    {
      breakpoint: 480,
      settings: { slidesToShow: 1 },
    },
  ],
};

const NewProject = () => {
  const navigate = useNavigate();
  const [newproperty, setNewproperty] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/getnewproperty`, {
        withCredentials: true,
      })
      .then((res) => {
        setNewproperty(res.data);
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
    <div className="bg-[#F4EFE5]" id="new-project-section">
      <div className="mb-3 container pt-5">
        <h2 className="mb-2 text-2xl font-bold font-geometric-regular text-[#3C4142]">
          New Projects
        </h2>
        <div className="w-12 h-1 bg-yellow-500"></div>
      </div>

      <div className="flex justify-center items-center px-4 pt-4">
        <div className="container mx-auto">
          <Slider {...settings}>
            {newproperty.map((property, index) => (
              <div key={index} className="p-2">
                <div className="w-full bg-white rounded-lg cursor-pointer tranding-card">
                  <div className="h-[200px] w-full img-box relative">
                    <img
                      src={property.primary_image}
                      className="h-full w-full object-cover"
                      alt={property.project_name}
                    />
                    {property.is_featured && (
                      <p className="absolute top-1 left-[3%] bg-yellow-500 text-white py-1 px-2 rounded font-bold text-sm">
                        Featured
                      </p>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="text-base text-[#3C4142] font-semibold mb-2">
                      {property.project_name}
                    </h3>

                    <div className="card-body flex flex-wrap justify-between items-center">
                      <div className="flex gap-2 items-center w-[50%] mb-2">
                        <BsCurrencyRupee className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-1" />
                        <div>
                          <p className="text-[13px] text-[#3C4142] font-bold mb-0">
                            Price
                          </p>
                          <p className="text-[13px] text-gray-600 mt-0 mb-0">
                            {formatPrice(property.price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center w-[50%] mb-2">
                        <IoHome className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-1" />
                        <div>
                          <p className="text-[13px] text-[#3C4142] font-bold mb-0">
                            Type
                          </p>
                          <p className="text-[13px] text-gray-600 mt-0 w-[90px] overflow-hidden text-ellipsis whitespace-nowrap mb-0">
                            {property.category_name}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center w-[50%] mb-2">
                        <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-1" />
                        <div>
                          <p className="text-[13px] text-[#3C4142] font-bold mb-0">
                            SBA
                          </p>
                          <p className="text-[13px] text-gray-600 mt-0 mb-0">
                            {property.built_up_area} sq.ft.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 items-center w-[50%] mb-2">
                        <FaBuildingUser className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-1" />
                        <div>
                          <p className="text-[13px] text-[#3C4142] font-bold mb-0">
                            Builder
                          </p>
                          <p
                            className="text-[13px] text-gray-600 mt-0 w-[90px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer mb-0"
                            onClick={() =>
                              handleDeveloper(property.developer_name)
                            }
                          >
                            {property.developer_name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center mb-3">
                      <FaMapMarkerAlt className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-1" />
                      <div>
                        <p className="text-[13px] text-[#3C4142] font-bold mb-0">
                          Location
                        </p>
                        <p className="text-[13px] text-gray-600 mt-0 mb-0">
                          {property.locality}, {property.city}
                        </p>
                      </div>
                    </div>

                    <button
                      className="px-3 py-1 bg-[#367588] w-full text-white text-base rounded-md hover:bg-[#1386a8]"
                      onClick={() => handleDetailsClick(property.id)}
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
    </div>
  );
};

export default NewProject;