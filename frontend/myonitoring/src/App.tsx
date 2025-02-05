import { useState } from "react";
import SplashScreen from "./pages/SplashScreen";
import TopBar from "./components/TopBar"
import BottomBar from "./components/BottomBar"
import MainPage from "./pages/MainpScreeb";

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
    {/* 상단 바 */}
    <TopBar />
    <MainPage/>
    {/* 하단 바 */}
    <BottomBar />
    </>
  );
};

export default App;