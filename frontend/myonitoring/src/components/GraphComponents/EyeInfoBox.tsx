import React, { useState, useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AiOutlineQuestionCircle } from 'react-icons/ai'; // React Icons에서 아이콘 가져오기

const EyeInfoBox: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false); // 박스 확장 여부 상태
  const boxRef = useRef<HTMLDivElement>(null); // 박스 참조

  // 그래프 데이터
  const symptom = '각막 손상';
  const rightEyeProbability = 56; // 오른쪽 눈 증상의심 확률 (0~100)
  const leftEyeProbability = 56; // 왼쪽 눈 증상의심 확률 (0~100)

  const COLORS = ['#FF8042', '#FFE4C4']; // 주황색과 연한 주황색

  const detailedContent = `- **설명**: 각막 손상은 눈의 외부에서 발생하는 손상으로, 외부 자극이나 감염에 의해 발생할 수 있습니다.
- **초기 증상**: 눈의 통증, 충혈, 시력 저하.
- **위험성**: 치료하지 않으면 각막 궤양이나 시력 손실로 이어질 수 있습니다.`;

  // 버튼 클릭 핸들러
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // 외부 클릭 감지 핸들러
  const handleClickOutside = (event: MouseEvent) => {
    if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
      setIsExpanded(false); // 박스 닫기
    }
  };

  // 외부 클릭 이벤트 등록 및 해제
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      className="p-4 bg-white border border-gray-300 rounded-lg"
    >
      {/* 제목과 질병 정보 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-black">{symptom}</h2>
        <button
          onClick={handleToggle}
          className={`flex items-center px-3 py-2 border rounded-full text-sm ${
            isExpanded ? 'bg-blue-100 text-blue-600 border-blue-300' : 'bg-white text-gray-600 border-gray-300'
          }`}
        >
          질병 정보
          <AiOutlineQuestionCircle
            className={`ml-1 ${isExpanded ? 'text-blue-500' : 'text-gray-500'}`}
            size={16}
          />
        </button>
      </div>

      {/* 그래프 */}
      <div className="flex justify-around mb-4">
        {/* 오른쪽 눈 그래프 */}
        <div className="flex flex-col items-center">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie
                data={[
                  { name: '확률', value: rightEyeProbability },
                  { name: '나머지', value: 100 - rightEyeProbability },
                ]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={50}
                startAngle={90}
                endAngle={450}
                fill="#8884d8"
              >
                {[{ name: '확률', value: rightEyeProbability }, { name: '나머지', value: 100 - rightEyeProbability }].map(
                  (entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  )
                )}
              </Pie>
              {/* 원형 그래프 중앙 텍스트 */}
                <text
                x="50%"
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xl font-bold text-orange"
                >
                {rightEyeProbability}%
               </text>
               <text
                x="50%"
                y="63%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-bold text-lightGray"
                >
                왼쪽
               </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 왼쪽 눈 그래프 */}
        <div className="flex flex-col items-center">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie
                data={[
                  { name: '확률', value: leftEyeProbability },
                  { name: '나머지', value: 100 - leftEyeProbability },
                ]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={50}
                startAngle={90}
                endAngle={450}
                fill="#8884d8"
              >
                {[{ name: '확률', value: leftEyeProbability }, { name: '나머지', value: 100 - leftEyeProbability }].map(
                  (entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  )
                )}
              </Pie>
              {/* 원형 그래프 중앙 텍스트 */}
                <text
                className="text-xl font-bold text-orange"
                x="50%"
                y="45%"
                textAnchor="middle"
                dominantBaseline="middle"
                >
                {rightEyeProbability}%
               </text>
               <text
                className="text-xs font-bold text-lightGray"
                x="50%"
                y="63%"
                textAnchor="middle"
                dominantBaseline="middle"
                >
                오른쪽
               </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 상세 설명 */}
      {isExpanded && (
        <div className="text-gray-600 text-sm whitespace-pre-line">
          <hr className="mb-6 border-gray-300"/>
          {detailedContent}
        </div>
      )}
    </div>
  );
};

export default EyeInfoBox;
