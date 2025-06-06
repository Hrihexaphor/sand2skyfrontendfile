import React, { useState, useRef, useEffect } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";
import NewNav from "../header/NewNav";
import Footer from "../footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BlogPage = () => {
  const navigate = useNavigate();
  const listRef = useRef();
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  // Normalize and count categories
  const categoryCounts = {};
  const safeBlogs = Array.isArray(blogs) ? blogs : [];

  safeBlogs.forEach((blog) => {
    const category = blog.category_name || blog.category || "Uncategorized";
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const uniqueCategoriesWithCounts = Object.entries(categoryCounts);

  // Filtered blog list
  const filteredProperties = safeBlogs.filter((blog) => {
    const blogCategory = blog.category_name || blog.category || "Uncategorized";
    const matchesSearch = blog.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = selectedCategory
      ? blogCategory === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
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

const handleDetailsClick = (id) => {
    navigate(`/blogDetails/${id}`);
}

  return (
    <>
      <NewNav />
      <section className="bg-[#F4EFE5]" ref={listRef}>
        <div className="mb-4 ps-0">
          <div className="relative w-full h-[200px] md:h-[300px] overflow-hidden">
            <img
              src="https://cdn.pixabay.com/photo/2016/10/06/17/28/architecture-1719526_640.jpg"
              alt="breadcrumb"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div className="absolute mt-5 inset-0 flex flex-col items-center justify-center text-white">
              <h2 className="text-3xl font-bold font-geometric-regular">
                Blogs
              </h2>
              <p className="mt-2 text-sm">
                <Link
                  to="/"
                  className="no-underline text-white font-semibold"
                >
                  Home
                </Link>
                <span className="mx-1">/</span>
                <span className="text-yellow-400 font-semibold">Blogs</span>
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-5 px-4 flex flex-col lg:flex-row gap-8">
          {/* Blog Cards */}
          <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 self-start">
            {filteredProperties.map((blog) => {
              const category = blog.category_name || blog.category || "Uncategorized";
              return (
                <div
                  key={blog.id}
                  className="rounded overflow-hidden shadow-lg flex flex-col bg-white cursor-pointer border"
                  onClick={() => handleDetailsClick(blog.id)}
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
                  <div className="p-3 pb-6 relative h-[150px]">
                    <div className="flex items-center justify-between mb-2">
                      {/* <p className="bg-[#367588] text-white text-xs py-[4px] px-[10px] rounded-lg mt-0 mb-0">
                        {category}
                      </p> */}
                      <p className="no-underline mb-0 cursor-pointer text-sm text-[#367588] font-bold flex items-center gap-2 mt-0">
                        {formatDate(blog.created_at)}
                      </p>
                    </div>
                    <a
                      href="#"
                      className="no-underline font-medium text-center text-base text-[#3C4142] transition duration-500 ease-in-out block mb-2"
                      title={blog.title}
                    >
                      {blog.title.split(" ").slice(0, 12).join(" ")}{blog.title.split(" ").length > 12 ? "..." : ""}
                    </a>
                    <p className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-sm text-[#367588] font-bold">Read More..</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-1/4 h-[100vh]">
            <div className="bg-white rounded-lg shadow p-4 sticky top-[10%]">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full border px-3 py-2 rounded focus:outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <h4 className="font-semibold text-base mb-2 text-gray-700">
                Categories
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li
                  onClick={() => setSelectedCategory(null)}
                  className={`flex justify-between border-b pb-1 cursor-pointer ${selectedCategory === null
                    ? "font-bold text-[#367588]"
                    : ""
                    }`}
                >
                  <span>All Blogs</span> <span>({safeBlogs.length})</span>
                </li>

                {uniqueCategoriesWithCounts.map(([category, count]) => (
                  <li
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex justify-between border-b pb-1 cursor-pointer ${selectedCategory === category
                      ? "font-bold text-[#367588]"
                      : ""
                      }`}
                  >
                    <span>{category}</span> <span>({count})</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default BlogPage;
