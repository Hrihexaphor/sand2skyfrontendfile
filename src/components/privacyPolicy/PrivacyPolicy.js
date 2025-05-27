import React, {useState, useEffect} from "react";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import axios from "axios";

const PrivacyPolicy = () => {

  const [privacyPolicy, setPrivacyPolicy] = useState([]);
  // <------------ API INTEGRATION START -------------->
  // Fetch blog data
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/privacypolicy`, {
        withCredentials: true,
      })
      .then((res) => {
        setPrivacyPolicy(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  // <------------ API INTEGRATION END -------------->

  return (
    <div>
      <NewNav />
      <div className="bg-[#F4EFE5]">
        <div className="mb-4 ps-0">
          <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden">
            <img
              src="https://cdn.pixabay.com/photo/2016/10/06/17/28/architecture-1719526_640.jpg"
              alt="breadcrumb image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            <div className="absolute mt-5 inset-0 flex flex-col items-center justify-center text-white">
              <h2 className="text-3xl font-bold font-geometric-regular">Privacy Policy</h2>
              <p className="mt-2 text-sm">
                {/* <Link to="/" className="no-underline text-white font-semibold">Home</Link> */}
                <span className="mx-1">/</span>
                <span className="text-yellow-400 font-semibold">Privacy Policy1</span>
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-10 px-4">
          {/* Contact Form Section */}
          <div className="flex items-center justify-center">
            <h3 className="text-2xl font-bold font-geometric-regular">
              {privacyPolicy.title}
            </h3>
            <div
              className="w-full text-gray-500 text-sm"
              dangerouslySetInnerHTML={{ __html: privacyPolicy.description }}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
