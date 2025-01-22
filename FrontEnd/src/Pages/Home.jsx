import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const token = localStorage.getItem("token");
  // const { user } = useContext(UserDataContext);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/user/all-posts`,
          { headers: { Authorization: token ? `Bearer ${token}` : "" } }
        );
        const data = await response.json();
        setAllPosts(data.posts);
        setLoading(false);
      } catch (error) {
        console.error("Error Get posts:", error);
        setLoading(false);
      }
    };
    getAllPosts();
  }, []);

  return (
    <>
      <div className="mt-28 p-5">
        {/* Upload */}
        {token ? (
          <section>
            <Link to={"/upload"}>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-500"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      SVG, PNG or JPG (Ratio 9:16)
                    </p>
                  </div>
                </label>
              </div>
            </Link>
          </section>
        ) : (
          // Sign Up Section
          <section className="dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
            <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
              <a
                href="#"
                className="inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-sm text-blue-300 bg-gray-800 rounded-full hover:bg-gray-700"
              >
                <span className="text-xs bg-blue-500 rounded-full text-white px-4 py-1.5 me-3">
                  New
                </span>
                <span className="text-sm font-medium">
                  Jumbotron component was launched! See what's new
                </span>
                <svg
                  className="w-2.5 h-2.5 ms-2 rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              </a>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-200 md:text-5xl lg:text-6xl">
                We invest in the world's potential
              </h1>
              <p className="mb-8 text-lg font-normal text-gray-400 lg:text-xl sm:px-16 lg:px-48">
                Here at Flowbite we focus on markets where technology,
                innovation, and capital can unlock long-term value and drive
                economic growth.
              </p>
              <form className="w-full max-w-md mx-auto">
                <label
                  htmlFor="default-email"
                  className="mb-2 text-sm font-medium text-gray-300 sr-only"
                >
                  Email sign-up
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 rtl:inset-x-0 start-0 flex items-center ps-3.5 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 16"
                    >
                      <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                      <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="default-email"
                    className="block w-full p-4 ps-10 text-sm text-gray-300 border border-gray-600 rounded-lg bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email here..."
                    required
                  />
                  <Link
                    to={"/register"}
                    className="text-white absolute end-2.5 bottom-2.5 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* User Posts Section */}
        <div className="mt-6">
          <h2 className="text-3xl font-bold text-gray-400 mb-4 ml-4">
            Explore
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-screen">
              <Loader className="size-10 animate-spin" />
            </div>
          ) : allPosts.length === 0 ? (
            <p className="text-gray-400">No posts available.</p>
          ) : (
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              style={{ columnFill: "auto" }}
            >
              {allPosts.map((post, index) => (
                <div
                  key={index}
                  className="break-inside-avoid bg-gray-800 hover:bg-gray-900 shadow-lg rounded-lg overflow-hidden h-fit p-4"
                >
                  {/* Post Image */}
                  <div className="relative w-full pb-[140%] overflow-hidden rounded-lg">
                    <img
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      key={post._id}
                      src={post.imageURL}
                      alt="Post Image"
                    />
                  </div>

                  {/* User Details & Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
                    {/* User Profile */}
                    <div className="flex items-center space-x-4">
                      <img
                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                        src={post.userData.image}
                        alt="User Profile"
                      />
                      <div>
                        <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg">
                          {post.userData.name.length > 5
                            ? post.userData.name.slice(0, 5) + "..."
                            : post.userData.name}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm">
                          @
                          {post.userData.username.length > 10
                            ? post.userData.username.slice(0, 10) + "..."
                            : post.userData.username}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4 sm:mt-0 sm:space-x-6 w-full sm:w-auto">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <i className="ri-heart-line ri-lg sm:ri-xl cursor-pointer"></i>
                        <span className="text-sm sm:text-base">12</span>
                      </div>
                      <i className="ri-download-2-line text-white ri-lg sm:ri-xl cursor-pointer"></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
