const EyeHealthScale = () => {
    return (
      <div className="p-4 bg-white rounded-lg border border-gray-300 shadow-sm">
        {/* 상단 척도 분류 */}
        <div className="flex justify-end space-x-4 mb-4">
          {[
            { color: "#FFE76B", label: "평균" },
            { color: "#F78D2B", label: "의심" },
            { color: "#FF5E2D", label: "위험" },
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span
                className={`w-2 h-2 rounded-full`}
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-sm text-gray-800">{item.label}</span>
            </div>
          ))}
        </div>
  
        {/* 막대바 */}
        <div className="relative w-full h-3 bg-gray-200 rounded-full mb-6">
          {[
            { width: "50%", color: "#FFE76B", rounded: "rounded-l-full" },
            { width: "25%", color: "#F78D2B", rounded: "" },
            { width: "25%", color: "#FF5E2D", rounded: "rounded-r-full" },
          ].map((section, index) => (
            <div
              key={index}
              className={`absolute top-0 h-3 ${section.rounded}`}
              style={{ width: section.width, backgroundColor: section.color }}
            ></div>
          ))}
  
          {/* 척도 표시 */}
          <div className="absolute w-full flex justify-between text-sm text-gray-600 -bottom-1">
            {[0, 50, 75, 100].map((value, index) => (
              <span
                key={index}
                style={{
                  position: "absolute",
                  left: `${value}%`,
                  transform:
                    value === 0
                      ? "none"
                      : value === 100
                      ? "translateX(-100%)"
                      : "translateX(-50%)",
                }}
              >
                {value}%
              </span>
            ))}
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
    );
  };
  
export default EyeHealthScale