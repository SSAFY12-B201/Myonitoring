import React, { useState, useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AiOutlineQuestionCircle } from 'react-icons/ai'; // React Icons에서 아이콘 가져오기

interface EyeInfoBoxProps {
  symptom: string; // 질병명
  rightEyeProbability: number; // 오른쪽 눈 확률 (0~100)
  leftEyeProbability: number; // 왼쪽 눈 확률 (0~100)
}

// 질병 설명 매핑
const diseaseDescriptions: Record<string, { title: string; content: string }> = {
  "안검염": {
    title: "안검염 (Blepharitis)",
    content:
      "눈꺼풀에 염증이 생기는 질환으로, 세균 감염, 알레르기 또는 외부 자극에 의해 발생할 수 있습니다. 초기 증상으로는 눈꺼풀의 붓기, 발적, 가려움증이 있으며 치료하지 않으면 이차적인 안구 질환을 유발할 수 있습니다.",
  },
  "결막염": {
    title: "결막염 (Conjunctivitis)",
    content:
      "결막에 염증이 생기는 질환으로, 바이러스(허피스바이러스), 세균 감염, 알레르기 등이 주요 원인입니다. 초기 증상으로는 눈의 충혈, 눈물 과다 분비, 노란색 눈곱 등이 있으며 치료하지 않으면 시력 손상으로 이어질 수 있습니다.",
  },
  "각막부골편": {
    title: "각막부골편 (Corneal Sequestrum)",
    content:
      "각막이 검게 변색하며 괴사하는 질환으로, 만성적인 각막 손상이나 허피스바이러스 감염과 관련됩니다. 초기 증상으로는 각막에 갈색 또는 검은 반점이 나타나며 통증이 심해질 수 있어 수술적 치료가 필요합니다.",
  },
  "비궤양성 각막염": {
    title: "비궤양성 각막염 (Non-Ulcerative Keratitis)",
    content:
      "각막 표면에 궤양 없이 염증이 발생하는 질환으로, 헤르페스바이러스 감염이나 외상이 주요 원인입니다. 초기 증상으로는 각막 혼탁과 눈물 증가가 있으며 방치하면 만성화될 가능성이 높습니다.",
  },
  "각막 궤양": {
    title: "각막궤양 (Corneal Ulcer)",
    content:
      "각막의 상피층이 손상되어 궤양이 생기는 질환으로, 외상이나 세균 감염이 주요 원인입니다. 초기 증상으로는 심한 통증과 충혈이 있으며 치료하지 않으면 시력 상실로 이어질 수 있습니다.",
  },
};

const EyeInfoBox: React.FC<EyeInfoBoxProps> = ({
  symptom,
  rightEyeProbability,
  leftEyeProbability,
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // 박스 확장 여부 상태
  const boxRef = useRef<HTMLDivElement>(null); // 박스 참조

  // 색상 결정 로직
  const getColors = (probability: number) => {
    if (probability < 50) {
      return ['#FFE76B', '#FFF4CC']; // 노란색과 연한 노란색
    } else if (probability < 75) {
      return ['#F78D2B', '#FFD4A6']; // 주황색과 연한 주황색
    } else {
      return ['#FF5E2D', '#FFB8A6']; // 빨간색과 연한 빨간색
    }
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
      setIsExpanded(false); // 박스 닫기
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={boxRef} className="p-4 bg-white border border-gray-300 rounded-lg mb-6">
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
        <ResponsiveContainer width="100%" height={200}>
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
              cornerRadius={10}
            >
              {[{ name: '확률', value: rightEyeProbability }, { name: '나머지', value: 100 - rightEyeProbability }].map(
                (entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColors(rightEyeProbability)[index]} />
                )
              )}
            </Pie>

            {/* 중앙 텍스트 */}
            <text x="50%" y="45%" textAnchor="middle" 
            dominantBaseline="middle" className="text-xl font-bold text-orange">
              {rightEyeProbability.toFixed(0)}%
            </text>
            <text
            className="text-xs font-bold text-lightGray"
            x="50%"
            y="59%"
            textAnchor="middle"
            dominantBaseline="middle"
            >
            오른쪽
            </text>
          </PieChart>
        </ResponsiveContainer>

        {/* 왼쪽 눈 그래프 */}
        <ResponsiveContainer width="100%" height={200}>
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
              cornerRadius={10}
            >
              {[{ name: '확률', value: leftEyeProbability }, { name: '나머지', value: 100 - leftEyeProbability }].map(
                (entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColors(leftEyeProbability)[index]} />
                )
              )}
            </Pie>

            {/* 중앙 텍스트 */}
            <text x="50%" y="45%" textAnchor="middle" 
            dominantBaseline="middle" className="text-xl font-bold ">
              {leftEyeProbability.toFixed(0)}%
            </text>
            <text
            className="text-xs font-bold"
            x="50%"
            y="59%"
            textAnchor="middle"
            dominantBaseline="middle"
            >
            왼쪽
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 상세 설명 */}
      {isExpanded && (
        <div className="text-gray-600 text-sm whitespace-pre-line">
          {/* 설명 제목 */}
          <h3 className="font-bold mb-2">{diseaseDescriptions[symptom]?.title || `${symptom} 설명`}</h3>
          {/* 설명 내용 */}
          <p>{diseaseDescriptions[symptom]?.content || "관련 설명을 찾을 수 없습니다."}</p>
        </div>
      )}
    </div>
  );
};

export default EyeInfoBox;
