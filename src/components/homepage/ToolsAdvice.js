import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// ------- slider -----------
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/autoplay';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
// ------- slider end -----

const ToolsAdvice = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Property Legal Services ",
      bgColor: "bg-teal-200",
      iconBg: "bg-teal-400",
      textColor: "text-gray-800",
      icon: "🔑",
      value: "28",
      unit: "min",
      message: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
    },
    {
      title: "EMI Calculator",
      bgColor: "bg-green-200",
      iconBg: "bg-green-400",
      textColor: "text-gray-800",
      icon: "📜",
      value: "32",
      unit: "+",
      message:
        "Calculate your monthly housing loan EMIs effortlessly with our Housing Loan EMI Calculator. Enter loan amount, interest rate, and tenure to get instant results.",
    },
    {
      title: "Home Interior ",
       bgColor: "bg-yellow-200",
      iconBg: "bg-yellow-400",
      textColor: "text-gray-800",
      icon: "🏠",
      value: "25",
      unit: "%",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis, labore, voluptatem. Deserunt illum laborum maxime?",
    },
    {
      title: "Property Investment",
      bgColor: "bg-red-200",
      iconBg: "bg-red-600",
      textColor: "text-black opacity-75",
      icon: "🏢",
      value: "89",
      unit: "m²",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam, nemo!",
    },
  ];

  const [blogs, setBlogs] = useState([]);
  // <------------ API INTEGRATION START -------------->
  // Fetch blog data
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/blogs`, {
        withCredentials: true,
      })
      .then((res) => {
        setBlogs(res.data.blogs);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  // <------------ API INTEGRATION END -------------->

  // Format date string to "DD MMM YYYY"
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  const handleDetailsClick = (id) => {
    navigate(`/blogDetails/${id}`);
  }

  return (
    <div className="bg-[#F4EFE5]">
      <div className="container mx-auto pt-4">
        <div className="mb-5">
          <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">Advice and Tools</h2>
          <div className="w-12 h-1 bg-yellow-500"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 pb-20">
          {cards.map((card, index) =>
            card.title === "EMI Calculator" ? (
              <Link
                to="/emiCalculator"
                key={index}
                className={`flex ${card.bgColor} p-4 rounded-lg shadow-md w-full cursor-pointer no-underline`}
              >
                <CardContent card={card} />
              </Link>
            ) : (
              <Link
                to="/commingsoon"
                key={index}
                className={`flex ${card.bgColor} p-4 rounded-lg shadow-md w-full cursor-pointer no-underline`}
              >
                <CardContent card={card} />
              </Link>
            )
          )}
        </div>
      </div>
      <div className="container mx-auto  sm:p-10  bg-[#F4EFE5] mt-[-40px]">
        <div className="border-b mb-4 flex justify-between text-sm">
          <div className="mb-3">
            <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">Our Blogs</h2>
            <div className="w-12 h-1 bg-yellow-500"></div>
          </div>

          {/* Right Side - Link */}
          <Link to="/blogs" className="text-[#367588] text-sm sm:text-base font-small font-bold flex items-center no-underline font-roboto-light">
            See All Blogs <span className="ml-1">→</span>
          </Link>
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
          {blogs.map((blog, index) => {
            const category = blog.category_name?.trim()
              ? blog.category_name
              : blog.category?.trim()
                ? blog.category
                : "Uncategorized";
            return (
              <SwiperSlide>
                <div key={blog.id} className="p-2">
                  <div
                    onClick={() => handleDetailsClick(blog.id)}
                    className="rounded overflow-hidden flex flex-col cursor-pointer bg-white cursor-pointer border"
                  >
                    <div className="h-[200px] w-full">
                      {blog.image_url ? (
                        <img className="w-full h-[100%] cover" src={blog.image_url} alt={blog.title} />
                      ) : blog.youtube_link ? (
                        <div
                          className="w-full h-[200px] w-full"
                          dangerouslySetInnerHTML={{ __html: blog.youtube_link }}
                        />
                      ) : null}
                    </div>
                    <div className="p-4 pb-6 relative h-[150px]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="bg-[#367588] text-white text-xs py-[4px] px-[10px] rounded-lg mt-0">{category}</div>
                        <p className="mb-0 text-[#367588] text-xs font-semibold mt-0">
                          {formatDate(blog.created_at)}
                        </p>
                      </div>
                      <h3
                        className="font-lg text-center text-lg text-[#3C4142] transition duration-500 ease-in-out block mb-2"
                      >
                        {blog.title}
                      </h3>
                      <p className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-sm text-[#367588] font-bold">Read More..</p>
                      {/* <div
                      className="w-full text-gray-500 text-sm"
                      dangerouslySetInnerHTML={{ __html: blog.description }}
                    /> */}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  );
};

export const CardContent = ({ card }) => (
  <>
    <div className={`${card.iconBg} w-16 flex items-center justify-center p-4 rounded-l-lg`}>
      {card.icon.startsWith("M") ? (
        <svg className="h-8 w-8 text-white fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d={card.icon} />
        </svg>
      ) : (
        <span className="text-3xl">{card.icon}</span>
      )}
    </div>
    <div className={`w-auto ${card.textColor} p-4 flex flex-col justify-center`}>
      <span className="text-lg font-bold">{card.title}</span>
      <p className="leading-tight">{card.message}</p>
    </div>
  </>
);

export default ToolsAdvice;
