import { useState } from "react";
import SplashScreen from "./pages/SplashScreen";

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

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