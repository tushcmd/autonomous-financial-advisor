
import Link from "next/link";
import React, { FC } from "react";


function StocksIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-chart-candlestick-icon lucide-chart-candlestick ${className || ""}`}><path d="M9 5v4" /><rect width="4" height="6" x="7" y="9" rx="1" /><path d="M9 15v2" /><path d="M17 3v2" /><rect width="4" height="8" x="15" y="5" rx="1" /><path d="M17 13v3" /><path d="M3 3v16a2 2 0 0 0 2 2h16" /></svg>
    )
}
const Logo: FC = () => {
    return (
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <StocksIcon className="w-4 h-4 text-primary" />
            <span className="text-lg font-semibold">AFINAD</span>
        </Link>
    );
};

export default Logo;