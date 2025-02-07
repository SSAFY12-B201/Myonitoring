import React from 'react';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import ContentSection from '../components/ContentSection';
import EyeInfoBox from '../components/GraphComponents/EyeInfoBox';

const CatEyeInfo: React.FC = () => {
  // 오늘 날짜 포맷팅
  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

  return (
    <>
    <TopBar/>
    <ContentSection>
    <div className="">
      {/* 제목 */}
      <h1 className="text-lg font-bold text-black">
        묘니터링 AI 분석 결과 <span className="text-red-500">의심 증상 발견</span>
      </h1>
      {/* 부제목 */}
      <p className="text-sm text-gray-600 mt-2">아래와 같은 증상이 있을 수 있습니다.</p>
      {/* 확인일 */}
      <p className="text-sm text-gray-600 mt-1">확인일 {formattedDate}</p>
    </div>

    <hr className="mt-6 mb-6 border-gray-300"/>
    
    {/* 안구건강척도 */}
    <div className="p-4 bg-white rounded-lg border border-gray-300 mb-6">
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
          style={{ width: '50%' }}
        ></div>
        {/* 의심 구간 */}
        <div
          className="absolute left-[50%] top-0 h-3 bg-[#F78D2B]"
          style={{ width: '25%' }}
        ></div>
        {/* 위험 구간 */}
        <div
          className="absolute left-[75%] top-0 h-3 bg-[#FF5E2D] rounded-r-full"
          style={{ width: '25%' }}
        ></div>

        {/* 척도 표시 */}
        <div className="absolute w-full flex justify-between text-sm text-gray-600 -bottom-1">
          <span style={{ position: 'absolute', left: '0%' }}>0%</span>
          <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>50%</span>
          <span style={{ position: 'absolute', left: '75%', transform: 'translateX(-50%)' }}>75%</span>
          <span style={{ position: 'absolute', left: '100%', transform: 'translateX(-100%)' }}>100%</span>
        </div>
      </div>

      {/* 제목과 내용 */}
      <h2 className="text-lg font-bold text-black mb-2 mt-8">왜 고양이 안구 건강이 중요한가요?</h2>
      <p className="text-sm text-gray-600 leading-relaxed">
        고양이의 경우 건강 진단으로 식욕, 안구 건강이 가장 확실한 신호 입니다.
        증상 결과에 표시된 % 수치는 묘니터링 AI를 통해 분석한 증상이 있을 확률로
        아래와 같이 구분해 제공하고 있어요.
      </p>
    </div>

    <EyeInfoBox/>

    </ContentSection>
    <BottomBar/>
    </>
  );
};

export default CatEyeInfo;
