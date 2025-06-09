import React, {useState} from "react";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import { Link } from "react-router-dom";
import { IoLocationSharp, IoCall } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css/autoplay';

const ContactPage = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('https://realestatesand2sky.onrender.com/api/contact', {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      toast.success('Your details are submitted successfully! Our team will contact you soon.');
      setFormData({ name: '', email: '', message: '' }); // reset form
    } catch (err) {
      toast.error('Submission failed. Please try again!');
    } finally {
      setLoading(false);
    }
  };

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
              <h2 className="text-3xl font-bold font-geometric-regular">Contact Us</h2>
              <p className="mt-2 text-sm">
                <Link to="/" className="no-underline text-white font-semibold">Home</Link>
                <span className="mx-1">/</span>
                <span className="text-yellow-400 font-semibold">Contact</span>
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-10 px-4">
          {/* Contact Form Section */}
          <div className="flex items-center justify-center">
            <div className="w-full flex flex-col lg:flex-row lg:mt-5 mb-5">
              {/* Left Section */}
              <div className="lg:w-1/2 w-full flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-[#3C4142]">
                  Get in Touch
                </h2>
                <p className="text-lg text-gray-600 mt-2">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi non quis exercitationem culpa nesciunt nihil aut nostrum explicabo reprehenderit optio amet ab temporibus asperiores quasi cupiditate. Voluptatum ducimus voluptates voluptas?
                </p>
                <div className="mt-2 m-auto">
                  {/* <img
                    src="https://www.poornima.org/img/contact-img.png"
                    alt="Contact Illustration"
                  /> */}
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-5 mb-4 flex-1">
                      <div className="h-[40px] w-[40px] p-[6px] rounded-full border border-[#1386a8] flex items-center justify-center">
                        <IoIosMail className="text-[47px] text-[#367588]" />
                      </div>
                      <div>
                        <p className="mb-0">sand2sky@houssed.com</p>
                        <p className="mb-0">info@houssed.com</p>
                      </div>
                    </div>
                    {/* <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-5 mb-4 flex-1">
                      <div className="h-[40px] w-[40px] p-[6px] rounded-full border border-[#1386a8] flex items-center justify-center">
                        <IoCall className="text-[47px] text-[#367588]" />
                      </div>
                      <div>
                        <p className="mb-0">+91 91156 98292</p>
                        <p className="mb-0">+91 70300 66666</p>
                      </div>
                    </div> */}
                  </div>

                  {/* <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-5 mb-4">
                    <div className="h-[40px] w-[40px] p-[6px] rounded-full border border-[#1386a8] flex items-center justify-center">
                      <IoLocationSharp className="text-[47px] text-[#367588]" />
                    </div>
                    <div>
                      <p className="mb-0">Sand2sky. #1189, 4th Floor, Nilakantha Nagar Behind Passport Office, Debray College Road, NayaPalli, Bhubaneswar-751012</p>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Right Section - Contact Form */}
              <div className="md:w-1/2 p-6 bg-white rounded-lg shadow-lg contact-box">
                <h3 className="text-2xl font-bold text-[#3C4142] text-center mb-[52px]">
                  Want to Know more, let's connect.
                </h3>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-gray-700 font-semibold">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="Enter your name"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold">Message</label>
                    <textarea
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      placeholder="Write your message"
                      required
                      disabled={loading}
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#367588] text-white p-3 rounded-lg font-semibold hover:bg-[#1386a8] transition"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="w-full h-[400px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.9440388033986!2d85.79810939999999!3d20.27631689999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19a78622f0fc5f%3A0x86bdd81c7c11e2f!2sRajdhani%20College!5e1!3m2!1sen!2sin!4v1746512670715!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div> */}
      </div>
 <ToastContainer />
      <Footer />
    </div>
  );
};

export default ContactPage;
