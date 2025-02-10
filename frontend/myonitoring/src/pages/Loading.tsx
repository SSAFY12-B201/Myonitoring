import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
      <img
        src="/loading.gif"
        alt="로딩 이미지"
        className="w-32 h-32 animate-fade-in"
      />
      <h1 className="text-3xl font-Gidugu text-gray-900">Loading...</h1>
    </div>
  );
};

export default Loading;
