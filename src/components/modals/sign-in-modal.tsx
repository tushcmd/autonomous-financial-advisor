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
    const [signInClicked, setSignInClicked] = useState(false);
    const router = useRouter(); // Initialize router

    const handleSignIn = async () => {
        setSignInClicked(true);
        try {
            const result = await signIn("google", { redirect: false });
            if (result?.error) {
                console.error("Sign in error:", result.error);
                setSignInClicked(false);
            } else {
                // Redirect to onboarding after successful sign-in
                router.push("/onboarding");
                setTimeout(() => setShowSignInModal(false), 400);
            }
        } catch (error) {
            console.error("Sign in error:", error);
            setSignInClicked(false);
        }
    };

    return (
        <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
            <div className="w-full">
                <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">

                    <h3 className="font-urban text-xl font-bold">Sign In</h3>
                    <p className="text-sm">
                        Sign in with your Google account.
                    </p>

                </div>

                <div className="flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
                    <Button
                        variant="default"
                        disabled={signInClicked}
                        onClick={handleSignIn}
                    >
                        {signInClicked ? (
                            <Loader className="mr-2 size-4 animate-spin" />
                        ) : (
                            <Google className="mr-2 size-4" />
                        )}{" "}
                        Sign In with Google
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