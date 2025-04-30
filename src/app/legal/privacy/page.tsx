"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    const router = useRouter();

    return (
        <div className="container layout-container max-w-3xl py-12">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6 gap-2"
            >
                <ArrowLeft className="size-4" />
                Back to Sign In
            </Button>

            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

            <div className="prose prose-slate dark:prose-invert max-w-none">
                <h2>1. Information We Collect</h2>
                <p>We collect information you provide directly to us, including name, email address, and portfolio preferences. We also collect usage data to improve our services.</p>

                <h2>2. How We Use Your Information</h2>
                <p>We use collected information to provide and improve our services, personalize your experience, and communicate with you about your account.</p>

                <h2>3. Information Sharing</h2>
                <p>We do not sell or share your personal information with third parties except as described in this policy or with your consent.</p>

                <h2>4. Data Security</h2>
                <p>We implement appropriate security measures to protect your personal information from unauthorized access or disclosure.</p>

                <h2>5. Your Rights</h2>
                <p>You have the right to access, correct, or delete your personal information. Contact us to exercise these rights.</p>
            </div>
        </div>
    );
}
