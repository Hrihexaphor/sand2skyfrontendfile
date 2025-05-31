import React, { useState, useEffect } from "react";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import { RiArrowLeftSLine } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const Imgsec = () => {

  // --------------- API INTEGRATION --------->
  const { id } = useParams();
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/${id}/images`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.images);
        setImage(res.data.images);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  // --------------- API INTEGRATION END ------->

  return (
    <>
      <NewNav />
      <div className="bg-[#F4EFE5] p-4 md:p-20 mt-5">
        <Link to="/" className="cursor-pointer mt-3 text-xl font-[600] no-underline flex items-center text-white bg-[#367588] hover:bg-[#1386a8] w-[90px] rounded-lg pb-1 gap-1">
          <RiArrowLeftSLine className="text-[25px] font-bold mt-[4px]" /> Back
        </Link>
        <div className="max-w-screen-2xl mx-auto mt-4">
          <div className="flex flex-wrap -mx-1">
            {image.map((img) => (
              <div
                key={img.image_id}
                className="w-full sm:w-1/2 px-1 mb-2"
              >
                <img
                  src={img.image_url}
                  alt=""
                  className="md:h[300px] lg:h-[400px] w-full object-cover rounded"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Imgsec;
