import React, { useState, useRef, useEffect } from "react";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import { BsCalendarDate } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";


const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const posts = [
  {
    id: 1,
    author: "Jonathan Reinink",
    date: "Aug 18",
    categories: ["Cooking"],
    image:
      "https://images.pexels.com/photos/61180/pexels-photo-61180.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "Simplest Salad Recipe ever",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: 2,
    author: "Jonathan Reinink",
    date: "Aug 18",
    categories: ["Recipe"],
    image:
      "https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "Best Pizza in Town",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: 3,
    author: "Jonathan Reinink",
    date: "Aug 18",
    categories: ["Cooking"],
    image:
      "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    title: "Best Salad Images ever",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
];
const BlogDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  // <------------ API INTEGRATION START -------------->
    // Fetch blog data
    useEffect(() => {
      axios
        .get(`https://realestatesand2sky.onrender.com/api/blog/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setBlogs(res.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, [id]);
    // <------------ API INTEGRATION END -------------->
    // <------------ API INTEGRATION START -------------->
    const [similar, setSimilar] = useState([]);
      // Fetch blog data
      useEffect(() => {
        axios
          .get(`${process.env.REACT_APP_BASE_URL}/blogs`, {
            withCredentials: true,
          })
          .then((res) => {
            setSimilar(res.data.blogs);
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
    <>
      <NewNav />
      <section className="bg-[#F4EFE5]">
        <div className="mb-4 ps-0">
          <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden">
            <img
              src={"https://cdn.pixabay.com/photo/2016/10/06/17/28/architecture-1719526_640.jpg"}
              alt="breadcrumb image"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            <div className="absolute mt-5 inset-0 flex flex-col items-center justify-center text-white">
              <h2 className="text-3xl font-bold font-geometric-regular">Blog Details</h2>
              <p className="mt-2 text-sm">
                <Link to="/" className="no-underline text-white font-semibold">Home</Link>
                <span className="mx-1">/</span>
                <Link to="/blogs" className="no-underline text-white font-semibold">Blogs</Link>
                <span className="mx-1">/</span>
                <span className="text-yellow-400 font-semibold">Blog Details</span>
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-10 px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Blog Details */}
            <div className="w-full lg:w-2/3">
              <div className="w-full bg-white rounded-lg p-4">
                {/* <img className="w-full" src={blogs.image_url} alt="blog dtl image" /> */}
                 <div className="h-[500px] w-full">
{blogs.image_url ? (
                      <img className="w-full h-[100%] cover" src={blogs.image_url} alt={blogs.title} />
                    ) : blogs.youtube_link ? (
                      <div
                        className="w-full h-[200px] w-full"
                        dangerouslySetInnerHTML={{ __html: blogs.youtube_link }}
                      />
                    ) : null}
                 </div>
                <div className="flex justify-between items-center my-2">
                  <div className="bg-[#367588] inline-block text-white text-sm py-[5px] px-[15px] rounded-lg">{blogs.category_name}</div>
                  <div className="flex gap-2 items-center">
                    <BsCalendarDate className="font-bold text-[#3C4142]" />
                    <p className="mb-0 text-sm font-bold text-[#3C4142]">{formatDate(blogs.created_at)}</p>
                  </div>
                </div>
                <h2 className="my-2 text-[#3C4142] text-2xl">{blogs.title}</h2>
                 <div
                      className="w-full text-gray-500 text-sm"
                      dangerouslySetInnerHTML={{ __html: blogs.description }}
                  />
               </div>
              <div className="my-5">
                <h2 className="mb-2 text-2xl text-[#3C4142] font-bold font-geometric-regular">
                  Other Related Blogs
                </h2>
                <div className="w-12 h-1 bg-yellow-500"></div>
              </div>
              <Slider {...settings}>
                {similar.filter(
                (similar) =>
                  (similar.category_name === blogs.category_name) && (similar.id !== blogs.id)
              ).map((post) => (
                  <div key={post.id} className="p-2">
                    <div
                      className="rounded overflow-hidden flex flex-col cursor-pointer border h-[400px] bg-[#e6e6e6]"
                    >
                      <a href="#">
                        {post.image_url ? (
                      <img className="w-full h-[100%] cover" src={post.image_url} alt={post.title} />
                    ) : post.youtube_link ? (
                      <div
                        className="w-full h-[200px] w-full"
                        dangerouslySetInnerHTML={{ __html: post.youtube_link }}
                      />
                    ) : null}
                      </a>
                      <div className="p-4 pb-6 bg-[#e6e6e6]">
                        <div className="flex items-center justify-between mb-3">
                          <div className="bg-[#367588] text-white text-sm py-[5px] px-[15px] rounded-lg">{post.category_name}</div>
                          <p className="mb-0 text-[#367588] font-semibold">
                           {formatDate(post.created_at)}
                          </p>
                        </div>
                        <h3
                          className="font-lg text-center text-lg text-[#3C4142] transition duration-500 ease-in-out block mb-2"
                        >
                          {post.title}
                        </h3>
                         <div
                        className="w-full text-gray-500 text-sm"
                        dangerouslySetInnerHTML={{ __html: post.description }}
                      />
                      <button className="w-full bg-[#367588] hover:bg-[#1386a8] text-white text-sm py-[5px] px-[15px] rounded-lg"
                    onClick={() => handleDetailsClick(post.id)}>
                      Read More
                    </button>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
            {/* Sidebar */}
            <aside className="hidden lg:block lg:w-1/3 bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-gray-700">Add Sections</h4>
              <div className="hidden md:block bg-white rounded-lg shadow-md p-4  ">
                <div className="bg-yellow-100 text-center p-4 rounded-lg">
                  <img
                    src="https://img.staticmb.com/mbphoto/property/cropped_images/2025/Feb/28/Photo_h180_w240/77495663_3_1740730784979-294_180_240.jpg"
                    alt="Advertise"
                    className="mx-auto mb-3"
                  />
                  <h3 className="text-xl font-semibold">Advertise With Us</h3>
                  <p className="text-gray-600">
                    Reach millions of potential customers
                  </p>
                </div>
                <button className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-md w-full hover:bg-yellow-600">
                  Post Property
                </button>
                <div className="mt-6">
                  <h4 className="text-lg font-semibold">
                    Why Advertise With Us?
                  </h4>
                  <ul className="list-disc pl-4 text-gray-600">
                    <li>Millions of Active Users</li>
                    <li>Targeted Audience</li>
                    <li>High Conversion Rates</li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default BlogDetails;
