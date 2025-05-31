import React, { useState, useEffect } from "react";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import CallAction from "../aboutpage/CallAction";
import Faq from "../aboutpage/Faq";
import { Link } from "react-router-dom";
import axios from 'axios';

const AboutPage = () => {

  const [about, setAbout] = useState([]);
  // <------------ API INTEGRATION START -------------->
  // Fetch blog data
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/aboutus`, {
        withCredentials: true,
      })
      .then((res) => {
        setAbout(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  // <------------ API INTEGRATION END -------------->

  return (
    <>
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
              <h2 className="text-3xl font-bold font-geometric-regular">About Us</h2>
              <p className="mt-2 text-sm">
                <Link to="/" className="no-underline text-white font-semibold">Home</Link>
                <span className="mx-1">/</span>
                <span className="text-yellow-400 font-semibold">About</span>
              </p>
            </div>
          </div>
        </div>
        {about.map((item, index) => (
          index % 2 === 0 ? (
            // Odd index layout: Text Left, Image Right
            <div
              key={index}
              className="w-full mt-[50px] pb-[20px] px-6 lg:px-16 lg:h-[50vh] flex bg-cover bg-center justify-between pl-8 text-black pt-10"
            >
              <div className="about-left w-1/2 pr-6">
                <div className="text-[#3C4142] font-bold text-2xl mb-2"
                  dangerouslySetInnerHTML={{
                    __html: item.title || '',
                  }}
                />
                <div className="text-base text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: item.description || '',
                  }}
                />
                {/* <h2 className="text-[#3C4142] font-bold text-2xl mb-2">{item.title}</h2>
                <p className="text-base text-gray-700">{item.description}</p> */}
              </div>
              <div className="about-right w-1/2">
                <div className="about-img-box">
                  <img
                    className="h-full w-full object-cover rounded-lg"
                    src={item.image_url}
                    alt={item.title}
                  />
                </div>
              </div>
            </div>
          ) : (
            // Even index layout: Image Left, Text Right (Responsive stacked layout)
            <div
              key={index}
              className="flex flex-col md:flex-row justify-between px-6 lg:px-16 w-full mx-auto py-10"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full md:w-2/5 max-w-sm rounded-lg abt-profile-img mb-4 md:mb-0"
              />
              <div className="w-full md:w-3/5 md:pl-8">
              <div className="text-[#3C4142] font-bold text-2xl mb-2"
                  dangerouslySetInnerHTML={{
                    __html: item.title || '',
                  }}
                />
                <div className="text-gray-700 text-justify"
                  dangerouslySetInnerHTML={{
                    __html: item.description || '',
                  }}
                />
                {/* <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                <p className="text-gray-700 text-justify">{item.description}</p> */}
              </div>
            </div>
          )
        ))}

      </div>
      {/* <CallAction /> */}
      <Faq />
      <Footer />
    </>

  );
};

export default AboutPage;
