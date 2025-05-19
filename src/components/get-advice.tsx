'use client';
import { getPortfolioAdviceForUser } from "@/actions/mastra";

export function PortfolioAdvice({ userId, onAdvice }: { userId: string, onAdvice: (advice: string) => void }) {
    async function handleGetAdvice() {
        const advice = await getPortfolioAdviceForUser(userId);
        if (onAdvice) onAdvice(typeof advice === 'string' ? advice : JSON.stringify(advice));
    }

    return (
        <button onClick={handleGetAdvice} className="btn btn-primary">
            Get Portfolio Advice
        </button>
    );
}