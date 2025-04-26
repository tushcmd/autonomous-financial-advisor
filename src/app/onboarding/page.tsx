"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
];

export default function PortfolioGoalsPage() {
    const router = useRouter();
    const [selectedGoal, setSelectedGoal] = useState("");
    const [customGoal, setCustomGoal] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedGoal) {
            toast.error("Please select a portfolio goal");
            return;
        }

        if (selectedGoal === "OTHER" && !customGoal.trim()) {
            toast.error("Please describe your custom goal");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/onboarding/goals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    portfolioGoal: selectedGoal,
                    longTermGoal: selectedGoal === "OTHER" ? customGoal : null,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save portfolio goal");
            }

            toast.success("Portfolio goal saved successfully!");
            router.push("/dashboard"); // Redirect to dashboard after successful submission
        } catch (error) {
            console.error("Error saving portfolio goal:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-3xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Welcome to StockTrack!</CardTitle>
                    <CardDescription>
                        Let&apos;s set up your portfolio goals. This will help us personalize your experience.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-3">What is your primary investment goal?</h3>
                            <RadioGroup value={selectedGoal} onValueChange={setSelectedGoal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {goalOptions.map((goal) => (
                                    <div key={goal.id}>
                                        <RadioGroupItem
                                            value={goal.id}
                                            id={goal.id}
                                            className="peer sr-only"
                                        />
                                        <Label
                                            htmlFor={goal.id}
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer h-full"
                                        >
                                            <div className="text-2xl mb-2">{goal.icon}</div>
                                            <div className="font-semibold">{goal.title}</div>
                                            <div className="text-sm text-muted-foreground text-center mt-1">
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
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? "Saving..." : "Continue to Dashboard"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}