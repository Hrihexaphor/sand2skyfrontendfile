import { useRef, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Faq from "../../components/aboutpage/Faq";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaBuildingUser } from "react-icons/fa6";
import { IoBedOutline } from "react-icons/io5";
import { ChevronDown } from "lucide-react";
import Review from "../review/Review";
import AdCards from "../advertisement/AdvertiseCard";
import {
  FaDumbbell,
} from "react-icons/fa";

import {
  FaBuilding,
  FaVectorSquare,
  FaKey,
  FaEye,
  FaPhone,
  FaDownload,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaChartLine,
  FaCalculator,
  FaRupeeSign,
  FaBook,
  FaBath,
  FaTimes,
  FaRegCalendarAlt,
  FaBalanceScale,
  FaBuffer,
} from "react-icons/fa";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { LuBuilding2, LuReceiptIndianRupee } from "react-icons/lu";
import { BsHouseGearFill } from "react-icons/bs";
import { GiSofa } from "react-icons/gi";
import { FaArrowsLeftRightToLine, FaUserGraduate } from "react-icons/fa6";
import { GrStatusGood } from "react-icons/gr";
import { AiOutlineRightCircle } from "react-icons/ai";
import { MdArrowForwardIos, MdBalcony } from "react-icons/md";
import { PiBuildingOfficeBold, PiHospital } from "react-icons/pi";
import { LiaSchoolSolid } from "react-icons/lia";
import { IoBed } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
//  import water from "../../assets/images/water.jpg";
import water from "../../assets/images/water1.png";
// import water from "../../assets/images/water2.svg";
import convenience from "../../assets/images/Convenience.png";
import safety from "../../assets/images/Safety.png";
import axios from 'axios';
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css/autoplay';

