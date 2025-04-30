import { signIn } from "next-auth/react";
import {
    Dispatch,
    JSX,
    SetStateAction,
    SVGProps,
    useCallback,
    useMemo,
    useState,
} from "react";
import { useRouter } from "next/navigation"; // Import useRouter

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

import { Loader } from "lucide-react";

function SignInModal({
    showSignInModal,
    setShowSignInModal,
}: {
    showSignInModal: boolean;
    setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) {
    const [signingInProvider, setSigningInProvider] = useState<"google" | "github" | null>(null);
    const router = useRouter(); // Initialize router

    const handleSignIn = async (provider: "google" | "github") => {
        setSigningInProvider(provider);
        try {
            const result = await signIn(provider, { redirect: false });
            if (result?.error) {
                if (result.error === "OAuthAccountNotLinked") {
                    console.error("Sign in error: Account not linked");
                    router.push("/auth/error?error=OAuthAccountNotLinked");
                } else {
                    console.error("Sign in error:", result.error);
                }
            } else {
                // Redirect to onboarding after successful sign-in
                router.push("/onboarding");
                setTimeout(() => setShowSignInModal(false), 400);
            }
        } catch (error) {
            console.error("Sign in error:", error);
        }
        setSigningInProvider(null);
    };

    return (
        <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
            <div className="w-full">
                <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">

                    <h3 className="font-urban text-xl font-bold">Sign In</h3>
                    <p className="text-sm">
                        Sign in with your Google or GitHub account.
                    </p>

                </div>

                <div className="flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
                    <Button
                        variant="default"
                        disabled={signingInProvider === "google"}
                        onClick={() => handleSignIn("google")}
                    >
                        {signingInProvider === "google" ? (
                            <Loader className="mr-2 size-4 animate-spin" />
                        ) : (
                            <Google className="mr-2 size-4" />
                        )}{" "}
                        Sign In with Google
                    </Button>
                    <Button
                        variant="outline"
                        disabled={signingInProvider === "github"}
                        onClick={() => handleSignIn("github")}
                    >
                        {signingInProvider === "github" ? (
                            <Loader className="mr-2 size-4 animate-spin" />
                        ) : (
                            <GitHub className="mr-2 size-4" />
                        )}{" "}
                        Sign In with GitHub
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export function useSignInModal() {
    const [showSignInModal, setShowSignInModal] = useState(false);

    const SignInModalCallback = useCallback(() => {
        return (
            <SignInModal
                showSignInModal={showSignInModal}
                setShowSignInModal={setShowSignInModal}
            />
        );
    }, [showSignInModal, setShowSignInModal]);

    return useMemo(
        () => ({
            setShowSignInModal,
            SignInModal: SignInModalCallback,
        }),
        [setShowSignInModal, SignInModalCallback],
    );
}

function Google(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    // Merge classes but ensure size classes are applied
    const className = props.className || "size-4";

    return (
        <svg
            {...props}
            className={className}
            width="16" // Add explicit width
            height="16" // Add explicit height
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
        >
            <path
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                fill="currentColor"
            />
        </svg>
    );
}

function GitHub(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    const className = props.className || "size-4";
    return (
        <svg
            {...props}
            className={className}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                fill="currentColor"
            />
        </svg>
    );
}