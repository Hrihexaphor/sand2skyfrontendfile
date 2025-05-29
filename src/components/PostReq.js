import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css/autoplay';
import axios from "axios";
// import NewNav from "./header/NewNav";
// import Footer from "./footer/Footer";

const PostReq = () => {
  const [activeTab, setActiveTab] = useState("Buy");
  const initialForm = {
    name: "",
    email: "",
    whatsapp: "",
    city: "",
    budget: "",
    property: "",
    constructionStatus: "",
    professionTp: "",
    intrestHloan: "",
    knowCreditScore: "",
    payBrokerage: "",
    onsiteExpl: ""
  };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "whatsapp") {
      // Allow only digits and limit to 10 characters
      if (!/^\d*$/.test(value)) return; // blocks non-numeric characters
      if (value.length > 10) return; // limit to 10 digits
    }
    if (name === "budget") {
      if (!/^\d*$/.test(value)) return; // blocks non-numeric characters
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const convertToApiPayload = () => {
    return {
      name: formData.name,
      email: formData.email,
      inquiry_for: activeTab.toLowerCase(),
      phone_number: formData.whatsapp,
      city: formData.city,
      budget: Number(formData.budget),
      property_category: formData.property,
      construction_status: formData.constructionStatus,
      profession_type: formData.professionTp,
      interested_in_loan: formData.intrestHloan === "Yes",
      know_credit_score: formData.knowCreditScore === "Yes",
      ready_to_pay_brokerage: formData.payBrokerage === "Yes",
      onsite_explanation: formData.onsiteExpl === "Yes",
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["name", "email", "whatsapp", "city", "budget", "payBrokerage"];
    if (activeTab === "Buy") {
      requiredFields.push("professionTp", "intrestHloan", "knowCreditScore", "property", "constructionStatus", "onsiteExpl");
    }

    const errors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = "This field is required";
      }
    });

    // WhatsApp specific validation
    if ((formData.whatsapp || "").length !== 10) {
      errors.whatsapp = "WhatsApp number must be exactly 10 digits";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      try {
        const payload = convertToApiPayload();
        const res = await axios.post("https://realestatesand2sky.onrender.com/api/inquiryleads", payload);
        // alert("Inquiry submitted successfully!");
        toast.success('Inquiry submitted successfully! Our team Contact you soon.');
        setFormData(initialForm);
      } catch (error) {
        // alert("Submission failed. Please try again.");
        toast.error('Submission failed. Please try again!');
        console.error(error);
      }
    }
  };


  return (
    <>
      {/* <NewNav /> */}
      <div className="bg-white">
        <section>
          <div className="flex">
            <div className="req-left-box relative">
              <img src={"https://images.unsplash.com/photo-1520880446380-51410f244831?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXxQV283WUx4Nml1Y3x8ZW58MHx8fHx8"} alt="req-img" className="w-full h-full cover" />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              <div className="absolute top-[30%] px-[8%]">
                <h1 className="text-white font-bold mb-3">Save Money,<br /> Save The Environment.</h1>
                <h4 className="text-white font-base mb-3">Providing Value to Our Clients Through Ongoing Product & Innnovations.</h4>
                <p className="text-white font-base mb-2">Our real-estate service delivers value through customer-focused solutions, transparacy and expert support.</p>
              </div>
            </div>
            <div className="req-right-box p-10">
              <Link to="/" className="cursor-pointer text-xl font-[600] no-underline flex items-center gap-1">
                <RiArrowLeftSLine className="text-[25px] font-bold mt-[4px]" /> Home
              </Link>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-6 space-y-4 sm:space-y-0">
                <h4 className="text-lg text-[#3C4142] sm:text-xl md:text-2xl font-sans font-bold">
                  Post Your Requirement
                </h4>
                <div className="space-x-0 sm:space-x-2 flex flex-col sm:flex-row gap-2">
                  <div className="flex gap-4 mb-6">
                    {["Buy", "Sell"].map((tab) => (
                      <button
                        key={tab}
                        className={`px-4 py-2 rounded text-white ${activeTab === tab ? "bg-green-700" : "bg-gray-400"
                          }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["name", "email", "whatsapp", "city", "budget"].map((field) => (
                  <div key={field}>
                    <label className="block font-medium capitalize">{field.replace("_", " ")}:<span className="text-red-500">*</span></label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className={`w-full border focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-2 ${formErrors[field] ? "border-red-500" : ""}`}
                      required
                    />
                    {formErrors[field] && (
                      <p className="text-red-500 text-sm mt-1">{formErrors[field]}</p>
                    )}
                  </div>
                ))}

                {activeTab === "Buy" && (
                  <>
                    <SelectField name="property" label="Property Category" options={["Apartment", "Pent House", "Villa", "House", "Residential Plot", "Commercial Plot"]} value={formData.property} onChange={handleChange} error={formErrors.property} />
                    <SelectField name="constructionStatus" label="Construction Status" options={["Ready to Move", "Pre-Launch", "New Launch", "Possession within 2 Year", "Possession Above 2 Year"]} value={formData.constructionStatus} onChange={handleChange} error={formErrors.constructionStatus} />
                    <SelectField name="professionTp" label="Profession Type" options={["Salaried", "Self-Employed", "Business"]} value={formData.professionTp} onChange={handleChange} error={formErrors.professionTp} />
                    <SelectField name="intrestHloan" label="Interested in Loan?" options={["Yes", "No"]} value={formData.intrestHloan} onChange={handleChange} error={formErrors.intrestHloan} />
                    <SelectField name="knowCreditScore" label="Know Credit Score?" options={["Yes", "No"]} value={formData.knowCreditScore} onChange={handleChange} error={formErrors.knowCreditScore} />
                    <SelectField name="onsiteExpl" label="Onsite Explanation?" options={["Yes", "No"]} value={formData.onsiteExpl} onChange={handleChange} error={formErrors.onsiteExpl} />
                  </>
                )}
                <SelectField name="payBrokerage" label="Ready to Pay Brokerage?" options={["Yes", "No"]} value={formData.payBrokerage} onChange={handleChange} error={formErrors.payBrokerage} />

                <div className="col-span-1 sm:col-span-2">
                  <button type="submit" className="w-full bg-[#005F6B] hover:bg-green-700 text-white py-3 rounded transition">
                    Submit Requirement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section >
      </div >
      {/* <Footer /> */}
      <ToastContainer />
    </>
  );
};

const SelectField = ({ name, label, options, value, onChange, error }) => (
  <div>
    <label className="block font-medium">{label}<span className="text-red-500">*</span></label>
    <select name={name} value={value} onChange={onChange} className={`w-full border rounded focus:outline-none focus:ring-2 focus:ring-red-500 p-2 ${error ? "border-red-500" : ""}`} required>
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default PostReq;
