import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import faq from "../../assets/FAQ-v3.jpg";
import axios from 'axios';

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
                // src="https://cdn.pixabay.com/photo/2017/08/18/15/25/faq-2655310_640.jpg"
                src={faq}
                alt="FAQ Illustration"
                className="w-full h-auto max-w-sm mx-auto rounded-lg shadow-lg sticky top-[120px]"
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
