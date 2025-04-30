"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const goalOptions = [
    {
        id: "RETIREMENT",
        title: "Retirement",
        description: "Build a nest egg for comfortable retirement",
        icon: "🏖️",
    },
    {
        id: "GROWTH",
        title: "Growth",
        description: "Focus on capital appreciation over time",
        icon: "📈",
    },
    {
        id: "INCOME",
        title: "Income",
        description: "Generate regular dividend income",
        icon: "💰",
    },
    {
        id: "PRESERVATION",
        title: "Preservation",
        description: "Protect capital while achieving modest growth",
        icon: "🛡️",
    },
    {
        id: "SPECULATION",
        title: "Speculation",
        description: "Higher risk investments for potentially larger returns",
        icon: "🎯",
    },
    {
        id: "OTHER",
        title: "Other",
        description: "Define your own custom goal",
        icon: "✏️",
    },
]

export default function OnboardingPage() {
    const router = useRouter()
    const { data: session, update } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedGoal, setSelectedGoal] = useState("")
    const [customGoal, setCustomGoal] = useState("")
    const [portfolioName, setPortfolioName] = useState("My Portfolio")
    const [step, setStep] = useState(1)

    const handleGoalSelection = async () => {
        if (!selectedGoal) {
            toast.error("Please select a portfolio goal")
            return
        }

        if (selectedGoal === "OTHER" && !customGoal.trim()) {
            toast.error("Please describe your custom goal")
            return
        }

        setStep(2)
    }

    const handleSubmit = async () => {
        try {
            setIsLoading(true)

            const response = await fetch("/api/onboarding", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    portfolioGoal: selectedGoal,
                    longTermGoal: selectedGoal === "OTHER" ? customGoal : null,
                    portfolioName: portfolioName.trim() || "My Portfolio",
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to complete onboarding")
            }

            // Update the session to reflect that onboarding is complete
            await update({
                ...session,
                user: {
                    ...session?.user,
                    hasCompletedOnboarding: true,
                },
            })

            toast.success("Onboarding completed successfully!")
            router.push("/dashboard")
            router.refresh()
        } catch (error) {
            console.error("Onboarding error:", error)
            toast.error("Failed to complete onboarding. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const getSelectedGoalTitle = () => {
        const goal = goalOptions.find((g) => g.id === selectedGoal)
        return goal ? goal.title : ""
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Welcome to StockTrack!</CardTitle>
                    <CardDescription>
                        {step === 1
                            ? "Let's set up your portfolio goals. This will help us personalize your experience."
                            : "Almost done! Let's finalize your portfolio setup."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium mb-3">What is your primary investment goal?</h3>
                                <RadioGroup
                                    value={selectedGoal}
                                    onValueChange={setSelectedGoal}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    {goalOptions.map((goal) => (
                                        <div key={goal.id}>
                                            <RadioGroupItem value={goal.id} id={goal.id} className="peer sr-only" />
                                            <Label
                                                htmlFor={goal.id}
                                                className={cn(
                                                    "relative flex flex-col items-center justify-between rounded-md border-2 bg-popover p-4 cursor-pointer h-full transition-all duration-200",
                                                    "hover:bg-accent/50 hover:border-accent",
                                                    selectedGoal === goal.id ? [
                                                        "border-primary",
                                                        "bg-primary/5",
                                                        "ring-2",
                                                        "ring-primary/10",
                                                        "shadow-[0_0_15px_rgba(0,0,0,0.05)]"
                                                    ] : [
                                                        "border-muted",
                                                        "hover:border-muted"
                                                    ]
                                                )}
                                            >
                                                <div className={cn(
                                                    "text-2xl mb-2 transform transition-all duration-200",
                                                    selectedGoal === goal.id && "scale-110"
                                                )}>
                                                    {goal.icon}
                                                </div>
                                                <div className={cn(
                                                    "font-semibold",
                                                    selectedGoal === goal.id && "text-primary"
                                                )}>
                                                    {goal.title}
                                                </div>
                                                <div className={cn(
                                                    "text-sm text-muted-foreground text-center mt-1",
                                                    selectedGoal === goal.id && "text-primary/80"
                                                )}>
                                                    {goal.description}
                                                </div>
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {selectedGoal === "OTHER" && (
                                <div className="space-y-2">
                                    <Label htmlFor="custom-goal">Please describe your investment goal:</Label>
                                    <Textarea
                                        id="custom-goal"
                                        placeholder="I want to..."
                                        value={customGoal}
                                        onChange={(e) => setCustomGoal(e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="portfolio-name">Portfolio Name</Label>
                                <Input
                                    id="portfolio-name"
                                    placeholder="My Portfolio"
                                    value={portfolioName}
                                    onChange={(e) => setPortfolioName(e.target.value)}
                                />
                            </div>
                            <div className="bg-muted p-4 rounded-md">
                                <h3 className="font-medium mb-2">Your Selected Goal</h3>
                                <div className="flex items-center space-x-3">
                                    <div className="text-2xl">{goalOptions.find((g) => g.id === selectedGoal)?.icon || "🎯"}</div>
                                    <div>
                                        <p className="font-medium">{getSelectedGoalTitle()}</p>
                                        {selectedGoal === "OTHER" ? (
                                            <p className="text-sm text-muted-foreground">{customGoal}</p>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">
                                                {goalOptions.find((g) => g.id === selectedGoal)?.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-md">
                                <h3 className="font-medium mb-2">What&apos;s Next?</h3>
                                <p className="text-sm text-muted-foreground">
                                    After completing this setup, you&apos;ll be taken to your dashboard where you can:
                                </p>
                                <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
                                    <li>View your portfolio performance</li>
                                    <li>Make virtual trades</li>
                                    <li>Track your investment progress</li>
                                    <li>Receive personalized recommendations</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    {step === 2 && (
                        <Button variant="outline" onClick={() => setStep(1)} disabled={isLoading}>
                            Back
                        </Button>
                    )}
                    <Button
                        onClick={step === 1 ? handleGoalSelection : handleSubmit}
                        disabled={isLoading}
                        className={step === 1 ? "w-full" : ""}
                    >
                        {isLoading ? "Processing..." : step === 1 ? "Continue" : "Complete Setup"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

