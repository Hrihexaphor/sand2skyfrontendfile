import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard from "./PropertyCard";
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
  
    // const handleDetailsClick = (id) => {
    //   navigate(`/details/${id}`);
    // };
  
    // const handleDeveloper = (developer_name) => {
    //   if (developer_name) {
    //     navigate(
    //       `/builderProject?developer_name=${encodeURIComponent(developer_name)}`
    //     );
    //   } else {
    //     console.warn("Developer Name is undefined");
    //   }
    // };
  
    // const formatPrice = (price) => {
    //   const num = parseInt(price, 10);
    //   if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    //   if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`;
    //   return num.toLocaleString();
    // };

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
                  onImgClick={(id) => window.open(`/imgsec/${id}`, '_blank')}
                />
              </SwiperSlide>

            ))}
          </Swiper>
        </div>
      </div>

    </>
  );
};

export default DetailsDemo;
