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
import PropertyCard from "./PropertyCard";
import TestimonialCard from "../review/ReviewCard";
import ReviewModal from "../review/ReviewModal.js"
import faq from "../../assets/FAQ-v3.jpg"
import LocationMap from "./LocationMap";
import { GetUserIP } from "../../utills/GetUserIP.js";
import CustomTooltip from "./CustomTooltip.js";

import {
  FaCar,
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
import { SiHomeadvisor, SiTicktick } from "react-icons/si";
import { Star } from 'lucide-react';
import { RiCarouselView } from "react-icons/ri";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { LuBuilding2, LuReceiptIndianRupee } from "react-icons/lu";
import { BsHouseGearFill } from "react-icons/bs";
import { GiSofa } from "react-icons/gi";
import { FaArrowsLeftRightToLine, FaUserGraduate } from "react-icons/fa6";
import { GrStatusGood } from "react-icons/gr";
import { GiModernCity, GiPoolTableCorner, GiHouse } from "react-icons/gi";
import { MdArrowForwardIos, MdBalcony } from "react-icons/md";
import { PiBuildingOfficeBold, PiHospital } from "react-icons/pi";
import { GoGear } from "react-icons/go";
import { LiaSchoolSolid } from "react-icons/lia";
import { IoBed } from "react-icons/io5";
import { BiArea } from "react-icons/bi";
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
import * as GiIcons from "react-icons/gi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ------- slider -----------
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
// ------- slider end -----

const PropertyDetails = ({ propertyId }) => {
  const [isContactSellerModalOpen, setIsContactSellerModalOpen] = useState(false);
  const [isShowContactModalOpen, setIsShowContactModalOpen] = useState(false);
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
        lead_source: formPurpose === "contact" ? "contact_form" : "brochure_download",
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
            // brochureDocs.forEach((doc, index) => {
            //   const link = document.createElement("a");
            //   link.href = doc.file_url;
            //   link.download = `Brochure-${index + 1}.pdf`; // You can customize this name
            //   document.body.appendChild(link);
            //   link.click();
            //   document.body.removeChild(link);
            // });
            brochureDocs.forEach(async (doc, index) => {
              try {
                const res = await fetch(doc.file_url);
                const blob = await res.blob();

                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = `Brochure-${index + 1}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl); // clean up
              } catch (err) {
                console.error("Failed to download brochure", err);
                toast.error("Failed to download brochure.");
              }
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

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };



  // --------------- API INTEGRATION --------->
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [pjName, setPjName] = useState("");
  const [dtlId, setDtlId] = useState("");
  const [locality, setLocality] = useState("");

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/property/${id}`, {
      withCredentials: true, // replaces fetch's `credentials: 'include'`
    })
      .then((res) => {
        setProperty(res.data);
        setPjName(res.data.details.project_name);
        setDtlId(res.data.details.id);
        setLocality(res.data.details.locality);
        console.log(res.data.details.project_name);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  // --------------- API INTEGRATION END -------> 


  // const images = [
  //   ...(property?.images?.map(img => img.image_url) || []),
  //   // ...defaultImages
  // ];

  const images = property?.images || [];

  const [activeTab, setActiveTab] = useState("");
  const [selectedConfig, setSelectedConfig] = useState(null);
  const selectedCity = property?.details?.city;
  const selectedLocality = property?.details?.locality || locality;

  useEffect(() => {
    if (!activeTab && property?.basic?.property_category_name) {
      const category = property.basic.property_category_name;

      if (
        (category === "Project Apartment" || category === "Project House/Villa") &&
        Array.isArray(property?.bhk_configurations)
      ) {
        const bhkTypes = [...new Set(property.bhk_configurations.map((c) => c.bhk_type))];
        if (bhkTypes.length > 0) {
          setActiveTab(bhkTypes[0]);
        }
      } else if (
        (category === "Apartment" || category === "House/Villa") &&
        Array.isArray(property?.documents)
      ) {
        const documentTabs = property.documents.filter(
          (doc) =>
            /BHK$/i.test(doc.type) ||
            doc.type.toLowerCase() === "floorplan" ||
            doc.type.toLowerCase() === "masterplan"
        );
        if (documentTabs.length > 0) {
          setActiveTab(documentTabs[0].type);
        }
      }
    }
  }, [property, activeTab]);

  // ---------- More Click ------>
  useEffect(() => {
    const logPropertyView = async () => {
      const ip = await GetUserIP();
      if (!ip) return;

      try {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/property-hit`, {
          propertyId: id,
          ipAddress: ip,
        });
        console.log("Property view logged");
      } catch (err) {
        console.error("Failed to log property hit:", err);
      }
    };

    logPropertyView();
  }, [id]);

  useEffect(() => {
    const logLocality = async () => {
      const ip = await GetUserIP();
      if (!ip) return;

      try {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/locality-hit`, {
          city: selectedCity,
          locality: selectedLocality,
          ipAddress: ip,
        });
      } catch (err) {
        console.error("Failed to log locality hit:", err);
      }
    };

    if (selectedCity && selectedLocality) {
      logLocality();
    }
  }, [selectedCity, selectedLocality]);
  // -------- More Click End ----->

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

  // ------------ Near By project -------->
  const [nearby, setNearby] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [pname, setPname] = useState("");
  // <------------ API INTEGRATION START -------------->
  // Fetch blog data
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/getminimumproperty`, {
        withCredentials: true,
      })
      .then((res) => {
        setNearby(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  // <------------ API INTEGRATION END -------------->
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

  // const handleDetailsClick = (id) => {
  //   navigate(`/details/${id}`);
  // };

  const handleDeveloper = (developer_name, developer_company_name) => {
    // if (developer_name) {
    //   navigate(
    //     `/builderProject?developer_name=${encodeURIComponent(developer_name)}`
    //   );
    // } else {
    //   console.warn("Developer Name is undefined");
    // }
    if (developer_name) {
      navigate(`/builderProject?developer_name=${encodeURIComponent(developer_name)}`, {
        state: { developer_company_name },
      });
    } else {
      console.warn("Developer Name is undefined");
    }
  };

  // --------------- API INTEGRATION --------->
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/review/approved/${id}`, {
      withCredentials: true,
    })
      .then((res) => {
        setReviews(res.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  // --------------- API INTEGRATION END ------->
  // const handledtlImageClick = async (img) => {
  //   try {
  //     const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/${img.id}/images`, {
  //       withCredentials: true,
  //     });
  //     setModalImages(res.data.images);
  //     setPname(img.project_name || "Property Name");
  //     setShowModal(true);
  //   } catch (error) {
  //     console.error("Error fetching image data:", error);
  //   }
  // };
  const handledtlImageClick = async () => {
    // alert(dtlId);
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/${dtlId}/images`, {
        withCredentials: true,
      });
      setModalImages(res.data.images);
      setPname(pjName || "Property Name");
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching image data:", error);
    }
  };
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
  const handlenearImageClick = async (item) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/${item.id}/images`, {
        withCredentials: true,
      });
      setModalImages(res.data.images);
      setPname(item.project_name || "Property Name");
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching image data:", error);
    }
  };
  const handlesimilarImageClick = async (similar) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/${similar.id}/images`, {
        withCredentials: true,
      });
      setModalImages(res.data.images);
      setPname(similar.project_name || "Property Name");
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching image data:", error);
    }
  };

  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [minSBA, setMinSBA] = useState(null);
  const [maxSBA, setMaxSBA] = useState(null);

  useEffect(() => {
    if (property?.bhk_configurations?.length > 0) {
      const sbaValues = property.bhk_configurations.map(c => parseFloat(c.super_built_up_area));
      const min = Math.min(...sbaValues);
      const max = Math.max(...sbaValues);
      setMinSBA(min);
      setMaxSBA(max);

      const pricePerSqft = parseFloat(property?.basic?.price_per_sqft || 0);
      setMinPrice(pricePerSqft * min);
      setMaxPrice(pricePerSqft * max);
    }
  }, [property]);

  // ------- tab section ------
  const documentTabsWithSuffix = (() => {
    const counts = {};
    return (property?.documents || [])
      .filter(
        (doc) =>
          !doc.file_url?.endsWith(".pdf") &&
          (/BHK$/i.test(doc.type) ||
            ["floorplan", "masterplan", "brochure", "approval"].includes(doc.type.toLowerCase()))
      )
      .map((doc) => {
        const key = doc.type.toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
        const suffix = counts[key] > 1 ? ` ${counts[key]}` : "";
        return { ...doc, tabName: doc.type + suffix };
      });
  })();

  // Prepare all tab names: BHK tabs + document tabs with proper suffix
  const allTabs = [
    ...(property?.bhk_configurations?.map(
      (config) => `${config.bhk_type}`
    ) || []),
    ...documentTabsWithSuffix.map((doc) => doc.tabName),
  ];

  // Set first tab active on mount or when property changes
  useEffect(() => {
    if (allTabs.length > 0) {
      setActiveTab(allTabs[0]);
    }
  }, [property]);

  // ------ review modal -----
  const [selectedReview, setSelectedReview] = useState(null);

  const handleCardClick = (data) => {
    setSelectedReview(data);
  };

  const closeModal = () => {
    setSelectedReview(null);
  };

  useEffect(() => {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  return (
    <>
      <NewNav />
      <div className="bg-[#F4EFE5] pt-[82px] md:pt-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Image Carousel */}
            {/* <div className="md:col-span-12 lg:col-span-8 bg-white lg:p-6 p-2 h-[230px] md:h-[400px] xl:h-[506px] relative rounded-lg shadow-lg">
              
            </div> */}
            <Slider {...settings} className="md:col-span-12 lg:col-span-8 bg-white lg:p-6 p-2 h-[230px] md:h-[473px] xl:h-[549px] rounded-lg shadow-lg dtl-slider">
              {images.map((img, index) => (
                dtlId && (
                  <div key={index} onClick={() => handledtlImageClick()} className="cursor-pointer w-full h-[230px] md:h-[473px] xl:h-[549px] object-cover">
                    <img
                      src={img.image_url}
                      alt={`Property ${index}`}
                      className="w-full h-[100%] object-cover rounded-lg"
                    />
                  </div>
                )
              ))}
            </Slider>

            {/* Property Info */}
            <div className="md:col-span-12 lg:col-span-4 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="lg:text-xl xl:text-2xl font-bold text-[#367588] mb-0">
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
                onClick={() => handleDeveloper(property?.basic?.developer_name, property?.basic?.developer_company_name)}>
                <div className="h-[40px] w-[40px] rounded-full bg-yellow-500 p-1">
                  <img src={property?.basic?.developer_logo || "https://w7.pngwing.com/pngs/247/564/png-transparent-computer-icons-user-profile-user-avatar-blue-heroes-electric-blue-thumbnail.png"} alt="Builder img" className="h-[100%] w-[100%] rounded-full" />
                </div>
                <div className="flex flex-col">
                  <p className="text-base font-semibold mb-0">Builder :</p>
                  <p className="text-sm font-semibold mb-0">{property?.basic?.developer_name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between dtl-price">
                <div className="text-xl font-bold text-gray-900 dtl-price-dt">
                  {
                    (property?.basic?.property_category_name === "Project Apartment" || property?.basic?.property_category_name === "Project House/Villa")
                      ? `₹ ${formatPrice(minPrice)} - ₹ ${formatPrice(maxPrice)}`
                      : `₹ ${formatPrice(property?.basic?.expected_price)}`
                  }
                  {/* ₹{formatPrice(property?.basic?.expected_price)} */}
                </div>
                <p className="text-gray-500 dtl-pricesq font-semibold mb-0">₹{formatPrice(property?.basic?.price_per_sqft)} / Sqft</p>
              </div>

              <div className=" grid grid-cols-2 gap-2 dtl-flex1">
                <div>
                  <div className="flex gap-2 items-center dtl-head">
                    <PiBuildingOfficeBold className="bold" />
                    <p className="font-semibold mb-0 small-fs">Type</p>
                  </div>
                  <p className="dtl-body">{property?.basic?.property_subcategory_name}</p>
                </div>
                <div>
                  <div className="flex gap-2 items-center dtl-head">
                    <LuReceiptIndianRupee className="bold" />
                    <p className="font-semibold mb-0 small-fs">Booking Amount</p>
                  </div>
                  <p className="dtl-body">₹ {formatPrice(property?.details?.booking_amount)}</p>
                </div>
              </div>
              <div className=" grid grid-cols-2 gap-2 dtl-flex2">
                <div>
                  <div className="flex gap-2 items-center dtl-head">
                    <GiSofa className="bold" />
                    <p className="font-semibold mb-0 small-fs">Furnishing</p>
                  </div>
                  <p className="dtl-body">{property?.details?.furnished_status}</p>
                </div>
                <div>
                  <div className="flex gap-2 items-center dtl-head">
                    <FaArrowsLeftRightToLine />
                    <p className="font-semibold mb-0 small-fs">SBA</p>
                  </div>
                  <p className="dtl-body">
                    {
                      (property?.basic?.property_category_name === "Project Apartment" || property?.basic?.property_category_name === "Project House/Villa")
                        ? `${Math.round(minSBA)} - ${Math.round(maxSBA)} sq.ft`
                        : `${property?.details?.super_built_up_area} sq.ft`
                    }
                    {/* {property?.details?.super_built_up_area}sq.ft.*/}
                  </p>
                </div>
              </div>
              <div className=" grid grid-cols-2 gap-2 dtl-flex2">
                <div>
                  <div className="flex gap-2 items-center dtl-head">
                    <FaRegCalendarAlt className="bold" />
                    <p className="font-semibold mb-0 small-fs">Availabled From</p>
                  </div>
                  <p className="dtl-body">{formatDate(property?.details?.available_from)}</p>
                </div>
                <div>
                  <div className="flex gap-2 items-center dtl-head">
                    <GrStatusGood />
                    <p className="font-semibold mb-0 small-fs">Status</p>
                  </div>
                  <p className="dtl-body">{property?.basic?.possession_status}</p>
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
              <p className="font-semibold mb-0 dtl-rera">RERA NO: {property?.details?.project_rera_id}</p>
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
                    Please Fill The Details to{" "}
                    {formPurpose === "contact"
                      ? "Get The Contact Number."
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
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
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
                      <p className="text-base font-semibold mb-0">Name : <span className="text-[#367588] text-sm">TK Swain</span></p>
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
                    <Swiper
                      spaceBetween={24}
                      loop={true}
                      autoplay={{ delay: 2000 }}
                      modules={[Autoplay]}
                      breakpoints={{
                        320: { slidesPerView: 1 },
                        425: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 2 },
                        1440: { slidesPerView: 2 },
                      }}
                    >
                      {similar.filter(
                        (similar) =>
                          (similar.subcategory_name === property?.basic?.property_subcategory_name) && (similar.id !== property?.basic?.id)
                      ).map((similar, index) => (
                        <SwiperSlide>
                          <PropertyCard
                            key={index}
                            property={similar}
                            onViewDetails={(id) => window.open(`/details/${id}`, '_blank')}
                            onImgClick={() => handlesimilarImageClick(similar)}
                          />
                        </SwiperSlide>

                      ))}
                    </Swiper>
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
            {property?.basic?.property_category_name === "House/Villa" ?
              (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-5">
                  <div className="flex items-center space-x-3">
                    <FaVectorSquare className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Project Area</p>
                      <p className="font-semibold mb-2">{property?.details?.project_area} sq.ft.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <GiHouse className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">No. Of House/Villa</p>
                      <p className="font-semibold mb-2">{property?.details?.no_of_house}</p>
                    </div>
                  </div>
                  {property?.details?.total_floors && (
                    <div className="flex items-center space-x-3">
                      <HiMiniBuildingOffice2 className="text-[#367588] text-xl" />
                      <div>
                        <p className="text-gray-500 font-bold text-sm mb-0">Total Floors</p>
                        <p className="font-semibold mb-2">{property?.details?.total_floors}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <GiPoolTableCorner className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Is this a Corner Plot</p>
                      <p className="font-semibold mb-2">{property?.details?.corner_plot}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaArrowsLeftRightToLine className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Plot Area</p>
                      <p className="font-semibold mb-2">{property?.details?.plot_area} sq.ft.</p>
                    </div>
                  </div>
                  {property?.details?.super_built_up_area && (
                    <div className="flex items-center space-x-3">
                      <BiArea className="text-[#367588] text-xl" />
                      <div>
                        <p className="text-gray-500 font-bold text-sm mb-0">Super Built-up Area</p>
                        <p className="font-semibold mb-2">{property?.details?.super_built_up_area} sq.ft.</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <FaArrowsLeftRightToLine className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Plot Length</p>
                      <p className="font-semibold mb-2">{property?.details?.plot_length} sq.ft.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaArrowsLeftRightToLine className="text-[#367588] text-xl rotate-90" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Plot Width</p>
                      <p className="font-semibold mb-2">{property?.details?.plot_breadth} sq.ft.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <IoBed className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Bedrooms</p>
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
                    <FaBath className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Bathrooms</p>
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
                    <MdBalcony className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Balcony</p>
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
                    <FaCar className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Parking</p>
                      <p className="font-semibold mb-2">{property?.details?.covered_parking}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaKey className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Transaction Type</p>
                      <p className="font-semibold mb-2">{property?.details?.transaction_types}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaEye className="text-[#367588] text-2xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Property Overlooking</p>
                      <p className="font-semibold mb-2">{property?.details?.overlooking.join(', ') ?? 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BsHouseGearFill className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Maintainance Charge</p>
                      <p className="font-semibold mb-2">₹ {property?.details?.maintenance_charge}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <GiModernCity className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">ROI</p>
                      <p className="font-semibold mb-2">{property?.details?.rental_return}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-5">
                  <div className="flex items-center space-x-3">
                    <FaVectorSquare className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Project Area</p>
                      <p className="font-semibold mb-2">{property?.details?.project_area} sq.ft.</p>
                    </div>
                  </div>
                  {property?.details?.no_of_tower && (
                    <div className="flex items-center space-x-3">
                      <LuBuilding2 className="text-[#367588] text-xl" />
                      <div>
                        <p className="text-gray-500 font-bold text-sm mb-0">No. Of Towers</p>
                        <p className="font-semibold mb-2">{property.details.no_of_tower}</p>
                      </div>
                    </div>
                  )}
                  {property?.details?.total_floors && (
                    <div className="flex items-center space-x-3">
                      <HiMiniBuildingOffice2 className="text-[#367588] text-xl" />
                      <div>
                        <p className="text-gray-500 font-bold text-sm mb-0">Total Floors</p>
                        <p className="font-semibold mb-2">{property?.details?.total_floors}</p>
                      </div>
                    </div>
                  )}
                  {property?.details?.no_of_flat && (
                    <div className="flex items-center space-x-3">
                      <FaBuffer className="text-[#367588] text-xl" />
                      <div>
                        <p className="text-gray-500 font-bold text-sm mb-0">Number of Flats</p>
                        <p className="font-semibold mb-2">{property?.details?.no_of_flat}</p>
                      </div>
                    </div>
                  )}
                  {property?.details?.floor && (
                    <div className="flex items-center space-x-3">
                      <SiHomeadvisor className="text-[#367588] text-xl" />
                      <div>
                        <p className="text-gray-500 font-bold text-sm mb-0">Property in Floor</p>
                        <p className="font-semibold mb-2">{property?.details?.floor}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <RiCarouselView className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Facing</p>
                      <p className="font-semibold mb-2">{property?.details?.facing.join(', ') ?? 'N/A'}</p>
                    </div>
                  </div>
                  {property?.details?.built_up_area && (
                    <div className="flex items-center space-x-3">
                      <BiArea className="text-[#367588] text-xl" />
                      <div>
                        <p className="text-gray-500 font-bold text-sm mb-0">Built-up Area</p>
                        <p className="font-semibold mb-2">{property?.details?.built_up_area}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <FaArrowsLeftRightToLine className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Carpet Area</p>
                      <p className="font-semibold mb-2">{property?.details?.carpet_area} sq.ft.</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <IoBed className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Bedrooms</p>
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
                    <FaBath className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Bathrooms</p>
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
                    <MdBalcony className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">No. Of Balcony</p>
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
                    <FaCar className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Parking</p>
                      <p className="font-semibold mb-2">{property?.details?.covered_parking}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaKey className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Transaction Type</p>
                      <p className="font-semibold mb-2">{property?.basic?.transaction_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaEye className="text-[#367588] text-2xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Property Overlooking</p>
                      <p className="font-semibold mb-2">{property?.details?.overlooking.join(', ') ?? 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BsHouseGearFill className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">Maintainance Charge</p>
                      <p className="font-semibold mb-2">₹ {property?.details?.maintenance_charge}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <GiModernCity className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">ROI</p>
                      <p className="font-semibold mb-2">{property?.details?.rental_return}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaBalanceScale className="text-[#367588] text-xl" />
                    <div>
                      <p className="text-gray-500 font-bold text-sm mb-0">No. of Unit</p>
                      <p className="font-semibold mb-2">{property?.details?.num_of_units ?? 0}</p>
                    </div>
                  </div>
                </div>
              )
            }

            {property?.details?.description && (
              <div className="text-gray-700 mt-5">
                <h2 className="mb-2 text-xl font-bold font-geometric-regular text-[#3C4142]">
                  Description
                </h2>
                <div className="w-12 h-1 bg-yellow-500 mb-3"></div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: property.details.description,
                  }}
                />
              </div>
            )}
            {property?.details?.about_location && (
              <div className="text-gray-700 mt-3">
                <h2 className="mb-2 text-xl font-bold font-geometric-regular text-[#3C4142]">
                  Location
                </h2>
                <div className="w-12 h-1 bg-yellow-500 mb-3"></div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: property?.details?.about_location || '',
                  }}
                />
              </div>
            )}
            {/* <div className="text-gray-700 mt-5"
              dangerouslySetInnerHTML={{
                __html: property?.details?.description || '',
              }}
            /> */}
            {/* <div className="text-gray-700 mt-5"
              dangerouslySetInnerHTML={{
                __html: property?.details?.about_location || '',
              }}
            /> */}

          </div>

          <section className="grid grid-cols-12 md:grid-cols-12 gap-8 mt-5 items-start dtl-other-box">
            <div className="col-12 md:col-span-8">
              {/* ------- Nearby Properties ------ */}
              {(() => {
                // 1. Filter “nearby” properties by locality and exclude the current property
                const filteredNearby = nearby.filter(
                  (item) =>
                    item.locality === property?.details?.locality &&
                    item.id !== property?.basic?.id
                );

                // 2. Only render if there is at least one matching “nearby” property
                if (filteredNearby.length === 0) {
                  return null;
                }

                return (
                  <>
                    <div className="mb-3 container">
                      <h2 className="mb-2 ms-[-12px] text-2xl font-bold font-geometric-regular text-[#3C4142]">
                        Nearby Properties
                      </h2>
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
                        1024: { slidesPerView: 2 },
                        1440: { slidesPerView: 2 },
                      }}
                    >
                      {filteredNearby.map((item, index) => (
                        <SwiperSlide key={item.id || index}>
                          <PropertyCard
                            property={item}
                            onViewDetails={(id) => window.open(`/details/${id}`, "_blank")}
                            onImgClick={() => handlenearImageClick(item)}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </>
                );
              })()}

              {/* ------- Amenities ------ */}
              <div className="mb-3 mt-3 container">
                <h2 className="mb-2 ms-[-12px] text-2xl font-bold font-geometric-regular text-[#3C4142] ">
                  Amenities {pjName}
                </h2>
                <div className="w-12 h-1 bg-yellow-500"></div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg mb-4 smallsizes">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 dtl-amenities-inner">
                    {property?.amenities?.map((category, index) => {
                      const allIcons = { ...FaIcons, ...MdIcons, ...AiIcons, ...GiIcons };
                      const Icon = allIcons[category.icon];

                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center space-y-1 border-2 border-dashed border-[#367588] p-[11px] rounded-[7px]"
                        >
                          {Icon ? (
                            <Icon className="text-[30px] text-[#367588]" />
                          ) : (
                            <SiTicktick className="text-[30px] text-[#367588]" />
                          )}
                          <p className="text-sm text-gray-500 font-semibold text-center">
                            {category.name}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
              {/* ------- Key Features -------- */}
              <div className="mb-3 container">
                <h2 className="mb-2 ms-[-12px] text-2xl font-bold font-geometric-regular text-[#3C4142] ">
                  Key Features {pjName}
                </h2>
                <div className="w-12 h-1 bg-yellow-500"></div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg mb-4 smallsizes">
                <div className="space-y-6">
                  <div className="flex items-center flex-wrap gap-2 dtl-amenities-inner">
                    {property?.keyfeature?.map((category, index) => {
                      return (
                        <div
                            key={index}
                            className="flex gap-2 items-center text-white space-y-1 border-2 font-semibold bg-[#367588] p-[11px] rounded-[7px] cursor-pointer"
                            title={category.description}
                          >
                            <Star className="font-semibold" />{category.name}
                          </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Floor Plans & Documents Section - Takes 2/3 Width */}
              <div className="mb-3 container">
                <h2 className="mb-2 ms-[-12px] text-2xl font-bold font-geometric-regular text-[#3C4142]">
                  Floor Plans & Documents
                </h2>
                <div className="w-12 h-1 bg-yellow-500"></div>
              </div>

              <div className="shadow-sm bg-white rounded-lg smallsizes">
                <div className="w-full">
                  {/* Tab Buttons */}
                  <div className="flex flex-wrap border-b">
                    {allTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 border-b-2 transition-colors duration-200 ${activeTab === tab
                          ? "border-blue-600 text-blue-600 font-semibold"
                          : "border-transparent text-gray-600"
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="mt-2 p-4">
                    {activeTab && (
                      <>
                        {/* BHK Configuration Tab Content */}
                        {property?.bhk_configurations
                          ?.filter(
                            (config) =>
                              `${config.bhk_type}` ===
                              activeTab
                          )
                          .map((config) => (
                            <div key={config.id} className="mb-6">
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="text-md font-semibold mb-2">
                                  {config.bhk_type} - {config.carpet_area} sqft
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Bedrooms:</span>{" "}
                                    {config.bedrooms}
                                  </div>
                                  <div>
                                    <span className="font-medium">Bathrooms:</span>{" "}
                                    {config.bathrooms}
                                  </div>
                                  <div>
                                    <span className="font-medium">Balconies:</span>{" "}
                                    {config.balconies}
                                  </div>
                                  <div>
                                    <span className="font-medium">Super Built-up:</span>{" "}
                                    {config.super_built_up_area} sqft
                                  </div>
                                  <div>
                                    <span className="font-medium">Carpet Area:</span>{" "}
                                    {config.carpet_area} sqft
                                  </div>
                                </div>
                              </div>

                              {config.file_url && (
                                <>
                                  <img
                                    src={config.file_url}
                                    alt={`${config.bhk_type} - ${config.carpet_area} sqft`}
                                    className="w-full max-h-[500px] object-contain border rounded-lg mt-4"
                                  />
                                  <a
                                    href={config.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline mt-2 block"
                                  >
                                    View {config.bhk_type} Floor Plan (
                                    {config.carpet_area} sqft)
                                  </a>
                                </>
                              )}
                            </div>
                          ))}

                        {/* Document Tab Content */}
                        {documentTabsWithSuffix
                          .filter((doc) => doc.tabName === activeTab)
                          .map((doc) => (
                            <div key={doc.id} className="mb-6">
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
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:flex-row gap-6 mt-10">
                {/* Video Section - Takes 2/3 Width */}
                <div className=" bg-white shadow-sm rounded-lg p-6 smallsizes">
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

              <div className="bg-white mt-5 p-4 rounded-lg shadow-md smallsizes">
                <h2 className="text-lg text-[#3C4142] font-bold mb-4">
                  Explore Neighbourhood - {property?.details?.project_name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                  {property?.nearest_to?.map((place) => (
                    <div className="bg-[#367588] mb-1 p-2 rounded-lg flex flex-col">
                      <div
                        key={place.id}
                        className="border-2 p-3 border-dashed border-[#fff] rounded-lg flex-1"
                      >
                        <div className="flex flex-col items-center justify-between">
                          <span className="text-white text-sm font-medium mb-1">{place.name}</span>
                          <span className="text-white text-xs font-semibold">{place.distance_km}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Neighbourhood Section - Takes 1/3 Width */}
            <div className="md:col-span-4  dtl-neibourhood">
              <AdCards location="property_details" />
              <Review propertyId={id} />
              <div className="max-w-md mx-auto mt-4">
                <div className="bg-white rounded-lg p-6">
                  <button
                    className="absolute top-3 right-3 text-gray-500"
                    onClick={() => setIsContactSellerModalOpen(false)}
                  >
                    <FaTimes size={20} />
                  </button>
                  <h3 className="text-lg text-[#3C4142] font-bold text-center mb-4">
                    Please Fill The Details to{" "}
                    {formPurpose === "contact"
                      ? "Get The Contact Number."
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
                        Mobile
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
            </div>
          </section>
          {/* -------- Location Map ----- */}
          {property?.location && <LocationMap location={property.location} />}
          {/* Property in Similar Project */}
          {similar.filter(
            (similar) =>
              similar.subcategory_name === property?.basic?.property_subcategory_name &&
              similar.id !== property?.basic?.id
          ).length > 0 && (
              <div className="mt-5">
                <div className="mb-5 container">
                  <h2 className="mb-2 ms-[-12px] text-2xl font-bold font-geometric-regular text-[#3C4142]">
                    Property in Similar Project
                  </h2>
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
                  {similar
                    .filter(
                      (similar) =>
                        similar.subcategory_name === property?.basic?.property_subcategory_name &&
                        similar.id !== property?.basic?.id
                    )
                    .map((property, index) => (
                      <SwiperSlide key={property.id || index}>
                        <PropertyCard
                          property={property}
                          onViewDetails={(id) => window.open(`/details/${id}`, '_blank')}
                          onImgClick={() => handleImageClick(property)}
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            )}

          {/* ------- Review ----- */}
          {reviews.length > 0 && (
            <div className="mt-5 pb-5">
              <div className="mb-5 container">
                <h2 className="mb-2 ms-[-12px] text-2xl font-bold font-geometric-regular text-[#3C4142]">
                  Ratings & Reviews
                </h2>
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
                  1440: { slidesPerView: 3 },
                }}
              >
                {reviews.map((review, index) => (
                  <SwiperSlide key={index}>
                    <TestimonialCard
                      name={review.name}
                      review={review.review}
                      rating={review.rating}
                      onClickCard={handleCardClick}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          <ReviewModal
            isOpen={!!selectedReview}
            onClose={closeModal}
            reviewData={selectedReview}
          />

          {/* ------- Faq------ */}
          <div className="bg-[#F4EFE5]">
            <div className="container mx-auto sm:p-10 md:p-16 pt-2">
              <div className="mb-5">
                <h2 className="mb-2 text-2xl font-bold  font-geometric-regular text-[#3C4142]">Frequently Asked Questions</h2>
                <div className="w-12 h-1 bg-yellow-500"></div>
              </div>

              {/* FAQ Content */}
              <div className="w-full mx-auto flex flex-col lg:flex-row justify-between pb-1 faq gap-4">
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
                          <span className="faq_count text-sm">{index + 1}</span>
                          <span className="text-base">{faq.question}</span>
                        </div>
                        <ChevronDown
                          className={`transition-transform ${openFAQ === index ? "rotate-180" : "rotate-0"}`}
                        />
                      </button>
                      {openFAQ === index && (
                        <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full mx-2 md:mx-5 max-w-4xl rounded shadow-lg p-6 relative">
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

    </>
  );
};

export default PropertyDetails;
