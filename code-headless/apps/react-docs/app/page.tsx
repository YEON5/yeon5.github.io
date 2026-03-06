// 패키지 이름으로 깔끔하게 import 가능!
import { Button, SingleAccordion, AccordionItem, AccordionTrigger, AccordionContent } from 'react-ui';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center p-24 gap-4">
            <h1 className="text-4xl font-bold">HOME (Next.js)</h1>

            {/* pds 디자인토큰 css */}
            <div className="space-y-4">
                {/* 컬러 */} <div className="bg-pds-mint-500 text-pds-gray-white p-pds-4 rounded-pds-md">bg-pds-mint-500 </div>
                {/* 배너 배경 */} <div className="bg-pds-banner-green p-pds-3 rounded-pds-sm">bg-pds-banner-green</div>
                {/* 텍스트 컬러 + 폰트 사이즈 */}
                <span className="text-pds-gray-900 text-pds-xl">text-pds-xl / pds-gray-900</span>
                {/* 스페이싱 + 라디우스 */}
                <div className="p-pds-5 rounded-pds-lg border border-pds-gray-200">p-pds-5 / rounded-pds-lg</div>
            </div>

            {/* react-ui에서 가져온 버튼 */}
            <Button>라이브러리 버튼</Button>
        </main>
    );
}
