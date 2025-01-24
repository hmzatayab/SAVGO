import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../Components/Skeleton";
import PostCard from "../Components/PostCard";
import AnimationWrapper from "../Components/Animations";

function Home() {
  const token = localStorage.getItem("token");
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
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    getAllPosts();
  }, [token]);

  // Get top 4 posts with the most likes
  const topPosts = allPosts
    .sort((a, b) => b.likes.length - a.likes.length)
    .slice(0, 4);

  return (
    <AnimationWrapper initial={{ opacity: 0, scale: 0.5 }} exit={{ opacity: 0, scale: 0.5,}}>
    <div className="mt-28 p-5">
      {/* Upload Section */}
      {token ? (
        <section>
          <Link to="/upload" state={{ from: "home" }}>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-900"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-400"
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
        <section className="dark:bg-gray-900 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
          <div className="py-8 px-4 mx-auto max-w-screen-xl text-center">
            <a
              href="#"
              className="inline-flex items-center py-1 px-4 mb-7 text-sm text-blue-300 bg-gray-800 rounded-full hover:bg-gray-700"
            >
              <span className="text-xs bg-blue-500 rounded-full text-white px-4 py-1.5 mr-3">
                New
              </span>
              <span>Jumbotron component was launched! See what's new</span>
            </a>
            <h1 className="mb-4 text-4xl font-extrabold text-gray-200">
              We invest in the world's potential
            </h1>
            <p className="mb-8 text-lg text-gray-400">
              Here at Flowbite, we focus on markets where technology,
              innovation, and capital can unlock long-term value and drive
              economic growth.
            </p>
            <form className="w-full max-w-md mx-auto">
              <div className="relative">
                <input
                  type="email"
                  className="block w-full p-4 pl-10 text-sm text-gray-300 border border-gray-600 rounded-lg bg-gray-800"
                  placeholder="Enter your email here..."
                  required
                />
                <Link
                  to="/register"
                  className="text-white absolute right-2.5 bottom-2.5 bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Top Posts Section */}
      <div className="mt-6">
        <h2 className="text-3xl font-bold text-gray-400 mb-4">Top 4 Posts</h2>
        {loading ? (
          <Skeleton length="4" />
        ) : topPosts.length === 0 ? (
          <p className="text-gray-400">No posts available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topPosts.map((post) => (
              <PostCard posts={post} key={post._id} />
            ))}
          </div>
        )}
      </div>

      {/* Explore Section */}
      <div className="mt-6">
        <h2 className="text-3xl font-bold text-gray-400 mb-4">Explore</h2>
        {loading ? (
          <Skeleton length="8" />
        ) : allPosts.length === 0 ? (
          <p className="text-gray-400">No posts available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allPosts.map((post) => (
              <PostCard posts={post} key={post._id} />
            ))}
          </div>
        )}
      </div>
    </div>
    </AnimationWrapper>
  );
}

export default Home;
