import Link from 'next/link'; // 페이지 이동용 링크
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body className="flex min-h-screen">
                {/* 1. 사이드바 (왼쪽 메뉴) */}
                <aside className="w-64 bg-slate-50 border-r p-6 hidden md:block">
                    <h1 className="font-bold text-xl mb-6">Radix UI Docs</h1>
                    <nav className="flex flex-col space-y-2">
                        {/* Link 컴포넌트를 써야 페이지가 부드럽게 바뀝니다 */}
                        <Link href="/" className="hover:text-blue-600">
                            Home
                        </Link>
                        <Link href="/button" className="hover:text-blue-600">
                            Button
                        </Link>
                        <Link href="/forms" className="hover:text-blue-600">
                            Forms
                        </Link>
                        <Link href="/accordion" className="hover:text-blue-600">
                            Accordion
                        </Link>
                        <Link href="/tabs" className="hover:text-blue-600">
                            Tabs
                        </Link>
                    </nav>
                </aside>

                {/* 2. 메인 컨텐츠 (오른쪽 화면) */}
                <main className="flex-1 p-8">
                    {children} {/* 여기에 아까 만든 page.tsx 들이 들어옵니다 */}
                </main>
            </body>
        </html>
    );
}
