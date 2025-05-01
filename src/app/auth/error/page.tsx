"use client";

import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    let errorMessage = "An unknown error occurred.";
    if (error === "OAuthAccountNotLinked") {
        errorMessage =
            "It seems like your account is not linked with this provider. Please try signing in with the provider you used to sign up.";
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold">Authentication Error</h1>
            <p className="mt-4 text-center text-muted-foreground">{errorMessage}</p>
            <a
                href="/sign-in"
                className="mt-6 text-primary underline hover:text-primary-dark"
            >
                Go back to Sign In
            </a>
        </div>
    );
}
