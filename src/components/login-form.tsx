import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "lucide-react";

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const [signingInProvider, setSigningInProvider] = useState<"google" | "github" | null>(null);

    const handleSignIn = async (provider: "google" | "github") => {
        setSigningInProvider(provider);
        try {
            const result = await signIn(provider, { redirect: false });
            if (result?.error) {
                if (result.error === "OAuthAccountNotLinked") {
                    router.push("/auth/error?error=OAuthAccountNotLinked");
                }
                console.error("Sign in error:", result.error);
            } else {
                router.push("/onboarding");
            }
        } catch (error) {
            console.error("Sign in error:", error);
        }
        setSigningInProvider(null);
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-1">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">Welcome back</h1>
                                <p className="text-balance text-muted-foreground">
                                    Login to your AFINAD account
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    disabled={signingInProvider === "google"}
                                    onClick={() => handleSignIn("google")}
                                >
                                    {signingInProvider === "google" ? (
                                        <Loader className="mr-2 size-4 animate-spin" />
                                    ) : (
                                        <svg className="mr-2 size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path
                                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    )}
                                    Continue with Google
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    disabled={signingInProvider === "github"}
                                    onClick={() => handleSignIn("github")}
                                >
                                    {signingInProvider === "github" ? (
                                        <Loader className="mr-2 size-4 animate-spin" />
                                    ) : (
                                        <svg className="mr-2 size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path
                                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    )}
                                    Continue with GitHub
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
}
