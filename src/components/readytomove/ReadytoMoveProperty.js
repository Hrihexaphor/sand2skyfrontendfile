import { useState, useRef, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt, FaRupeeSign, FaBath, FaFilter, FaHome, FaTimes } from "react-icons/fa";
import { FaArrowsLeftRightToLine, FaBuildingCircleExclamation } from "react-icons/fa6";
import { GiSofa } from "react-icons/gi";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import AdCards from "../advertisement/AdvertiseCard";
import axios from "axios";

const ReadyToMove = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // <------------ API INTEGRATION START -------------->
  // Fetch blog data
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/getreadytomoveproperty`, {
        withCredentials: true,
      })
      .then((res) => {
        setProjects(res.data);
        // setProjects(res.data.blogs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  // <------------ API INTEGRATION END -------------->

  // ======================== main filter ===================>
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filter, setFilter] = useState({
    // purpose: "",  
    bhk: "",
    minBudget: "",
    maxBudget: "",
    locality: "",
    propertyType: "",
    houseType: "",
    possession: ""
  });
  const [page, setPage] = useState(1);
  const listRef = useRef();
  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [page]);
  const [searchQuery, setSearchQuery] = useState("");

  const parseCr = (value) => {
    if (!value) return null;
    return parseFloat(value.replace(/[^\d.]/g, '')) * 10000000;
  };

  const parseBudget = (val) => {
    if (!val) return null;
    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
    return val.includes('CR') ? num * 10000000 : num;
  };

  const minBudget = parseBudget(filter.minBudget);
  const maxBudget = parseBudget(filter.maxBudget);

  const filteredProperties = projects.filter((p) => {
    const propertyPrice = parseBudget(p.expected_price);

    const matchesBudget =
      (!minBudget && !maxBudget) || // no filter set
      (propertyPrice != null &&
        (!minBudget || propertyPrice >= minBudget) &&
        (!maxBudget || propertyPrice <= maxBudget));

    // Other filters (same as before)
    const matchesSearch = !searchQuery || p.project_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPurpose = !filter.purpose || p.purpose?.toLowerCase() === filter.purpose.toLowerCase();
    const matchesBHK = !filter.bhk || String(p.bedrooms) === filter.bhk;
    const matchesPropertyType = !filter.propertyType || p.property_type?.toLowerCase() === filter.propertyType.toLowerCase();
    const matchesHouseType = !filter.houseType || p.apartment_type?.toLowerCase() === filter.houseType.toLowerCase();
    const matchesPossession = !filter.possession || p.possession_status?.toLowerCase() === filter.possession.toLowerCase();
    const matchesLocality = !filter.locality || (p.locality?.toLowerCase() || '').includes(filter.locality.toLowerCase());

    return (
      matchesSearch &&
      matchesPurpose &&
      matchesBHK &&
      matchesPropertyType &&
      matchesHouseType &&
      matchesPossession &&
      matchesLocality &&
      matchesBudget
    );
  });

  // Format date string to "DD MMM YYYY"
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  // Convert price to Lac or Cr format
  function formatPrice(price) {
    const num = parseInt(price, 10);
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`;
    return num.toLocaleString(); // fallback
  }

  return (
    <>
      <NewNav />
      <section className="bg-[#F4EFE5] pb-5 pt-10 md:pt-8 lg:pt-16" >
        <div className="container">
          <div className="mt-5">
            <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">
              Ready To Move-in Properties
            </h2>
            <div className="w-12 h-1 bg-yellow-500"></div>
          </div>

          <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            {/* ------------ Left box ------------> */}
            <div className="lg:col-span-2">
              <div className="flex gap-2 items-center mt-4 mb-4">
                <div className="flex items-center bg-[#fff] w-full py-[5px] px-[10px] rounded-[20px]">
                  <FaSearch className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search Project"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    className="search outline-none w-full bg-transparent"
                  />
                </div>
                <button className="bg-white text-gray-700 font-semibold px-3 py-1 rounded-full flex items-center h-[34px]"
                  onClick={() => setIsFilterModalOpen(true)}>
                  <FaFilter className="me-2" /> Filter
                </button>
              </div>
              {/* ----------- Filter Model ----------> */}
              {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center  z-50">
                  <div className="bg-white filter-modal w-full mx-3 lg:w-[600px] top-[18%] max-w-4xl rounded shadow-lg p-6 relative">
                    <button
                      className="absolute top-3 right-3 text-gray-500"
                      onClick={() => setIsFilterModalOpen(false)}
                    >
                      <FaTimes size={20} />
                    </button>
                    <h4 className="text-lg font-bold text-center mb-2">Filters</h4>
                    <div className="inner-filter bordered border-2 py-2 px-3">
                      <div className="flex flex-col md:flex-row justify-between mb-2">
                        <div className="flex flex-col md:w-[47%]">
                          <label className="text-base font-semibold">Buy/Rent:</label>
                          <div className="flex items-center">
                            <select
                              name="buyrent"
                              value={filter.purpose}
                              onChange={(e) => setFilter({ ...filter, purpose: e.target.value })}
                              className="block w-full p-2 border border-gray-300 outline-0 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Selcet Buy/Rent</option>
                              <option value="Buy">Buy</option>
                              <option value="Rent">Rent</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex flex-col md:w-[47%]">
                          <label className="text-base font-semibold">BHK:</label>
                          <div className="flex items-center">
                            <select
                              name="bhk"
                              value={filter.bhk}
                              onChange={(e) => setFilter({ ...filter, bhk: e.target.value })}
                              className="block w-full p-2 border border-gray-300 outline-0 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select BHK</option>
                              <option value="1 BHK">1 BHK</option>
                              <option value="2 BHK">2 BHK</option>
                              <option value="3 BHK">3 BHK</option>
                              <option value="4 BHK">4 BHK</option>
                              <option value="5 BHK">5 BHK</option>
                              <option value="More than 5">More than 5</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col mb-2">
                        <label className="text-base font-semibold">Budget:</label>
                        <div className="flex gap-2 items-center">
                          <select
                            name="minBudget"
                            value={filter.minBudget}
                            onChange={(e) => setFilter({ ...filter, minBudget: e.target.value })}
                            className="block w-full p-2 border border-gray-300 outline-0 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Min</option>
                            <option value="1 CR">₹1 CR</option>
                            <option value="2 CR">₹2 CR</option>
                            <option value="3 CR">₹3 CR</option>
                          </select>
                          <div className="font-semibold text-gray-800">To</div>
                          <select
                            name="maxBudget"
                            value={filter.maxBudget}
                            onChange={(e) => setFilter({ ...filter, maxBudget: e.target.value })}
                            className="block w-full p-2 border border-gray-300 outline-0 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Max</option>
                            <option value="2 CR">₹2 CR</option>
                            <option value="3 CR">₹3 CR</option>
                            <option value="4 CR">₹4 CR</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row justify-between mb-2">
                        <div className="flex flex-col md:w-[47%]">
                          <label className="text-base font-semibold">Localities:</label>
                          <div className="flex items-center">
                            <select
                              name="locality"
                              value={filter.locality}
                              onChange={(e) => setFilter({ ...filter, locality: e.target.value })}
                              className="block w-full p-2 border border-gray-300 outline-0 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Selcet Locality</option>
                              <option value="Patia">Patia</option>
                              <option value="Yelahanka">Yelahanka</option>
                              <option value="KalingaNagar">Kalinga Nagar</option>
                              <option value="Dumduma">Dumduma</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex flex-col md:w-[47%]">
                          <label className="text-base font-semibold">Properties:</label>
                          <div className="flex items-center">
                            <select
                              name="propertyType"
                              value={filter.propertyType}
                              onChange={(e) => setFilter({ ...filter, propertyType: e.target.value })}
                              className="block w-full p-2 border border-gray-300 outline-0 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select Property</option>
                              <option value="Flat">Flat</option>
                              <option value="House">House</option>
                              <option value="OfficeSpace">Office Space</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row justify-between mb-2">
                        <div className="flex flex-col md:w-[47%]">
                          <label className="text-base font-semibold">Appartment Type:</label>
                          <div className="flex items-center">
                            <select
                              name="apartmentType"
                              value={filter.apartmentType}
                              onChange={(e) => setFilter({ ...filter, apartmentType: e.target.value })}
                              className="block w-full p-2 border border-gray-300 outline-0 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Selcet Type</option>
                              <option value="Duplex">Duplex</option>
                              <option value="PentHouse">Pent House</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex flex-col md:w-[47%]">
                          <label className="text-base font-semibold">Posession Status:</label>
                          <div className="flex items-center">
                            <select
                              name="possession"
                              value={filter.possession}
                              onChange={(e) => setFilter({ ...filter, possession: e.target.value })}
                              className="block w-full p-2 border border-gray-300 outline-0 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select Status</option>
                              <option value="Construction">Construction</option>
                              <option value="R2M">Ready to Move</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#367588] text-white rounded-md hover:bg-[#1386a8] mt-3 float-right"
                      onClick={() => {
                        setIsFilterModalOpen(false);
                      }}
                    >Done</button>
                  </div>
                </div>
              )}

              {/* ======== Project Card ==========> */}
              {loading ? (
                <p className="text-center text-gray-600 text-lg py-6">Loading properties...</p>
              ) : (filteredProperties.sort((a, b) => (b.is_featured === true) - (a.is_featured === true)).map((project, index) => (
                <div
                  key={index}
                  className="bg-[#fff] rounded-lg mb-4 flex md:flex-row flex-col shadow-[0_4px_20px_rgba(0,95,107,0.2)]"
                >
                  <Link to={`/imgsec`} className="md:w-[40%] relative list-imgbox">
                    <img
                      src={project.primary_image}
                      alt={project.title}
                      className="w-[100%] h-[100%] rounded-tl-md md:rounded-bl-md object-cover"
                    />
                    {project.is_featured === true && (
                      <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 py-[5px] px-[10px] rounded-[5px]">
                        Featured
                      </p>
                    )}
                  </Link>
                  <div className="flex-1 p-4 md:w-[60%]">
                    <h3 className="text-sm text-gray-500 semibold mb-0">
                      {project.title}
                    </h3>
                    <h3 className="text-lg text-[#3C4142] bold mb-3">
                      {project.project_name}
                    </h3>
                    <div className="flex gap-2 items-center mb-2">
                      <FaMapMarkerAlt className="text-[17px] text-[#367588]" />
                      <p className="text-gray-600 mb-0">{project.locality}, {project.city}</p>
                    </div>
                    <div className="flex flex-wrap justify-between items-center bg-[#F4EFE5] p-2 mb-2">
                      <div className="flex gap-2 items-center w-[50%] md:w-[33%] mb-2">
                        <FaRupeeSign className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Price</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{formatPrice(project.price)}</p>
                        </div>

                      </div>
                      <div className="flex gap-2 items-center w-[50%] md:w-[33%] mb-2">
                        <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">SBA</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{project.built_up_area} sq.ft.</p>
                        </div>

                      </div>
                      <div className="flex gap-2 items-center w-[50%] md:w-[33%] mb-2">
                        <RiMoneyRupeeCircleLine className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Per sq.ft.</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{project.price_per_sqft}</p>
                        </div>
                      </div>
                      {/* </div>
                                                                                              <div className="flex justify-between items-center bg-[#F4EFE5] p-2 mb-2"> */}
                      <div className="flex gap-2 items-center w-[50%] md:w-[33%]">
                        <FaHome className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Carpet Area</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{project.carpet_area} sq.ft.</p>
                        </div>

                      </div>
                      <div className="flex gap-2 items-center w-[50%] md:w-[33%]">
                        <FaBath className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Bathroom</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{project.bathrooms}</p>
                        </div>

                      </div>
                      <div className="flex gap-2 items-center w-[50%] md:w-[33%]">
                        <GiSofa className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Furnishing</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{project.furnished_status}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center mb-2">

                      <div className="flex gap-2 items-center">
                        <FaBuildingCircleExclamation className="text-[17px] text-[#367588]" />
                        <p className="text-gray-600 mb-0">Posessioned By : {formatDate(project.available_from)}</p>
                      </div>
                    </div>
                    <div className="flex bg-[#f4efe5] py-[2px] px-[13px]">
                      <small className="text-[12px] font-bold">Property Listed By : </small>
                      <p className="text-gray-600 mb-0 mt-[-4px]">{project.developer_name}</p>
                    </div>
                    <div className="flex float-right mt-2">
                      <button
                        className=" px-4 py-2 bg-[#367588] text-white rounded-md hover:bg-[#1386a8]"
                      // onClick={() => handleDetailsClick(project.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
              )}

            </div>

            {/* ------- right box ------- */}
            <div className="block lg:flex flex-col gap-4 p-4">
              <AdCards />
            </div>
          </div>

        </div>
      </section>
      <Footer />
    </>
  );
};

export default ReadyToMove;