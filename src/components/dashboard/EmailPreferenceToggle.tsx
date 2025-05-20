'use client';

import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface EmailPreferenceToggleProps {
    initialValue?: boolean;
}

export function EmailPreferenceToggle({ initialValue = true }: EmailPreferenceToggleProps) {
    const [receiveDailyEmails, setReceiveDailyEmails] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleChange = async (checked: boolean) => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/user/preferences', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ receiveDailyEmails: checked }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update preference');
            }

            setReceiveDailyEmails(checked);

            // Updated toast implementation
            toast.success(
                checked
                    ? "You're now subscribed to daily market summaries."
                    : "You've unsubscribed from daily market summaries.",
                {
                    description: "Preferences Updated",
                    duration: 3000,
                }
            );
        } catch (error) {
            console.error('Error updating email preference:', error);

            // Updated error toast implementation
            toast.error(
                "There was a problem saving your preferences. Please try again.",
                {
                    description: "Update Failed",
                    duration: 5000,
                }
            );

            // Revert the UI state on error
            setReceiveDailyEmails(!checked);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center space-x-2 py-2">
            <Switch
                id="daily-email-toggle"
                checked={receiveDailyEmails}
                onCheckedChange={handleToggleChange}
                disabled={isLoading}
                aria-label="Toggle daily email subscription"
            />
            <Label htmlFor="daily-email-toggle" className="text-sm text-gray-700 dark:text-gray-300">
                Receive daily market summaries
            </Label>
            {isLoading && (
                <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            )}
        </div>
    );
}