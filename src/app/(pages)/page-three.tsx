'use client'

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

// Define a type for the demo portfolio
interface DemoPortfolio {
    cashBalance: number;
    type: string;
    fakeTrades: {
        id: string;
        symbol: string;
        shares: number;
        buyPrice: number;
        currentPrice: number;
        status: string;
    }[];
}

export default function Dashboard() {
    const [demoPortfolio, setDemoPortfolio] = useState<DemoPortfolio | null>(null);

    useEffect(() => {
        async function fetchDemoPortfolio() {
            try {
                const response = await fetch("/api/dashboard");
                const data: DemoPortfolio[] = await response.json();
                const demo = data.find((portfolio: DemoPortfolio) => portfolio.type === "DEMO");
                setDemoPortfolio(demo || null);
            } catch (error) {
                console.error("Error fetching demo portfolio:", error);
            }
        }

        fetchDemoPortfolio();
    }, []);

    return (
        <div className="dashboard">
            <h1 className="text-2xl font-bold mb-4">Demo Portfolio</h1>
            {demoPortfolio ? (
                <div>
                    <Card className="p-4 mb-4">
                        <h2 className="text-xl font-semibold">Cash Balance</h2>
                        <p className="text-lg">${demoPortfolio.cashBalance.toFixed(2)}</p>
                    </Card>
                    <h2 className="text-xl font-semibold mb-2">Stocks</h2>
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Symbol</th>
                                <th className="border border-gray-300 px-4 py-2">Shares</th>
                                <th className="border border-gray-300 px-4 py-2">Buy Price</th>
                                <th className="border border-gray-300 px-4 py-2">Current Price</th>
                                <th className="border border-gray-300 px-4 py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {demoPortfolio.fakeTrades.map((stock) => (
                                <tr key={stock.id}>
                                    <td className="border border-gray-300 px-4 py-2">{stock.symbol}</td>
                                    <td className="border border-gray-300 px-4 py-2">{stock.shares}</td>
                                    <td className="border border-gray-300 px-4 py-2">${stock.buyPrice.toFixed(2)}</td>
                                    <td className="border border-gray-300 px-4 py-2">${stock.currentPrice.toFixed(2)}</td>
                                    <td className="border border-gray-300 px-4 py-2">{stock.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Loading demo portfolio...</p>
            )}
        </div>
    );
}