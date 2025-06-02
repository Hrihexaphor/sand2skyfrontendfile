import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
// ------- slider -----------
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
// ------- slider end -----

const DetailsDemo = () => {

  const navigate = useNavigate();
    const [topProjects, setTopProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
            const [modalImages, setModalImages] = useState([]);
            const [pname, setPname] = useState("");
  
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
  
    const handleImageClick = async (property) => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/${property.id}/images`, {
            withCredentials: true,
          });
          setModalImages(res.data.images);
          setPname(property.project_name || "Property Name");
          setShowModal(true);
        } catch (error) {
          console.error("Error fetching image data:", error);
        }
      };

  return (
    <>
      <div className="bg-[#F4EFE5] ">
        <div className="container mx-auto p-6">
          <div className="mb-5">
            <h2 className="mb-2  text-2xl text-[#3C4142] font-bold font-geometric-regular">Top Projects from Builders</h2>
            <div className="w-12 h-1 bg-yellow-500"></div>
          </div>
          <Swiper
            spaceBetween={24}
            loop={true}
            autoplay={{ delay: 2000 }}
            modules={[Autoplay]}
            breakpoints={{
              320: { slidesPerView: 1 },
              425: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1440: { slidesPerView: 4 },
            }}
          >
            {topProjects.map((property, index) => (
              <SwiperSlide>
                <PropertyCard
                  key={index}
                  property={property}
                 onViewDetails={(id) => window.open(`/details/${id}`, '_blank')}
                  onImgClick={() => handleImageClick(property)}
                />
              </SwiperSlide>

            ))}
          </Swiper>
        </div>
        {/* ----------- Modal ----------- */}
                    {showModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white w-full mx-5 max-w-4xl rounded shadow-lg p-6 relative">
                          <div className="flex items-center justify-between mb-2">
                            <h1 className="text-xl font-semibold">{pname}</h1>
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => setShowModal(false)}
                            >
                              <FaTimes size={20} />
                            </button>
                          </div>
                          <div className="flex flex-wrap -mx-1 max-h-[80vh] overflow-y-auto">
                            {modalImages.map((img) => (
                              <div key={img.image_id} className="w-full sm:w-1/2 px-1 mb-2">
                                <img
                                  src={img.image_url}
                                  alt=""
                                  className="md:h-[300px] lg:h-[300px] w-full object-cover rounded"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
              
                    )}
      </div>

    </>
  );
};

export default DetailsDemo;
