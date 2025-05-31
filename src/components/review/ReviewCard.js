import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewCard = ({ name, review, rating }) => {
   
    return (
        <div className="bg-white shadow-md rounded-2xl p-6 max-w-sm">
            <div className="flex items-center mb-4 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < rating ? "text-yellow-400 text-[40px]" : "text-gray-300 text-[40px]"} />
                ))}
            </div>
            <p className="text-gray-700 text-base mb-4 italic"><span className='text-[30px] text-[#367588] font-semibold'>"</span>{review}<span className='text-[30px] text-[#367588] font-semibold'>"</span></p>
            <p className="text-right font-semibold text-[#367588] mb-0">{name}</p>
        </div>
    );
};

export default ReviewCard;
