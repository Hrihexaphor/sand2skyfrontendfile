import { useState, useEffect } from "react";

const FloorPlan = ({ property }) => {
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (
      (property?.basic?.property_category_name === "Project Apartment" ||
        property?.basic?.property_category_name === "Project Villa") &&
      Array.isArray(property?.bhk_configurations) &&
      property.bhk_configurations.length > 0
    ) {
      setActiveTab(property.bhk_configurations[0].bhk_type);
    }
  }, [property]);

  return (
    <>
      {/* Tabs */}
      {(property?.basic?.property_category_name === "Project Apartment" ||
        property?.basic?.property_category_name === "Project Villa") &&
        property?.bhk_configurations?.map((config) => (
          <button
            key={config.id}
            onClick={() => setActiveTab(config.bhk_type)}
            className={`px-4 py-2 border-b-2 ${
              activeTab === config.bhk_type
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-gray-600"
            }`}
          >
            {config.bhk_type}
          </button>
        ))}

      {/* File Display */}
      {property?.bhk_configurations
        ?.filter((config) => config.bhk_type === activeTab)
        .map((config) => (
          <div key={config.id} className="mt-4">
            <img
              src={config.file_url}
              alt={config.bhk_type}
              className="w-full max-h-[500px] object-contain border rounded-lg"
            />
            <a
              href={config.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline mt-2 block"
            >
              View File URL
            </a>
          </div>
        ))}
    </>
  );
};

export default FloorPlan;