// 패키지 이름으로 깔끔하게 import 가능!
import { Button, SingleAccordion, AccordionItem, AccordionTrigger, AccordionContent } from 'react-ui';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center p-24 gap-4">
            <h1 className="text-4xl font-bold">HOME (Next.js)</h1>

            {/* react-ui에서 가져온 버튼 */}
            <Button>라이브러리 버튼</Button>
        </main>
    );
}
