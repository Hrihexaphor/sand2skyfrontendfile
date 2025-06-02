import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { FaSwimmingPool, FaWifi, FaCar, FaDumbbell, FaUtensils } from "react-icons/fa";
import axios from 'axios';


const amenities = [
  { icon: <FaSwimmingPool />, label: "Swimming Pool" },
  { icon: <FaWifi />, label: "Free WiFi" },
  { icon: <FaCar />, label: "Parking" },
  { icon: <FaDumbbell />, label: "Gym" },
  // { icon: <FaUtensils />, label: "Restaurant" },
];

export default function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState(0);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

   // --------------- API INTEGRATION --------->
    const [faqs, setFaqs] = useState([]);
  
      useEffect(() => {
            axios.get(`${process.env.REACT_APP_BASE_URL}/generalfaq`, {
                withCredentials: true, // replaces fetch's `credentials: 'include'`
            })
                .then((res) => {
                    setFaqs(res.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
      }, []);
    // --------------- API INTEGRATION END -------> 

  return (
    <>
      {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {amenities.map((amenity, index) => (
        <div key={index} className="flex items-center space-x-3 bg-gray-800 text-white p-3 rounded-lg">
          <span className="text-2xl text-red-500">{amenity.icon}</span>
          <span className="text-lg">{amenity.label}</span>
        </div>
      ))}
    </div> */}
      <div className="bg-[#F4EFE5]">
        <div className="container mx-auto sm:p-10 md:p-16 pt-5">
          <div className="mb-5">
            <h2 className="mb-2 text-2xl font-bold  font-geometric-regular text-[#3C4142]">Frequently Asked Questions</h2>
            <div className="w-12 h-1 bg-yellow-500"></div>
          </div>

          {/* FAQ Content */}
          <div className="w-full mx-auto flex flex-col lg:flex-row justify-between pb-5 faq gap-4">
            {/* Left - Image Section */}
            <div className="w-full lg:w-[30%]">
              <img
                src="https://cdn.pixabay.com/photo/2017/08/18/15/25/faq-2655310_640.jpg"
                alt="FAQ Illustration"
                className="w-full h-auto max-w-sm mx-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Right - FAQ List */}
            <div className="w-full lg:w-[60%]">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-300 bg-white p-4 mb-2 rounded-lg">
                  <button
                    className="flex justify-between items-center w-full text-lg text-left text-gray-700 font-semibold focus:outline-none"
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="flex gap-2 items-center">
                      <span className="faq_count">{index+1}</span>
                      {faq.question}
                    </div>
                    <ChevronDown
                      className={`transition-transform ${openFAQ === index ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>
                  {openFAQ === index && (
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
