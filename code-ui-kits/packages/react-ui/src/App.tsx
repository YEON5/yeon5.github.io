// export default App
// import { useState } from 'react'
import { useForm } from 'react-hook-form'; // 1. useForm 추가
import {
    Form,
    FormField,
    FormItem, // 레이아웃 잡는 용도
    FormLabel,
    FormControl, // Input/Checkbox를 감싸는 용도
    FormDescription,
    FormMessage,
} from '@/components/ui/form';
import { EasyFormField } from '@/components/ui/form-layout';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from '@/components/ui/field';
import { SingleAccordion, MultipleAccordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Tabs, TabsContent, BoxTabsList, BoxTabsTrigger, LineTabsList, LineTabsTrigger } from '@/components/ui/tabs';

function App() {
    // 1. 폼 초기화 (react-hook-form)
    const form = useForm({
        defaultValues: {
            terms: false, // 초기값 설정
            username: '',
            email: '',
        },
    });

    return (
        // Tailwind로 간단한 레이아웃 잡기 (중앙 정렬, 여백)
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-10">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border">
                {/* 1. 버튼 테스트 */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Button Component</h2>
                    <div className="flex gap-2">
                        <Button>기본 버튼</Button>
                        <Button variant="destructive">삭제 버튼</Button>
                        <Button variant="outline">외곽선 버튼</Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Form Component</h2>
                    <div className="flex gap-2">
                        <Form {...form}>
                            <form className="space-y-6 w-full">
                                {/* 3. FormField 패턴 적용 */}
                                <FormField
                                    control={form.control} // form 제어권 전달
                                    name="terms" // 필드 이름
                                    render={({ field }) => (
                                        // 4. render prop 내부에서 UI 구성
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                {/* Checkbox와 field 연결 */}
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>약관에 동의합니다 (Full name)</FormLabel>
                                                <FormDescription>필수 항목입니다.</FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control} // form 제어권 전달
                                    name="username" // 필드 이름
                                    render={({ field }) => (
                                        // 4. render prop 내부에서 UI 구성
                                        <FormItem className="flex flex-col items-start gap-2 rounded-md border p-4">
                                            <FormLabel>이름</FormLabel>
                                            <FormControl>
                                                <Input id="input-demo" type="text" placeholder="" {...field} />
                                            </FormControl>
                                            <FormMessage>*필수 항목입니다.</FormMessage>
                                        </FormItem>
                                    )}
                                />

                                <div className="rounded-md border p-4">
                                    <EasyFormField name="email" label="이메일" placeholder="이메일입력" />
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>

                {/* 2. 체크박스/인풋 테스트 */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">checkbox/input Component</h2>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-3">
                            <Field orientation="horizontal">
                                <Checkbox id="checkbox1" name="checkbox1" />
                                <Label htmlFor="checkbox1">체크박스</Label>
                            </Field>
                            <Field orientation="vertical">
                                <FieldLabel htmlFor="tel">전화번호</FieldLabel>
                                <Input id="tel" type="tel" placeholder="-없이 입력" />
                            </Field>
                            <Field orientation="vertical">
                                <FieldLabel htmlFor="address">주소</FieldLabel>
                                <ButtonGroup>
                                    <Input id="address" type="text" placeholder="주소" />
                                    <Button variant="outline">Search</Button>
                                </ButtonGroup>
                                <Input id="address1" type="text" placeholder="상세주소" disabled />
                            </Field>
                        </div>
                        {/* field + label + checkbox */}
                        <FieldGroup className="max-w-sm">
                            <Field>
                                <FieldLabel htmlFor="username">이름</FieldLabel>
                                <Input id="username" type="text" placeholder="Enter your username" />
                                <FieldDescription>Choose a unique username for your account.</FieldDescription>
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox" name="terms-checkbox" />
                                <Label htmlFor="terms-checkbox">Accept terms and conditions</Label>
                            </Field>
                            <Field orientation="horizontal">
                                <Checkbox id="terms-checkbox-2" name="terms-checkbox-2" defaultChecked />
                                <FieldContent>
                                    <FieldLabel htmlFor="terms-checkbox-2">Accept terms and conditions</FieldLabel>
                                    <FieldDescription>By clicking this checkbox, you agree to the terms.</FieldDescription>
                                </FieldContent>
                            </Field>
                            <Field orientation="horizontal" data-disabled>
                                <Checkbox id="toggle-checkbox" name="toggle-checkbox" disabled />
                                <FieldLabel htmlFor="toggle-checkbox">Enable notifications</FieldLabel>
                            </Field>
                            <FieldLabel>
                                <Field orientation="horizontal">
                                    <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" />
                                    <FieldContent>
                                        <FieldTitle>Enable notifications</FieldTitle>
                                        <FieldDescription>You can enable or disable notifications at any time.</FieldDescription>
                                    </FieldContent>
                                </Field>
                            </FieldLabel>
                        </FieldGroup>
                    </div>
                </div>

                <hr className="border-slate-200" />

                {/* 2. 아코디언 테스트 (Radix 동작 확인) */}
                {/* <div className="space-y-4">
                    <h2 className="text-xl font-bold">1. Single Accordion</h2>
                    <SingleAccordion />
                </div>
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">2. Multiple Accordion</h2>
                    <MultipleAccordion />
                </div> */}

                <div className="space-y-4">
                    <h2 className="text-xl font-bold">1. Single Accordion</h2>
                    {/* 1. 싱글 모드 사용 예시 */}
                    <SingleAccordion>
                        <AccordionItem value="single-item1">
                            <AccordionTrigger>React가 뭔가요?</AccordionTrigger>
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
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">2. Multiple Accordion</h2>
                    {/* 2. 멀티 모드 사용 예시 */}
                    <MultipleAccordion>
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

                <div className="space-y-4">
                    <h2 className="text-xl font-bold">tabs</h2>
                    {/* 1. 박스형 탭 사용 예시 */}
                    <Tabs defaultValue="music" className="w-full">
                        {/* 박스형 List & Trigger 사용 */}
                        <BoxTabsList>
                            <BoxTabsTrigger value="music">Music</BoxTabsTrigger>
                            <BoxTabsTrigger value="video">Video</BoxTabsTrigger>
                            <BoxTabsTrigger value="live">Live</BoxTabsTrigger>
                        </BoxTabsList>

                        <TabsContent value="music" className="p-4 border rounded-md mt-2">
                            🎵 음악 리스트가 여기에 나옵니다.
                        </TabsContent>
                        <TabsContent value="video" className="p-4 border rounded-md mt-2">
                            🎬 동영상 컨텐츠 영역입니다.
                        </TabsContent>
                        <TabsContent value="live" className="p-4 border rounded-md mt-2">
                            🔴 실시간 라이브 영역입니다.
                        </TabsContent>
                    </Tabs>

                    {/* 2. 라인형 탭 사용 예시 */}
                    <Tabs defaultValue="account" className="w-full">
                        {/* 라인형 List & Trigger 사용 */}
                        <LineTabsList>
                            <LineTabsTrigger value="account">내 계정</LineTabsTrigger>
                            <LineTabsTrigger value="password">비밀번호</LineTabsTrigger>
                        </LineTabsList>

                        <TabsContent value="account" className="pt-4">
                            <h3 className="font-bold">계정 설정</h3>
                            <p className="text-slate-500 text-sm">프로필 정보를 수정하세요.</p>
                        </TabsContent>
                        <TabsContent value="password" className="pt-4">
                            <h3 className="font-bold">비밀번호 변경</h3>
                            <p className="text-slate-500 text-sm">안전한 비밀번호를 사용하세요.</p>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default App;
