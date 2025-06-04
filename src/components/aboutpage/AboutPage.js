import React, { useState, useEffect } from "react";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import CallAction from "../aboutpage/CallAction";
import Faq from "../aboutpage/Faq";
import { Link } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";

const AboutPage = () => {
  const [about, setAbout] = useState([]);
  const [expanded, setExpanded] = useState({}); // Tracks expanded sections

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

  const getLimitedDescription = (html, wordLimit = 150) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    const words = textContent.trim().split(/\s+/);

    if (words.length <= wordLimit) return DOMPurify.sanitize(html);

    const limitedText = words.slice(0, wordLimit).join(" ") + "...";
    return DOMPurify.sanitize(`<p>${limitedText}</p>`);
  };

  return (
    <>
      <NewNav />
      <div className="bg-[#F4EFE5] mb-[-90px]">
        {/* Banner */}
        <div className="mb-4 ps-0">
          <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden">
            <img
              src="https://cdn.pixabay.com/photo/2016/10/06/17/28/architecture-1719526_640.jpg"
              alt="breadcrumb image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div className="absolute mt-5 inset-0 flex flex-col items-center justify-center text-white">
              <h2 className="text-3xl font-bold font-geometric-regular">About Us</h2>
              <p className="mt-2 text-sm">
                <Link to="/" className="no-underline text-white font-semibold">
                  Home
                </Link>
                <span className="mx-1">/</span>
                <span className="text-yellow-400 font-semibold">About</span>
              </p>
            </div>
          </div>
        </div>

        {/* About Sections */}
        <div className="space-y-5 pb-5">
          {about.map((item, index) => {
            const isExpanded = expanded[index] || false;
            const toggleExpand = () =>
              setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));

            const descriptionHTML = isExpanded
              ? DOMPurify.sanitize(item.description)
              : getLimitedDescription(item.description);

            const layout = (
              <>
                <div
                  className="text-[#3C4142] font-bold text-2xl mb-2"
                  dangerouslySetInnerHTML={{ __html: item.title || "" }}
                />
                <div
                  className="text-base text-gray-700"
                  dangerouslySetInnerHTML={{ __html: descriptionHTML }}
                />
                {item.description.split(/\s+/).length > 150 && (
                  <button
                    onClick={toggleExpand}
                    className="mt-2 text-sm font-bold text-[#367588] border-[#367588] hover:bg-[#367588] hover:text-white border-2 rounded-lg p-2"
                  >
                    {isExpanded ? "Read Less" : "Read More"}
                  </button>
                )}
              </>
            );

            return index % 2 === 0 ? (
              <div
                key={index}
                className="w-full px-6 lg:px-16 flex flex-col lg:flex-row justify-between text-black pt-10 gap-6"
              >
                <div className="w-full lg:w-1/2 pr-6">{layout}</div>
                <div className="w-full lg:w-1/2">
                  <img
                    className="h-[200px] md:h-[400px] w-full object-cover rounded-lg"
                    src={item.image_url}
                    alt={item.title}
                  />
                </div>
              </div>
            ) : (
              <div
                key={index}
                className="flex flex-col md:flex-row justify-between px-6 lg:px-16 py-10 gap-6"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full md:w-2/5 h-[200px] md:h-[400px] rounded-lg mb-4 md:mb-0"
                />
                <div className="w-full md:w-3/5 md:pl-8">{layout}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* <CallAction /> */}
      <Faq className="-mt-[-50px]"/>
      <Footer />
    </>
  );
};

export default AboutPage;
