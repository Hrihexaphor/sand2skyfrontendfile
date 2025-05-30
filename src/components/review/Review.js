import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Review = ({ propertyId }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [review, setReview] = useState('');
  const [errors, setErrors] = useState({});
   const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: name.trim() === '',
      email: email.trim() === '',
      phone: phone.trim() === '',
      review: review.trim() === '',
      rating: rating === 0,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    const reviewData = {
      property_id: propertyId, // Pass this dynamically
      name,
      email,
      phone,
      rating,
      review,
    };

    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_BASE_URL}/review`, reviewData);
      toast.success("Your Review is Submitted");
      setName('');
      setEmail('');
      setPhone('');
      setReview('');
      setRating(0);
      setErrors({});
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Rate & Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`h-8 w-8 cursor-pointer transition-colors ${(hover || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
                }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            />
          ))}
        </div>
        {errors.rating && <p className="text-red-500 text-sm mb-2">Please select a rating.</p>}

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Your Name"
          className="w-full p-2 mb-1 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-gray-500"
        />
        {errors.name && <p className="text-red-500 text-sm mb-2">Name is required.</p>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your Email"
          className="w-full p-2 mb-1 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-gray-500"
        />
        {errors.email && <p className="text-red-500 text-sm mb-2">Email is required.</p>}

        <input
  type="tel"
  value={phone}
  onChange={(e) => {
    const input = e.target.value;
    // Allow only digits and max length 10
    if (/^\d{0,10}$/.test(input)) {
      setPhone(input);
    }
  }}
  placeholder="Enter Your Phone"
  maxLength={10}
  className="w-full p-2 mb-1 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-gray-500"
/>
        {errors.phone && <p className="text-red-500 text-sm mb-2">Phone number is required.</p>}

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review..."
          className={`w-full h-24 p-2 mb-1 border rounded-md focus:outline-none focus:ring-2 ${errors.review ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-500'
            }`}
        ></textarea>
        {errors.review && <p className="text-red-500 text-sm mb-4">Review is required.</p>}
        <button
          type="submit"
          className={`w-full bg-[#367588] text-white py-2 px-4 rounded-md transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#1386a8]"
            }`}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Review;
