import React, { useState } from "react";
import SplashScreen from "./pages/SplashScreen";
import LoginSignUp from "./pages/LoginSignUp";

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <main>
        <LoginSignUp />
        {/* <h1 className="text-3xl font-bold">메인 화면</h1> */}
      </main>
    </>
  );
};

export default App;
