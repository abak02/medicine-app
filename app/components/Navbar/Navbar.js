import Link from 'next/link'
import React from 'react'
import '@/app/globals.css'
export default function Navbar() {
    return (
        <div className="navbar bg-base-100 py-6">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-xl">
                    <li><Link href='/'>Home</Link></li>
                    <li>
                        <Link href='/medicineList'>Medicine List</Link>
                    </li>
                    <li><Link href='/dashboard'>Dashboard</Link></li>
                    <li><Link href='#about'>About</Link></li>
                    </ul>
                </div>
                <a className="btn btn-ghost text-xl">Medicine App</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 text-base">
                    <li><Link href='/'>Home</Link></li>
                    <li>
                        <Link href='/medicineList'>Medicine List</Link>
                    </li>
                    <li><Link href='/dashboard'>Dashboard</Link></li>
                    <li><Link href='#about'>About</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <button type='button' className="leafbutton p-4 bg-sky-500 text-white py-4 px-9">Sign in</button>
            </div>
        </div>
    )
}
