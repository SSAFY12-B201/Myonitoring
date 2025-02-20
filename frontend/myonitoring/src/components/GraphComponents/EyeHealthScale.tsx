const EyeHealthScale = () => {
  return (
    <div className="space-y-6">
      {/* 안구 건강 척도 */}
      <div className="p-4 bg-white rounded-lg border border-gray-300 shadow-sm">
        {/* 상단 척도 분류 */}
        <div className="flex justify-end space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#FFE76B] rounded-full"></span>
            <span className="text-sm text-gray-800">평균</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#F78D2B] rounded-full"></span>
            <span className="text-sm text-gray-800">의심</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#FF5E2D] rounded-full"></span>
            <span className="text-sm text-gray-800">위험</span>
          </div>
        </div>

        {/* 막대바 */}
        <div className="relative w-full h-3 bg-gray-200 rounded-full mb-6">
          {/* 평균 구간 */}
          <div
            className="absolute left-0 top-0 h-3 bg-[#FFE76B] rounded-l-full"
            style={{ width: "50%" }}
          ></div>
          {/* 의심 구간 */}
          <div
            className="absolute left-[50%] top-0 h-3 bg-[#F78D2B]"
            style={{ width: "25%" }}
          ></div>
          {/* 위험 구간 */}
          <div
            className="absolute left-[75%] top-0 h-3 bg-[#FF5E2D] rounded-r-full"
            style={{ width: "25%" }}
          ></div>

          {/* 척도 표시 */}
          <div className="absolute w-full flex justify-between text-sm text-gray-600 -bottom-1">
            <span style={{ position: "absolute", left: "0%" }}>0%</span>
            <span
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              50%
            </span>
            <span
              style={{
                position: "absolute",
                left: "75%",
                transform: "translateX(-50%)",
              }}
            >
              75%
            </span>
            <span
              style={{
                position: "absolute",
                left: "100%",
                transform: "translateX(-100%)",
              }}
            >
              100%
            </span>
          </div>
        </div>

        {/* 제목과 내용 */}
        <h2 className="text-lg font-bold text-black mb-2 mt-4">
          왜 고양이 안구 건강이 중요한가요?
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          고양이의 경우 건강 진단으로 식욕, 안구 건강이 가장 확실한 신호입니다.
          증상 결과에 표시된 % 수치는 묘니터링 AI를 통해 분석한 증상이 있을
          확률입니다.
        </p>
      </div>
      <div />
    </div>
  );
};

export default EyeHealthScale;