const PropertyDetails = () => {
  const [isContactSellerModalOpen, setIsContactSellerModalOpen] = useState(false);
  const [isShowContactModalOpen, setIsShowContactModalOpen] = useState(false);
  const [isDownloadBrochureModalOpen, setIsDownloadBrochureModalOpen] = useState(false);
  const navigate = useNavigate();

  const [formPurpose, setFormPurpose] = useState("contact");
  const [form, setForm] = useState({ name: "", email: "", contact: "", captcha: "" });
  const [errors, setErrors] = useState({});
  const [captchaText, setCaptchaText] = useState("");

  useEffect(() => {
    // Generate a new captcha when the component mounts or the modal opens
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&^*';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptchaText(captcha);
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const [loading, setLoading] = useState(false);

  const handleContactSeller = async (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.contact.trim()) {
      newErrors.contact = "Contact number is required";
    } else if (!/^\d{10}$/.test(form.contact)) {
      newErrors.contact = "Contact number must be 10 digits";
    }

    if (form.captcha !== captchaText) {
      newErrors.captcha = "Captcha doesn't match";
      isValid = false;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const payload = {
        property_id: property?.details?.property_id,
        phone: form.contact,
        project_name: property?.details?.project_name,
        title: property?.basic.title,
        name: form.name,
        email: form.email,
      };

      try {
        setLoading(true);

        const response = await fetch("https://realestatesand2sky.onrender.com/api/propinquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to submit inquiry");

        setForm({ name: "", email: "", contact: "", captcha: "" });
        generateCaptcha();
        setIsContactSellerModalOpen(false);

        if (formPurpose === "contact") {
          setIsShowContactModalOpen(true);
          toast.success('Your details are submitted successfully! Our team will contact you soon.');
        }
        if (formPurpose === "brochure") {
          const brochureDocs = property?.documents?.filter(doc =>
            doc.type.toLowerCase() === "brochure" || doc.type.toLowerCase() === "broucher"
          );

          if (brochureDocs?.length > 0) {
            brochureDocs.forEach((doc, index) => {
              const link = document.createElement("a");
              link.href = doc.file_url;
              link.download = `Brochure-${index + 1}.pdf`; // You can customize this name
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            });

            toast.success("Brochure(s) are downloading...");
          } else {
            toast.error("No brochure found to download.");
          }
        }
      } catch (error) {
        console.error("Submission Error:", error);
        toast.error("Submission failed. Please try again!");
      } finally {
        setLoading(false);
      }

    }
  };

  const NextArrow = ({ onClick }) => (
    <div
      className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-black bg-opacity-50 p-2 rounded-full"
      onClick={onClick}
    >
      <FaChevronRight className="text-white" />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer bg-black bg-opacity-50 p-2 rounded-full"
      onClick={onClick}
    >
      <FaChevronLeft className="text-white" />
    </div>
  );

  const posts = [
    {
      id: 1,
      author: "Jonathan Reinink",
      date: "Aug 18",
      categories: ["Cooking", "Recipe"],
      image:
        "https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      title: "Simplest Salad Recipe ever",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      id: 2,
      author: "Jonathan Reinink",
      date: "Aug 18",
      categories: ["Cooking", "Recipe"],
      image:
        "https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      title: "Best Pizza in Town",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      id: 3,
      author: "Jonathan Reinink",
      date: "Aug 18",
      categories: ["Cooking", "Recipe"],
      image:
        "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      title: "Best Salad Images ever",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
  ];

  const amenities = [
    {
      name: "Convenience",
      icon: convenience,
      items: [
        "24X7 Water Supply",
        "Party Lawn",
        "Children Playing Zone",
        "Senior Citizens' Walking Track",
        "Co-working Space",
        "Society Office",
        "Yoga Room",
        "Meditation Zone",
        "Senior Citizen Sitting Area",
        "Parking and Transportation",
        "Multipurpose Hall",
        "Convenience Store",
      ],
    },
    {
      name: "Safety",
      icon: safety,
      items: [
        "Reserved Parking",
        "CCTV For Common Areas",
        "Earthquake-resistant",
        "24/7 Security",
        "CCTV Surveillance",
        "Entrance Gate With Security",
        "Smart Locks",
      ],
    },
  ];


  const tools = [
    {
      icon: <FaChartLine className="text-red-500 text-4xl" />,
      title: "Rates & Trends",
      description: "Know all about Property Rates & Trends in your city",
      link: "#",
    },
    {
      icon: <FaCalculator className="text-red-500 text-4xl" />,
      title: "EMI Calculator",
      description: "Know how much you'll have to pay every month on your loan",
      link: "#",
    },
    {
      icon: <FaRupeeSign className="text-red-500 text-4xl" />,
      title: "Investment Hotspot",
      description: "Discover the top localities in your city for investment",
      link: "#",
    },
    {
      icon: <FaBook className="text-red-500 text-4xl" />,
      title: "Research Insights",
      description: "Get experts insights and research reports on real estate",
      link: "#",
    },
  ];

  const setting = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const nearby = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const propertiesnearby = [
    {
      id: 1,
      type: "3bhk",
      location: "Bhubaneswar",
      area: "1500 sq.ft.",
      builder: "DN Builder",
      name: "Luxury Apartment",
      price: "₹2.5 Cr",
      featured: true,
      img: "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
    },
    {
      id: 2,
      flat: "3bhk",
      location: "Bhubaneswar",
      area: "1500 sq.ft.",
      builder: "DN Builder",
      name: "Modern Villa",
      price: "₹3.8 Cr",
      featured: false,
      img: "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
    },
    {
      id: 3,
      flat: "3bhk",
      location: "Patia,Bhubaneswar",
      area: "1500 sq.ft.",
      builder: "DN Builder",
      name: "Skyline Towers",
      price: "₹1.2 Cr",
      featured: true,
      img: "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
    },
    {
      id: 4,
      flat: "3bhk",
      location: "Patia,Bhubaneswar",
      area: "1500 sq.ft.",
      builder: "DN Builder",
      name: "Green Residency",
      price: "₹90 Lakh",
      featured: true,
      img: "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
    },
  ];

  const properties = [
    {
      id: 1,
      flat: "3bhk",
      location: "Bhubaneswar",
      area: "1500 sq.ft.",
      builder: "DN Builder",
      name: "Luxury Apartment",
      price: "₹2.5 Cr",
      featured: true,
      img: "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
    },
    {
      id: 2,
      flat: "3bhk",
      location: "Bhubaneswar",
      area: "1500 sq.ft.",
      builder: "DN Builder",
      name: "Modern Villa",
      price: "₹3.8 Cr",
      featured: true,
      img: "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
    },
    {
      id: 3,
      flat: "3bhk",
      location: "Patia,Bhubaneswar",
      area: "1500 sq.ft.",
      builder: "DN Builder",
      name: "Skyline Towers",
      price: "₹1.2 Cr",
      featured: false,
      img: "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
    },
    {
      id: 4,
      flat: "3bhk",
      location: "Patia,Bhubaneswar",
      area: "1500 sq.ft.",
      builder: "DN Builder",
      name: "Green Residency",
      price: "₹90 Lakh",
      featured: false,
      img: "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
    },
    {
      id: 5,
      flat: "3bhk",
      location: "Patia,Bhubaneswar",
      area: "1500 sq.ft.",
      builder: "DN Builder",
      name: "Sunrise Heights",
      price: "₹1.5 Cr",
      featured: false,
      img: "https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };



  // --------------- API INTEGRATION --------->
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/property/${id}`, {
      withCredentials: true, // replaces fetch's `credentials: 'include'`
    })
      .then((res) => {
        setProperty(res.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  // --------------- API INTEGRATION END -------> 


  const images = [
    ...(property?.images?.map(img => img.image_url) || []),
    // ...defaultImages
  ];

  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (property) {
      const isProjectType =
        property.basic?.property_category_name === "Project Apartment" ||
        property.basic?.property_category_name === "Project Villa";

      if (isProjectType && Array.isArray(property.bhk_configurations) && property.bhk_configurations.length > 0) {
        setActiveTab(property.bhk_configurations[0].bhk_type);
      } else if (Array.isArray(property.documents)) {
        const matchingDoc = property.documents.find(
          (doc) => /BHK$/i.test(doc.type) || doc.type.toLowerCase() === "floorplan"
        );
        if (matchingDoc) {
          setActiveTab(matchingDoc.type);
        }
      }
    }
  }, [property]);


  // Convert price to Lac or Cr format
  function formatPrice(price) {
    const num = parseInt(price, 10);
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`;
    return num.toLocaleString(); // fallback
  }

  // Format date string to "DD MMM YYYY"
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  // ------------ Similar project -------->
  const [similar, setSimilar] = useState([]);
  // <------------ API INTEGRATION START -------------->
  // Fetch blog data
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/getminimumproperty`, {
        withCredentials: true,
      })
      .then((res) => {
        setSimilar(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  // <------------ API INTEGRATION END -------------->
  // ------------ FAQ -------->
  // --------------- API INTEGRATION --------->
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/faq/${id}`, {
      withCredentials: true, // replaces fetch's credentials: 'include'
    })
      .then((res) => {
        setFaqs(res.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  // --------------- API INTEGRATION END ------->

  const [openFAQ, setOpenFAQ] = useState(0);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

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

  return (
    <>
      <NewNav />
      <div className="bg-[#F4EFE5] pt-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Image Carousel */}
            {/* <div className="md:col-span-12 lg:col-span-8 bg-white lg:p-6 p-2 h-[230px] md:h-[400px] xl:h-[506px] relative rounded-lg shadow-lg">
              
            </div> */}
            <Slider {...settings} className="md:col-span-12 lg:col-span-8 bg-white lg:p-6 p-2 h-[230px] md:h-[400px] xl:h-[572px] rounded-lg shadow-lg dtl-slider ">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Property ${index}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ))}
            </Slider>


            {/* Property Info */}
            <div className="md:col-span-12 lg:col-span-4 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-[#367588] mb-0">
                {property?.details?.project_name}
              </h2>
              <h4 className="text-base font-bold text-gray-500 mb-0">
                {property?.basic?.title}
              </h4>
              <div className="flex items-center space-x-2  dtl-location">
                <FaMapMarkerAlt className="text-[#367588]" />
                <p className="mb-0 text-[#3C4142] w-[326px] overflow-hidden text-ellipsis whitespace-nowrap" title={property?.location?.address}>{property?.location?.address}</p>
              </div>
               <div className="bg-[#F5F5DC] rounded-lg mt-2 p-2 shadow-md flex items-center gap-4 m-auto cursor-pointer" 
            onClick={() => handleDeveloper(property?.basic?.developer_name)}>
              <div className="h-[40px] w-[40px] rounded-full bg-yellow-500 p-1">
                <img src={property?.basic?.developer_logo || "https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue-thumbnail.png"} alt="Builder img" className="h-[100%] w-[100%] rounded-full" />
              </div>
              <div className="flex flex-col">
                <p className="text-base font-semibold mb-0">Builder :</p>
                <p className="text-sm font-semibold mb-0">{property?.basic?.developer_name}</p>
              </div>
            </div>
              <div className=" text-xl font-bold text-gray-900 dtl-price">
                ₹{formatPrice(property?.basic?.expected_price)}
              </div>
              <p className="text-gray-500 dtl-pricesq mb-0">Price per sqft: ₹{formatPrice(property?.basic?.price_per_sqft)}</p>

              <div className=" grid grid-cols-2 gap-2 dtl-flex1">
                <div>
                  <div className="flex gap-2 items-center dtl-head">
                    <PiBuildingOfficeBold className="bold" />
                    <p className="font-semibold mb-0">Type</p>
                  </div>
                  <p className="dtl-body">{property?.basic?.property_subcategory_name}</p>
                </div>
                <div>
                  <div className="flex gap-2 items-center dtl-head">
                    <LuReceiptIndianRupee className="bold" />
                    <p className="font-semibold mb-0">Booking Amount</p>
                  </div>
                  <p className="dtl-body">₹ {property?.details?.booking_amount}</p>
                </div>
              </div>
              <div className=" grid grid-cols-2 gap-2 dtl-flex2">
                <div>
                  <div className="flex gap-2 items-center dtl-head">
                    <GiSofa className="bold" />
                    <p className="font-semibold mb-0">Furnishing</p>
                  </div>
                  <p className="dtl-body">{property?.details?.furnished_status}</p>
                </div>
                <div>
                  <div className="flex gap-2 items-center dtl-head">
                    <FaArrowsLeftRightToLine />
                    <p className="font-semibold mb-0">SBA</p>
                  </div>
                  <p className="dtl-body">{property?.details?.super_built_up_area} sq.ft.</p>
                </div>
              </div>
              <div className=" grid grid-cols-2 gap-2 dtl-flex2">
                <div>
                  <div className="flex gap-2 items-center dtl-head">
                    <FaRegCalendarAlt className="bold" />
                    <p className="font-semibold mb-0">Availabled From</p>
                  </div>
                  <p className="dtl-body">{formatDate(property?.details?.available_from)}</p>
                </div>
                <div>
                  <div className="flex gap-2 items-center dtl-head">
                    <FaBalanceScale />
                    <p className="font-semibold mb-0">No. of Unit</p>
                  </div>
                  <p className="dtl-body">{property?.details?.num_of_units ?? 0}</p>
                </div>
              </div>

              <div className="flex items-center justify-between dtl-btn-div">
                <button className="px-3 justify-center py-2 dtl-btn1 text-base bg-[#367588] text-white rounded-md hover:bg-[#1386a8] flex items-center"
                  onClick={() => { setFormPurpose("contact"); setIsContactSellerModalOpen(true); }}
                >
                  <FaPhone className="mr-2" /> Contact
                </button>
                <button className="px-3 justify-center py-2 dtl-btn2 text-base bg-[#FFD700] text-white rounded-md hover:bg-yellow-500 flex items-center"
                  onClick={() => { setFormPurpose("brochure"); setIsContactSellerModalOpen(true); }}
                >
                  <FaDownload className="mr-2" /> Download Brochure
                </button>
              </div>
              <p className="font-semibold mb-0 dtl-rera">Rera Id: {property?.details?.project_rera_id}</p>
            </div>

            {/* ----------- Modals ----------> */}
            {/* ----------- Contact Seller ----------> */}
            {isContactSellerModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white w-full mx-5 lg:w-[400px] max-w-4xl rounded shadow-lg p-6 relative">
                  <button
                    className="absolute top-3 right-3 text-gray-500"
                    onClick={() => setIsContactSellerModalOpen(false)}
                  >
                    <FaTimes size={20} />
                  </button>
                  <h3 className="text-lg text-[#3C4142] font-bold text-center mb-4">
  Please fill The Details to{" "}
  {formPurpose === "contact"
    ? "get the Contact Number."
    : formPurpose === "brochure"
    ? "Download Brochure."
    : ""}
</h3>
                  <form onSubmit={handleContactSeller}>
                    <div className="mb-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={`w-full px-3 py-2 border ${errors.name ? "border-red-500 bg-red-100" : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter your name"
                      />
                      {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                    </div>

                    <div className="mb-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="type"
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={`w-full px-3 py-2 border ${errors.email ? "border-red-500 bg-red-100" : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    <div className="mb-2">
                      <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact
                      </label>
                      <input
                        type="tel"
                        id="contact"
                        name="contact"
                        maxLength="10"
                        value={form.contact}
                        onChange={(e) =>
                          setForm({ ...form, contact: e.target.value.replace(/\D/, "") })
                        }
                        className={`w-full px-3 py-2 border ${errors.contact ? "border-red-500 bg-red-100" : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter your contact number"
                      />
                      {errors.contact && <p className="text-sm text-red-600 mt-1">{errors.contact}</p>}
                    </div>
                    <div className="mb-2">
                      <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-1">
                        Captcha
                      </label>
                      <div className="flex items-center justify-between">
                        <div
                          className="bg-gray-100 border border-gray-300 px-3 py-2 text-center text-lg font-bold text-[#367588]"
                          aria-hidden="true" // Hide from screen readers as it's purely visual
                        >
                          {captchaText}
                        </div>
                        <button
                          type="button"
                          className="bg-[#367588] text-white py-2 px-4 rounded-md hover:bg-[#1386a8] transition"
                          onClick={generateCaptcha}
                        >
                          Refresh
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="captcha" className="block text-sm font-medium text-gray-700 mb-1">
                        Enter Captcha
                      </label>
                      <input
                        type="text"
                        id="captcha"
                        name="captcha"
                        value={form.captcha}
                        onChange={(e) => setForm({ ...form, captcha: e.target.value })}
                        className={`w-full px-3 py-2 border ${errors.captcha ? "border-red-500 bg-red-100" : "border-gray-300"
                          } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter the text"
                      />
                      {errors.captcha && <p className="text-sm text-red-600 mt-1">{errors.captcha}</p>}
                    </div>

                    <button
                      type="submit"
                      className={`w-full bg-[#367588] text-white py-2 px-4 rounded-md transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#1386a8]"
                        }`}
                    >
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </form>
                </div>
              </div>
            )}
            {isShowContactModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white w-full mx-5 max-w-4xl rounded shadow-lg p-6 relative sellerdtl-modal">
                  <button
                    className="absolute top-3 right-3 text-gray-500"
                    onClick={() => setIsShowContactModalOpen(false)}
                  >
                    <FaTimes size={20} />
                  </button>
                  {/* <h3 className="text-lg text-[#3C4142] font-bold text-center mb-2">
                    Seller Contact Details.
                  </h3> */}
                  <div className="flex items-center flex-col md:flex-row justify-between bg-[#F4EFE5] p-3 mt-2">
                    <div>
                      <h4 className="text-lg font-bold">Posted By Dealer</h4>
                      <p className="text-base font-semibold mb-0">Name : <span className="text-[#367588] text-sm">Soubhagya Sai Das</span></p>
                      <p className="text-base font-semibold mb-0">Contact Details : <span className="text-[#367588] text-sm me-2">+91 8956231478</span><span className="text-[#367588] text-sm">|</span><span className="text-[#367588] text-sm ms-2">abc@gmail.com</span></p>
                    </div>
                    <div className="sellerdtl-right">
                      <h4 className="text-lg font-bold">Posted By {formatDate(property?.details?.available_from)}</h4>
                      <p className="text-base font-semibold mb-1">Project Name : <span className="text-[#367588] text-sm">{property?.details?.project_name}</span></p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#367588] mb-0 me-2">₹ {formatPrice(property?.basic?.expected_price)}</p><span className="text-[#367588] text-sm">|</span>
                        {/* <p className="text-sm font-semibold text-[#367588] mb-0 mx-2">2 BHK</p><span className="text-[#367588] text-sm">|</span> */}
                        <p className="text-sm font-semibold text-[#367588] mb-0 ms-2">{property?.basic?.property_subcategory_name}</p>
                      </div>
                    </div>
                  </div>
                  {/* ------ Similar Project ---- */}
                  <div className="mb-3 container">
                    <h2 className="mt-2 ms-[-12px] text-xl font-bold font-geometric-regular text-[#3C4142]">
                      Similar Project
                    </h2>
                    <div className="w-12 h-1 ms-[-12px] bg-yellow-500"></div>
                  </div>
                  <div className="bg-[#F4EFE5] p-3">
                    <Slider {...nearby}>
                      {similar.filter(
                        (similar) =>
                          (similar.subcategory_name === property?.basic?.property_subcategory_name) && (similar.id !== property?.basic?.id)
                      ).map((similar) => (
                        <div key={similar.id} className="p-2">
                          <div className="w-full bg-white rounded-lg cursor-pointer tranding-card">
                            <div className="h-[200px] w-[100%] img-box relative">
                              <img src={similar.primary_image} className="h-[100%] w-[100%]" />
                              {similar.featured === true && (
                                <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 text-[#fff] py-[5px] px-[10px] rounded-[5px]">
                                  Featured
                                </p>
                              )}
                            </div>
                            <div className="p-3">
                              <h3 className="text-lg text-[#3C4142] bold mb-2 mt-[-2px]">{similar.project_name}</h3>
                              <div className="flex flex-wrap justify-between items-center">
                                <div className="flex gap-2 items-center w-[50%] mb-2">
                                  <FaRupeeSign className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                                  <div>
                                    <p className="text-[#3C4142] text-[13px] font-bold mb-0">Price</p>
                                    <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{formatPrice(similar.expected_price)}</p>
                                  </div>

                                </div>
                                <div className="flex gap-2 items-center w-[50%]  mb-2">
                                  <IoBedOutline className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                                  <div>
                                    <p className="text-[#3C4142] text-[13px] font-bold mb-0">Type</p>
                                    <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{similar.subcategory_name}</p>
                                  </div>

                                </div>
                                <div className="flex gap-2 items-center w-[50%] mb-2">
                                  <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                                  <div>
                                    <p className="text-[#3C4142] text-[13px] font-bold mb-0">SBA</p>
                                    <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{similar.built_up_area} sq.ft.</p>
                                  </div>
                                </div>
                                <div className="flex gap-2 items-center w-[50%]">
                                  <FaBuildingUser className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                                  <div>
                                    <p className="text-[#3C4142] text-[13px] font-bold mb-0">Builder</p>
                                    <p className="text-gray-600 text-[13px] mb-0 mt-[0px] w-[72px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer">{similar.developer_name}</p>
                                  </div>

                                </div>
                              </div>
                              <div className="flex gap-2 items-center mb-2">
                                <FaMapMarkerAlt className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                                <div>
                                  <p className="text-[#3C4142] text-[13px] font-bold mb-0">Location</p>
                                  <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{similar.locality}, {similar.city}</p>
                                </div>
                              </div>
                              <button
                                className="px-3 py-1 bg-[#367588] w-full text-white text-base rounded-md hover:bg-[#1386a8]"
                                onClick={() => navigate(`/details`)}
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
            )}
            {/* ------------ Modals End ---------> */}
          </div>

          {/* Project Details */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-[#3C4142] mb-4">
              Project Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-5">
              <div className="flex items-center space-x-3">
                <FaBuilding className="text-purple-600 text-xl" />
                <div>
                  <p className="text-gray-500 font-bold text-sm mb-2">Project Type</p>
                  <p className="font-semibold mb-0">{property?.basic?.property_subcategory_name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaVectorSquare className="text-blue-600 text-xl" />
                <div>
                  <p className="text-gray-500 font-bold text-sm mb-2">Project Area</p>
                  <p className="font-semibold mb-2">{property?.details?.project_area} sq.ft.</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaArrowsLeftRightToLine className="text-red-600 text-xl" />
                <div>
                  <p className="text-gray-500 font-bold text-sm mb-2">Carpet Area</p>
                  <p className="font-semibold mb-2">{property?.details?.carpet_area} sq.ft.</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaKey className="text-green-600 text-xl" />
                <div>
                  <p className="text-gray-500 font-bold text-sm mb-2">Transaction Type</p>
                  <p className="font-semibold mb-2">{property?.basic?.transaction_type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <LuBuilding2 className="text-orange-600 text-xl" />
                <div>
                  <p className="text-gray-500 font-bold text-sm mb-2">No. Of Towers</p>
                  <p className="font-semibold mb-2">{property?.details?.no_of_tower}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <HiMiniBuildingOffice2 className="text-emerald-400 text-xl" />
                <div>
                  <p className="text-gray-500 font-bold text-sm mb-2">Total Floors</p>
                  <p className="font-semibold mb-2">{property?.details?.total_floors}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaBuffer className="text-cyan-600 text-xl" />
                <div>
                  <p className="text-gray-500 font-bold text-sm mb-2">Number of Flat</p>
                  <p className="font-semibold mb-2">{property?.details?.no_of_flat}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MdBalcony className="text-blue-600 text-xl" />
                <div>
                  <p className="text-gray-500 font-bold text-sm mb-2">No. Of Balcony</p>
                  {/* <p className="font-semibold mb-2">{property?.details?.balconies}</p> */}
                  {property?.basic?.property_category_name !== 'Project Apartment' &&
                    property?.basic?.property_category_name !== 'Project Flat' ? (
                    <p className="font-semibold mb-2">{property?.details?.balconies ?? 0}</p>
                  ) : (
                    <p className="font-semibold mb-2">
                      {property?.bhk_configurations?.map((balconie) => balconie.balconies).join(', ') || '0'}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <IoBed className="text-green-600 text-xl" />
                <div>
                  <p className="text-gray-500 font-bold text-sm mb-2">Bedrooms</p>
                  {/* <p className="font-semibold mb-2">{property?.details?.bathrooms}</p> */}
                  {property?.basic?.property_category_name !== 'Project Apartment' &&
                    property?.basic?.property_category_name !== 'Project Flat' ? (
                    <p className="font-semibold mb-2">{property?.details?.bedrooms ?? 0}</p>
                  ) : (
                    <p className="font-semibold mb-2">
                      {property?.bhk_configurations?.map((bedroom) => bedroom.bedrooms).join(', ') || '0'}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaBath className="text-indigo-600 text-xl" />
                <div>
                  <p className="text-gray-500 font-bold text-sm mb-2">Bathrooms</p>
                  {/* <p className="font-semibold mb-2">{property?.details?.bathrooms}</p> */}
                  {property?.basic?.property_category_name !== 'Project Apartment' &&
                    property?.basic?.property_category_name !== 'Project Flat' ? (
                    <p className="font-semibold mb-2">{property?.details?.bathrooms ?? 0}</p>
                  ) : (
                    <p className="font-semibold mb-2">
                      {property?.bhk_configurations?.map((bathroom) => bathroom.bathrooms).join(', ') || '0'}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <BsHouseGearFill className="text-fuchsia-600 text-xl" />
                <div>
                  <p className="text-gray-500 font-bold text-sm mb-2">Maintainance Charge</p>
                  <p className="font-semibold mb-2">₹ {property?.details?.maintenance_charge}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <GrStatusGood className="text-blue-600 text-xl" />
                <div>
                  <p className="text-gray-500 font-bold text-sm mb-2">Status</p>
                  <p className="font-semibold mb-2">{property?.basic?.possession_status}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaEye className="text-yellow-600 text-xl" />
                <div>
                  <p className="text-gray-500 font-bold text-sm mb-2">Property Overlooking</p>
                  <p className="font-semibold mb-2">{property?.details?.overlooking.join(', ') ?? 'N/A'}</p>
                </div>
              </div>
            </div>
            <div className="text-gray-700 mt-5"
              dangerouslySetInnerHTML={{
                __html: property?.details?.description || '',
              }}
            />
            <div className="text-gray-700 mt-5"
              dangerouslySetInnerHTML={{
                __html: property?.details?.about_location || '',
              }}
            />

          </div>

          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-5 items-start dtl-other-box">
            <div className="md:col-span-8">
               {/* <div className="mb-3 container">
                <h2 className="mb-2 ms-[-12px] text-2xl font-bold font-geometric-regular text-[#3C4142] ">
                  Other Properties in this Project and Nearby
                </h2>
                <div className="w-12 h-1 bg-yellow-500"></div>
              </div>
              <Slider {...nearby}>
                {propertiesnearby.map((property) => (
                  <div key={property.id} className="p-2">
                    <div className="w-full bg-white rounded-lg cursor-pointer tranding-card">
                      <div className="h-[200px] w-[100%] img-box relative">
                        <img src={property.img} className="h-[100%] w-[100%]" />
                        {property.featured === true && (
                          <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 text-[#fff] py-[5px] px-[10px] rounded-[5px]">
                            Featured
                          </p>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-lg text-[#3C4142] bold mb-2 mt-[-2px]">{property.name}</h3>
                        <div className="flex flex-wrap justify-between items-center">
                          <div className="flex gap-2 items-center w-[50%] mb-2">
                            <FaRupeeSign className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                            <div>
                              <p className="text-[#3C4142] text-[13px] font-bold mb-0">Price</p>
                              <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.price}</p>
                            </div>

                          </div>
                          <div className="flex gap-2 items-center w-[50%]  mb-2">
                            <IoBedOutline className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                            <div>
                              <p className="text-[#3C4142] text-[13px] font-bold mb-0">Type</p>
                              <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.type}</p>
                            </div>

                          </div>
                          <div className="flex gap-2 items-center w-[50%] mb-2">
                            <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                            <div>
                              <p className="text-[#3C4142] text-[13px] font-bold mb-0">SBA</p>
                              <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.area}</p>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center w-[50%]">
                            <FaBuildingUser className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                            <div>
                              <p className="text-[#3C4142] text-[13px] font-bold mb-0">Builder</p>
                              <p className="text-gray-600 text-[13px] mb-0 mt-[0px]" onClick={() => handleDeveloper(property.developer_name)}>{property.builder}</p>
                            </div>

                          </div>
                        </div>
                        <div className="flex gap-2 items-center mb-2">
                          <FaMapMarkerAlt className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                          <div>
                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">Location</p>
                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{property.location}</p>
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
              </Slider> */}
              <div className="mb-3 container">
                <h2 className="mb-2 ms-[-12px] text-2xl font-bold font-geometric-regular text-[#3C4142] ">
                  Amenities Properties, Odisha
                </h2>
                <div className="w-12 h-1 bg-yellow-500"></div>
              </div>
              {/* Amenities Properties, Odisha Section */}
              <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
                <div className="space-y-6">
                  <div className="flex flex-wrap flex-col md:flex-row gap-5 items-center dtl-amenities-inner">

                    {property?.amenities?.map((category, index) => {
                      const allIcons = { ...FaIcons, ...MdIcons, ...AiIcons };
                      const Icon = allIcons[category.icon];

                      return (
                        <div key={index} className="flex flex-col items-center space-y-1">
                          {Icon ? (
                            <div className="h-[50px] w-[50px] rounded-full bg-[#FFD700] flex items-center justify-center">
                              <Icon className="text-[30px] text-white" />
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No Icon</span>
                          )}
                          <p className="text-base text-gray-500 font-semibold">{category.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Floor Plans & Pricing Section - Takes 2/3 Width */}
              <div className="mb-3 container">
                <h2 className="mb-2 ms-[-12px] text-2xl font-bold font-geometric-regular text-[#3C4142] ">
                  Floor Plans & Pricing
                </h2>
                <div className="w-12 h-1 bg-yellow-500"></div>
              </div>
              <div className="shadow-sm bg-white rounded-lg">
                <div className="w-full">
                  {/* Tab Buttons */}
                  <div className="flex flex-wrap border-b">
                    {/* {(property?.basic?.property_category_name === "Project Apartment" ||
                      property?.basic?.property_category_name === "Project Villa") &&
                      Array.isArray(property?.bhk_configurations) &&
                      property.bhk_configurations.map((config) => (
                        <button
                          key={config.id}
                          onClick={() => setActiveTab(config.bhk_type)}
                          className={`px-4 py-2 border-b-2 transition-colors duration-200 ${activeTab === config.bhk_type
                            ? "border-blue-600 text-blue-600 font-semibold"
                            : "border-transparent text-gray-600"
                            }`}
                        >
                          {config.bhk_type}
                        </button>
                      ))} */}
                    {(property?.basic?.property_category_name === "Project Apartment" ||
                      property?.basic?.property_category_name === "Project Villa") &&
                      Array.isArray(property?.bhk_configurations) &&
                      property.bhk_configurations.map((config) => (
                        <button
                          key={config.id}
                          onClick={() => setActiveTab(config.bhk_type)}
                          className={`px-4 py-2 border-b-2 transition-colors duration-200 ${activeTab === config.bhk_type
                            ? "border-blue-600 text-blue-600 font-semibold"
                            : "border-transparent text-gray-600"
                            }`}
                        >
                          {config.bhk_type}
                        </button>
                      ))}

                    {property?.basic?.property_category_name !== "Project Apartment" &&
                      property?.basic?.property_category_name !== "Project Villa" &&
                      property?.documents
                        ?.filter(
                          (doc) => /BHK$/i.test(doc.type) || doc.type.toLowerCase() === "floorplan"
                        )
                        .map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => setActiveTab(doc.type)}
                            className={`px-4 py-2 border-b-2 transition-colors duration-200 ${activeTab === doc.type
                              ? "border-blue-600 text-blue-600 font-semibold"
                              : "border-transparent text-gray-600"
                              }`}
                          >
                            {doc.type}
                          </button>
                        ))}

                  </div>

                  {/* Tab Content */}
                  <div className="mt-2 p-4">
                    {(property?.basic?.property_category_name === "Project Apartment" ||
                      property?.basic?.property_category_name === "Project Villa") &&
                      property?.bhk_configurations
                        ?.filter((config) => config.bhk_type === activeTab)
                        .map((config) => (
                          <div key={config.id}>
                            <img
                              src={config.file_url}
                              alt={config.bhk_type}
                              className="w-full max-h-[500px] object-contain border rounded-lg"
                            />
                            <a
                              href={config.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-black-600 underline mt-2 block"
                            >
                              View File URL
                            </a>
                          </div>
                        ))}
                    {property?.basic?.property_category_name !== "Project Apartment" &&
                      property?.basic?.property_category_name !== "Project Villa" &&
                      property?.documents
                        ?.filter(
                          (doc) => /BHK$/i.test(doc.type) || doc.type.toLowerCase() === "floorplan"
                        )
                        .map((doc) => (
                          <div key={doc.id} className="mt-4">
                            <img
                              src={doc.file_url}
                              alt={doc.type}
                              className="w-full max-h-[500px] object-contain border rounded-lg"
                            />
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline mt-2 block"
                            >
                              View {doc.type}
                            </a>
                          </div>
                        ))}
                  </div>
                </div>
              </div>

              <div className=" md:flex-row gap-6 mt-10">
                {/* Video Section - Takes 2/3 Width */}
                <div className=" bg-white shadow-sm rounded-lg p-6">
                  <h2 className="text-lg text-[#3C4142] font-semibold mb-4">
                    Walkthrough video Of {property?.details?.project_name}
                  </h2>

                  {/* <div className="relative w-full overflow-hidden rounded-lg pt-[56.25%]"> 
                    <iframe
                      src="https://www.youtube.com/embed/iaEFFRuUI8o?si=PUW1gdPAVylZu7je"
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                    />
                  </div> */}
                  {property?.details?.youtube_link && (
  <div
    className="relative w-full overflow-hidden rounded-lg pt-[56.25%]" // 16:9 aspect ratio
    dangerouslySetInnerHTML={{
      __html: property.details.youtube_link.replace(
        '<iframe',
        '<iframe class="absolute top-0 left-0 w-full h-full"'
      ),
    }}
  />
)}
                </div>
              </div>
            </div>
            {/* Neighbourhood Section - Takes 1/3 Width */}
            <div className="md:col-span-4  dtl-neibourhood">
              <AdCards />

              <h2 className="text-lg text-[#3C4142] font-semibold mt-5 mb-4">
                Explore Neighbourhood - {property?.details?.project_name}
              </h2>

              <div className="space-y-6 mb-4">
                {property?.nearest_to?.map((place) => (
                  <div
                    key={place.id}
                    className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
                  >
                    <span className="text-gray-700 font-medium">{place.name}</span>
                    <span className="text-[#367588] font-semibold">{place.distance_km} km</span>
                  </div>
                ))}
                {/* {[
                  {
                    icon: <LiaSchoolSolid />,
                    name: "School",
                    places: [
                      "S M Shetty School",
                      "Bombay Scottish School",
                      "Podar Int'l School",
                      "Hiranandani Foundation School",
                    ],
                  },
                  {
                    icon: <PiHospital />,
                    name: "Hospital",
                    places: [
                      "Nahar Medical Centre",
                      "Seven Hills Hospital",
                      "Hiranandani Hospital",
                      "Dr L H Hiranandani Hospital",
                    ],
                  },
                  {
                    icon: <FiShoppingCart />,
                    name: "Shopping",
                    places: [
                      "Dmart",
                      "Haiko Supermarket",
                      "High Street Hiranandani",
                      "R City Mall",
                    ],
                  },
                  {
                    icon: <IoRestaurantOutline />,
                    name: "Restaurant",
                    places: [
                      "1441 Pizzeria",
                      "Chaayos",
                      "Domino's Pizza",
                      "True Tramm Trunk",
                    ],
                  },
                ].map((category, index) => (
                  <div key={index} className="border-b pb-4">
                    
                    <div className="flex items-center gap-2 mb-2 text-[#367588]">
                      <span className="text-3xl">{category.icon}</span>
                      <h3 className="text-lg font-semibold ml-2">
                        {category.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between">
                     
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full dtl-localities">
                        {category.places.map((place, i) => (
                          <p key={i} className="text-gray-600 dtl-local-property">
                            • {place}
                          </p>
                        ))}
                      </div>
                    </div>


                  </div>
                ))} */}
              </div>

               <Review/>
            </div>
          </section>

          {/* Property in Similar Project */}
          <div className="mt-5">
            <div className="mb-3 container">
              <h2 className="mb-2 ms-[-12px] text-2xl font-bold font-geometric-regular text-[#3C4142] ">
                Property in Similar Project
              </h2>
              <div className="w-12 h-1 bg-yellow-500"></div>
            </div>

            <Slider {...setting}>
              {similar.filter(
                (similar) =>
                  (similar.subcategory_name === property?.basic?.property_subcategory_name) && (similar.id !== property?.basic?.id)
              ).map((similar) => (
                <div key={similar.id} className="p-2">
                  <div className="w-full bg-white rounded-lg cursor-pointer tranding-card">
                    <div className="h-[200px] w-[100%] img-box relative">
                      <img src={similar.primary_image} className="h-[100%] w-[100%]" />
                      {similar.featured === true && (
                        <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 text-[#fff] py-[5px] px-[10px] rounded-[5px]">
                          Featured
                        </p>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-lg text-[#3C4142] bold mb-2 mt-[-2px]">{similar.project_name}</h3>
                      <div className="flex flex-wrap justify-between items-center">
                        <div className="flex gap-2 items-center w-[50%] mb-2">
                          <FaRupeeSign className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                          <div>
                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">Price</p>
                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{formatPrice(similar.expected_price)}</p>
                          </div>

                        </div>
                        <div className="flex gap-2 items-center w-[50%]  mb-2">
                          <IoBedOutline className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                          <div>
                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">Type</p>
                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{similar.subcategory_name}</p>
                          </div>

                        </div>
                        <div className="flex gap-2 items-center w-[50%] mb-2">
                          <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                          <div>
                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">SBA</p>
                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{similar.built_up_area} sq.ft.</p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center w-[50%]">
                          <FaBuildingUser className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                          <div>
                            <p className="text-[#3C4142] text-[13px] font-bold mb-0">Builder</p>
                            <p className="text-gray-600 text-[13px] mb-0 mt-[0px] w-[90px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer" onClick={() => handleDeveloper(similar.developer_name)}>{similar.developer_name}</p>
                          </div>

                        </div>
                      </div>
                      <div className="flex gap-2 items-center mb-2">
                        <FaMapMarkerAlt className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Location</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{similar.locality}, {similar.city}</p>
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
          {/* ------- Faq------ */}
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
                          <span className="faq_count">{index + 1}</span>
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
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default PropertyDetails;
