import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaArrowsLeftRightToLine, FaBuildingUser } from "react-icons/fa6";
import { BsCurrencyRupee } from "react-icons/bs";
import { IoHome } from "react-icons/io5";

const formatPrice = (price) => {
  const num = parseInt(price, 10);
  if (num >= 10000000) return `${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(2)} Lac`;
  return num.toLocaleString();
};

const PropertyCard = ({ property, onViewDetails, onImgClick }) => {
  const {
    id,
    primary_image,
    project_name,
    developer_name,
    category_name,
    subcategory_name,
    super_built_up_area,
    locality,
    city,
    is_featured,
    expected_price,
    price,
  } = property;

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg cursor-pointer">
        <div className="h-[200px] w-full relative" onClick={() => onImgClick && onImgClick(id)}>
          <img
            src={primary_image}
            alt={project_name}
            className="h-full w-full object-cover rounded-t-lg"
          />
          {is_featured && (
            <p className="absolute top-2 left-2 bg-yellow-500 text-white py-1 px-2 rounded font-bold text-sm">
              Featured
            </p>
          )}
        </div>

        <div className="p-4 cursor-pointer" onClick={() => onViewDetails && onViewDetails(id)}>
          <h3 className="text-lg font-semibold text-[#3C4142] mb-3 mt-0 w-[255px] truncate whitespace-nowrap overflow-hidden">{project_name}</h3>

          <div className="flex flex-wrap justify-between mb-2">
            <div className="flex gap-2 items-center w-[50%] mb-2">
              <BsCurrencyRupee className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-1" />
              <div>
                <p className="text-[13px] text-[#3C4142] font-bold mb-0">
                  Price
                </p>
                <p className="text-[13px] text-gray-600 mt-0 mb-0">
                  {formatPrice(expected_price || price)}
                </p>
              </div>
            </div>

            <div className="flex gap-2 items-center w-[50%] mb-2">
              <IoHome className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-1" />
              <div>
                <p className="text-[13px] text-[#3C4142] font-bold mb-0">Type</p>
                <p className="text-[13px] text-gray-600 mt-0 mb-0 w-[90px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {category_name || subcategory_name}
                </p>
              </div>
            </div>

            <div className="flex gap-2 items-center w-[50%]">
              <FaArrowsLeftRightToLine className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-1" />
              <div>
                <p className="text-[13px] text-[#3C4142] font-bold mb-0">SBA</p>
                <p className="text-[13px] text-gray-600 mt-0 mb-0">{super_built_up_area} sq.ft.</p>
              </div>
            </div>

            <div className="flex gap-2 items-center w-[50%]">
              <FaBuildingUser className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-1" />
              <div>
                <p className="text-[13px] text-[#3C4142] font-bold mb-0">Builder</p>
                <p className="text-[13px] text-gray-600 mt-0 w-[90px] overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer mb-0">
                  {developer_name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-center mb-3">
            <FaMapMarkerAlt className="text-[17px] bg-[#367588] text-white h-[26px] w-[26px] rounded-full p-1" />
            <div>
              <p className="text-[13px] text-[#3C4142] font-bold mb-0">Location</p>
              <p className="text-[13px] text-gray-600 mt-0 mb-0">{locality}, {city}</p>
            </div>
          </div>

          <button
            className="px-3 py-1 bg-[#367588] w-full text-white text-base rounded-md hover:bg-[#1386a8]">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
