import { SingleAccordion, MultipleAccordion, AccordionItem, AccordionTrigger, AccordionContent } from 'react-ui';
import { User } from 'lucide-react';

export default function AccordionPage() {
    return (
        <div className="p-10 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Accordion</h1>

            <h2 className="text-xl font-bold">1. Single Accordion</h2>
            <div className="pt-4">
                <div className="border p-6 rounded-xl">
                    {/* 1. 싱글 모드 사용 예시 */}
                    <SingleAccordion>
                        <AccordionItem value="single-item1">
                            {/* svg 이미지 사용시 img */}
                            {/* <AccordionTrigger icon={<img src={userIconUrl} alt="User" className="h-5 w-5" />}>디자이너 원본 아이콘</AccordionTrigger> */}
                            <AccordionTrigger icon={<User className="h-4 w-4" />}>React가 뭔가요?</AccordionTrigger>
                            <AccordionContent>React는 사용자 인터페이스를 만들기 위한 JS 라이브러리입니다.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="single-item2">
                            <AccordionTrigger className="text-red-500">스타일 커스텀도 되나요?</AccordionTrigger>
                            <AccordionContent>
                                <span className="font-bold">네!</span> Trigger에 className을 넣으면 스타일이 합쳐집니다. 내용에는 <button className="border p-1">버튼</button>도 넣을 수 있어요.
                            </AccordionContent>
                        </AccordionItem>
                    </SingleAccordion>
                </div>
            </div>

            <div className="py-8"></div>

            <h2 className="text-xl font-bold">2. Multiple Accordion</h2>
            <div className="pt-4">
                <div className="border p-6 rounded-xl">
                    {/* 2. 멀티 모드 사용 예시 */}
                    <MultipleAccordion variant="secondary" size="lg">
                        <AccordionItem value="multiple-item1">
                            <AccordionTrigger>여러 개 열어보세요</AccordionTrigger>
                            <AccordionContent>첫 번째 내용입니다.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="multiple-item2">
                            <AccordionTrigger>두 번째 질문</AccordionTrigger>
                            <AccordionContent>두 번째 내용입니다. 닫히지 않고 같이 열려있죠?</AccordionContent>
                        </AccordionItem>
                    </MultipleAccordion>
                </div>
            </div>
        </div>
    );
}
