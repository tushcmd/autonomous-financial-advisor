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

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "lucide-react";

function SignInModal({
    showSignInModal,
    setShowSignInModal,
}: {
    showSignInModal: boolean;
    setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) {
    const [signInClicked, setSignInClicked] = useState(false);

    const handleSignIn = async () => {
        setSignInClicked(true);
        try {
            const result = await signIn("google", { redirect: false });
            if (result?.error) {
                console.error("Sign in error:", result.error);
                setSignInClicked(false);
            } else {
                // Successful sign-in
                setTimeout(() => setShowSignInModal(false), 400);
            }
        } catch (error) {
            console.error("Sign in error:", error);
            setSignInClicked(false);
        }
    };

    return (
        <Dialog open={showSignInModal} onOpenChange={setShowSignInModal}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Sign In</DialogTitle>
                    <DialogDescription>
                        Sign in with your Google account.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center py-4">
                    <Button onClick={handleSignIn} disabled={signInClicked} className="flex items-center gap-2">
                        {signInClicked ? (
                            <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                            <GoogleIcon className="h-4 w-4" />
                        )}{" "}
                        Sign In with Google
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
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
        [setShowSignInModal, SignInModalCallback]
    );
}

// Google Icon Component
function GoogleIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12 h8" />
            <path d="M12 8 v8" />
        </svg>
    );
}