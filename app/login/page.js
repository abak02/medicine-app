
import LoginForm from '@/app/ui/login-form';
import Link from 'next/link';
import { lusitana } from '../ui/fonts';
 
export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className={` ${lusitana.className} text-white text-lg font-medium md:text-2xl md:font-bold`}>
            <Link href="/">Medicine App</Link>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}