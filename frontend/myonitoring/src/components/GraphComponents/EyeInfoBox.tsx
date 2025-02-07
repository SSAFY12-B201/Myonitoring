import React, { useState, useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AiOutlineQuestionCircle } from 'react-icons/ai'; // React Icons에서 아이콘 가져오기

const EyeInfoBox: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false); // 박스 확장 여부 상태
  const boxRef = useRef<HTMLDivElement>(null); // 박스 참조

  // 그래프 데이터
  const symptom = '안검염';
  const side = '오른쪽'; // 왼쪽/오른쪽 눈 정보
  const probability = 56; // 증상의심 확률 (0~100)

  const data = [
    { name: '확률', value: probability },
    { name: '나머지', value: 100 - probability },
  ];

  const COLORS = ['#FF8042', '#FFE4C4']; // 주황색과 연한 주황색

  const detailedContent = `- **설명**: 안검염은 눈꺼풀에 염증이 생기는 질환으로, 세균 감염, 알레르기, 또는 외부 자극에 의해 발생할 수 있습니다.
- **초기 증상**: 눈꺼풀의 붓기, 발적, 가려움증, 눈곱 증가.
- **위험성**: 치료하지 않으면 각막염이나 결막염 같은 이차적인 안구 질환을 유발할 수 있습니다.`;

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
          } hover:bg-gray-100 focus:outline-none`}
        >
          질병 정보
          <AiOutlineQuestionCircle
            className={`ml-1 ${isExpanded ? 'text-blue-500' : 'text-gray-500'}`}
            size={16}
          />
        </button>
      </div>

      {/* 그래프 */}
      <div className="flex flex-col items-center mb-4">
        <ResponsiveContainer width={120} height={120}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={50}
              startAngle={90}
              endAngle={450}
              fill="#8884d8"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* 퍼센트와 눈 정보 */}
        <div className="text-center mt-2">
          <p className="text-xl font-bold text-orange-500">{probability}%</p>
          <p className="text-sm text-gray-600">{side}</p>
        </div>
      </div>

      {/* 상세 설명 */}
      {isExpanded && (
        <div className="text-gray-600 text-sm whitespace-pre-line">
          {detailedContent}
        </div>
      )}
    </div>
  );
};

export default EyeInfoBox;
