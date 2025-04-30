"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TermsPage() {
    const router = useRouter();

    return (
        <div className="container layout-container max-w-3xl py-12">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6"
            >
                ← Back to Login
            </Button>

            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

            <div className="prose prose-slate dark:prose-invert max-w-none">
                <h2>1. Acceptance of Terms</h2>
                <p>By accessing and using AFINAD (Autonomous Financial Advisor), you accept and agree to be bound by the terms and conditions of this agreement.</p>

                <h2>2. Description of Service</h2>
                <p>AFINAD provides financial portfolio management and advisory services through an automated platform. The service includes virtual trading, portfolio tracking, and investment recommendations.</p>

                <h2>3. User Obligations</h2>
                <p>You agree to use AFINAD for lawful purposes only and in accordance with these terms. You are responsible for maintaining the confidentiality of your account information.</p>

                <h2>4. Disclaimer</h2>
                <p>The information provided through AFINAD is for educational and demonstration purposes only. We do not provide financial advice, and any recommendations should not be construed as financial advice.</p>

                <h2>5. Changes to Terms</h2>
                <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website.</p>
            </div>
        </div>
    );
}
