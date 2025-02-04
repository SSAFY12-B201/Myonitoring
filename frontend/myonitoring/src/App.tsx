import { useState, useEffect } from "react";
import SplashScreen from "./pages/SplashScreen";

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // API 호출 (한 번만 실행됨)
    fetch("/api/hello")
      .then((response) => response.json())
      .then((data) => console.log("API Response:", data))
      .catch((error) => console.error("API Error:", error));
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <main className="flex items-center justify-center h-screen">
          <h1 className="text-3xl font-bold">메인 화면</h1>
        </main>
      )}
    </>
  );
};

export default App;
