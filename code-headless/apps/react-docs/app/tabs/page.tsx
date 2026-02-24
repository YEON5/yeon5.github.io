import { Tabs, TabsList, TabsTrigger, TabsContent } from 'react-ui';
import Link from 'next/link';

export default function TabsPage() {
    // tab 데이터
    const boxTabData = [
        {
            value: 'dataTab1',
            label: 'Data Tab 1',
            content: <div className="px-4 font-bold">데이터 map Tab 1 Content</div>,
        },
        {
            value: 'dataTab2',
            label: 'Data Tab 2',
            content: <div className="px-4 font-bold">데이터 map Tab 2 Content</div>,
        },
        {
            value: 'dataTab3',
            label: 'Data Tab 3',
            content: <div className="px-4 font-bold">데이터 map Tab 3 Content</div>,
        },
    ];

    return (
        <div className="p-10 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Tabs</h1>

            <h2 className="text-xl font-bold">Tabs Data</h2>
            <div className="pt-4">
                <div className="border p-6 rounded-xl">
                    {/* 데이터용 */}
                    <Tabs defaultValue={boxTabData[0].value} className="w-full">
                        <TabsList>
                            {boxTabData.map(tab => (
                                <TabsTrigger key={tab.value} value={tab.value}>
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {boxTabData.map(tab => (
                            <TabsContent key={tab.value} value={tab.value}>
                                {tab.content}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </div>

            <div className="py-8"></div>

            <h2 className="text-xl font-bold">1. Tabs Line</h2>
            <div className="pt-4">
                <div className="border p-6 rounded-xl">
                    {/* 라인형 */}
                    <Tabs defaultValue="tab1">
                        <TabsList size="full">
                            <TabsTrigger value="tab1">Home</TabsTrigger>
                            <TabsTrigger value="tab2">Profile</TabsTrigger>
                            <TabsTrigger value="tab3" disabled>
                                Settings
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="tab1">Home Content</TabsContent>
                        <TabsContent value="tab2">Profile Content</TabsContent>
                        <TabsContent value="tab3">Settings Content</TabsContent>
                    </Tabs>
                </div>
            </div>

            <div className="py-8"></div>

            <h2 className="text-xl font-bold">2. Tabs Box</h2>
            <div className="pt-4">
                <div className="border p-6 rounded-xl">
                    {/* 박스형 */}
                    <Tabs defaultValue="boxTab1">
                        <TabsList variant="secondary" size="full">
                            {/* asChild: slot 기능 */}
                            <TabsTrigger value="boxTab1">Home</TabsTrigger>
                            <TabsTrigger value="boxTab2">Profile</TabsTrigger>
                            <TabsTrigger value="boxTab3" asChild>
                                {/* <a href="#none">Settings</a> */}
                                <Link href="/settings">Settings</Link>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="boxTab1">Home Content</TabsContent>
                        <TabsContent value="boxTab2">Profile Content</TabsContent>
                        <TabsContent value="boxTab3">Settings Content</TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
