// src/components/UserCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UserCard = ({ user }) => {
    console.log(user);
    
  return (
    <div className="flex flex-col items-center p-6 border text-white border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-gray-900">
      <Link to={`/profile/${user.username}`}>
      <img
        src={user.avatar}
        alt={user.name}
        className="w-20 h-20 rounded-full mb-4"
      />
      </Link>
      <h3 className="text-xl font-semibold">{user.name}</h3>
      <p className="text-gray-500 mb-2">@{user.username}</p>
      <div className="flex justify-around w-full mt-4">
        <div className="text-center">
          <p className="text-lg font-bold">{user.posts}</p>
          <p className="text-sm text-gray-500">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">{user.followers}</p>
          <p className="text-sm text-gray-500">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">{user.likes}</p>
          <p className="text-sm text-gray-500">Likes</p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;