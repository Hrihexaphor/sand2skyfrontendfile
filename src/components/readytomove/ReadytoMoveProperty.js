import { useState, useRef, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt, FaRupeeSign, FaBath, FaFilter, FaHome, FaTimes } from "react-icons/fa";
import { FaArrowsLeftRightToLine, FaBuildingCircleExclamation } from "react-icons/fa6";
import { GiSofa } from "react-icons/gi";
import { IoBed } from "react-icons/io5";
import { MdBalcony } from "react-icons/md";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import AdCards from "../advertisement/AdvertiseCard";
import FilterBar from "../homepage/FilterBar";
import axios from "axios";

const Readytomove = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const developer = searchParams.get("developer_name");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [pname, setPname] = useState("");

  const [selectedFilters, setSelectedFilters] = useState({ type: "Buy" });
  const [localities, setLocalities] = useState([]);
  // const [propertyTypes, setPropertyTypes] = useState([]);
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");

  const filterSelectType = selectedFilters.selectType;
  const filterStatus = selectedFilters.status;

  // <------------ API INTEGRATION START -------------->
  // Fetch blog data
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/getreadytomoveproperty`, {
        withCredentials: true,
      })
      .then((res) => {
        setProjects(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [developer]);
  // <------------ API INTEGRATION END -------------->

   useEffect(() => {
      if (projects.length > 0) {
        setLocalities([...new Set(projects.map((p) => p.locality).filter(Boolean))]);
        // setPropertyTypes([...new Set(projects.map((p) => p.subcategory_name).filter(Boolean))]);
        setCities([...new Set(projects.map((p) => p.city).filter(Boolean))]);
      }
    }, [projects]);

  // ======================== main filter ===================>
  const budgetRange = {
    // "< 1 Cr": { min: 0, max: 10000000 },
    "1Cr-2Cr": { min: 10000000, max: 20000000 },
    "2Cr-3Cr": { min: 20000000, max: 30000000 },
    "3Cr-4Cr": { min: 30000000, max: 40000000 },
    "> 4Cr": { min: 40000000, max: Infinity },
  };

  const filteredProperties = projects.filter((property) => {
    const expectedPrice = Number(property.price);

    if (
      selectedFilters.cities &&
      property.city &&
      property.city.toLowerCase() !== selectedFilters.cities.toLowerCase()
    ) return false;

    if (
      selectedFilters.localities &&
      property.locality &&
      property.locality.toLowerCase() !== selectedFilters.localities.toLowerCase()
    ) return false;

    if (
      selectedFilters.propertyType &&
      property.subcategory_name &&
      property.subcategory_name.toLowerCase() !== selectedFilters.propertyType.toLowerCase()
    ) return false;

    if (selectedFilters.bhk) {
      const propBhk = Number(property.bedrooms);
      if (selectedFilters.bhk === "4+ BHK") {
        if (propBhk < 4) return false;
      } else {
        const filterBhk = Number(selectedFilters.bhk.split(" ")[0]);
        if (propBhk !== filterBhk) return false;
      }
    }

    if (selectedFilters.budget) {
      const budgetInfo = budgetRange[selectedFilters.budget];
      if (!budgetInfo || expectedPrice < budgetInfo.min || expectedPrice > budgetInfo.max)
        return false;
    }

    // 9. Select Type
        if (filterSelectType && property.transaction_types?.toLowerCase().trim() !== filterSelectType.toLowerCase().trim()) {
            return false;
        }

        // 10. Status
        if (filterStatus && property.possession_status?.toLowerCase().trim() !== filterStatus.toLowerCase().trim()) {
            return false;
        }

    return true;
  });

   // ------- Search Filter ------>
  const searchFilter = filteredProperties.filter((property) =>
    property.project_name.toLowerCase().includes(search.toLowerCase())
  );

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

  const handleDetailsClick = (id) => {
    window.open(`/details/${id}`, '_blank');
  }

  const handleImageClick = async (project) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/${project.id}/images`, {
        withCredentials: true,
      });
      setModalImages(res.data.images);
      setPname(project.project_name || "Property Name");
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching image data:", error);
    }
  };

  return (
    <>
      <NewNav />
      <section className="bg-[#F4EFE5] pb-5 pt-10 md:pt-8 lg:pt-16" >
        <div className="container">
          <FilterBar
            selected={selectedFilters}
            setSelected={setSelectedFilters}
            dynamicLocalities={
              selectedFilters.cities
                ? localities.filter(
                  (loc) =>
                    projects.find(
                      (p) =>
                        p.locality === loc &&
                        p.city.toLowerCase() === selectedFilters.cities.toLowerCase()
                    )
                )
                : localities
            }
            // dynamicPropertyTypes={propertyTypes}
            dynamicCities={cities}
          />
          <div className="pl-heading1">
            <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">
              Ready to Move-in Properties
            </h2>
            <div className="w-12 h-1 bg-yellow-500"></div>
          </div>

          <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            {/* ------------ Left box ------------> */}
            <div className="lg:col-span-2">
              <span className="text-base text-[#367588] font-semibold absolute -mt-[6px]">{searchFilter.length} Properties</span>
              <div className="flex gap-2 items-center mt-4 mb-4">
                <div className="flex items-center bg-[#fff] w-full py-[5px] px-[10px] rounded-[20px]">
                  <FaSearch className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    placeholder="Search Project"
                    className="search outline-none w-full bg-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* ======== Project Card ==========> */}
              {loading ? (
                <p className="text-center text-gray-600 text-lg py-6">Loading properties...</p>
              ) : searchFilter.length === 0 ? (
                            <div className="text-center text-gray-600 text-lg py-6">
                                No properties match your criteria.
                            </div>
              ) : (searchFilter.sort((a, b) => (b.is_featured === true) - (a.is_featured === true)).map((project, index) => (
                <div className="bg-[#fff] rounded-lg mb-4 flex md:flex-row flex-col shadow-[0_4px_20px_rgba(0,95,107,0.2)]">
                  <div onClick={() => handleImageClick(project)} className="md:w-[40%] relative list-imgbox cursor-pointer">
                    <img
                      src={project.primary_image}
                      alt={project.project_name}
                      className="w-[100%] h-[100%] rounded-tl-md md:rounded-bl-md object-cover"
                    />
                    {project.is_featured === true && (
                      <p className="text-white flex gap-1 items-center font-bold mt-2 absolute top-[1px] left-[3%] bg-yellow-500 py-[5px] px-[10px] rounded-[5px]">
                        Featured
                      </p>
                    )}
                  </div>
                  <div className="flex-1 p-4 md:w-[60%]">
                    <h3 className="text-sm text-gray-500 semibold mb-0">{project.title}</h3>
                    <h3 className="text-lg text-[#3C4142] bold mb-3">{project.project_name}</h3>
                    <div className="flex gap-2 items-center mb-2">
                      <FaMapMarkerAlt className="text-[17px] text-[#367588]" />
                      <p className="text-gray-600 mb-0">
                        {project.locality}, {project.city}
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-between items-center bg-[#F4EFE5] p-2 mb-2">
                      {/* Price */}
                      <div className="flex gap-2 items-center w-[50%] md:w-[33%] mb-2">
                        <FaRupeeSign className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Price</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">
                            {formatPrice(project.expected_price)}
                          </p>
                        </div>
                      </div>
                      {/* SBA */}
                      <div className="flex gap-2 items-center w-[50%] md:w-[33%] mb-2">
                        <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">SBA</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">
                            {(project.category_name === "Project House/Villa" || project.category_name === "Project Apartment")
                              ? project.configurations?.[0]?.super_built_up_area
                              : project.super_built_up_area
                            }
                            sq.ft.
                          </p>
                        </div>
                      </div>
                      {/* Furnishing */}
                      <div className="flex gap-2 items-center w-[50%] md:w-[33%]">
                        <GiSofa className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Furnishing</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">{project.furnished_status}</p>
                        </div>
                      </div>
                      {/* Bedroom */}
                      <div className="flex gap-2 items-center w-[50%] md:w-[33%] mb-2">
                        <IoBed className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Bedroom</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">
                            {(project.category_name === "Project House/Villa" || project.category_name === "Project Apartment")
                              ? project.configurations?.[0]?.bedrooms
                              : project.bedrooms
                            }
                          </p>
                        </div>
                      </div>
                      {/* Bathroom */}
                      <div className="flex gap-2 items-center w-[50%] md:w-[33%]">
                        <FaBath className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Bathroom</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">
                            {(project.category_name === "Project House/Villa" || project.category_name === "Project Apartment")
                              ? project.configurations?.[0]?.bathrooms
                              : project.bathrooms
                            }
                          </p>
                        </div>
                      </div>
                      {/* Balcony */}
                      <div className="flex gap-2 items-center w-[50%] md:w-[33%]">
                        <MdBalcony className="text-[17px] bg-[#367588] text-[#fff] h-[26px] w-[26px] rounded-[25px] p-[5px]" />
                        <div>
                          <p className="text-[#3C4142] text-[13px] font-bold mb-0">Balcony</p>
                          <p className="text-gray-600 text-[13px] mb-0 mt-[0px]">
                            {(project.category_name === "Project House/Villa" || project.category_name === "Project Apartment")
                              ? project.configurations?.[0]?.balconies
                              : project.balconies
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Possession */}
                    <div className="flex lastbtn gap-2 justify-between">
                      <div className="flex gap-2 items-center">
                        <FaBuildingCircleExclamation className="text-[17px] text-[#367588]" />
                        <p className="text-[#3C4142] text-[13px] font-bold mb-0">
                          Possessioned By: <span className="text-gray-600 text-sm font-semibold">{formatDate(project.available_from)}</span>
                        </p>
                      </div>
                      <button
                        className="px-4 py-2 bg-[#367588] text-white rounded-md hover:bg-[#1386a8]"
                        onClick={() => handleDetailsClick(project.id)}
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
              <AdCards location="home" />
            </div>
          </div>

        </div>
      </section>
      {/* ----------- Modal ------------- */}
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
      <Footer />
    </>
  );
};

export default Readytomove;