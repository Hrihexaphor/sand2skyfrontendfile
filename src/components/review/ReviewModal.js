import React from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewModal = ({ isOpen, onClose, reviewData }) => {
    if (!isOpen || !reviewData) return null;

    const { name, review, rating } = reviewData;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg m-2 p-6 max-w-xl w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-4 text-gray-500 text-2xl font-bold"
                >
                    &times;
                </button>
                <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < rating ? "text-yellow-400 text-xl" : "text-gray-300 text-xl"} />
                    ))}
                </div>
                <p className="text-gray-700 text-lg italic mb-4">
                    <span className="text-2xl text-[#367588] font-semibold">"</span>
                    {review}
                    <span className="text-2xl text-[#367588] font-semibold">"</span>
                </p>
                <p className="text-right font-semibold text-[#367588]">{name}</p>
            </div>
        </div>
    );
};

export default ReviewModal;
