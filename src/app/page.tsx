'use client'

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Search, DollarSign, TrendingUp } from 'lucide-react';
import { PortfolioAdvice } from '@/components/get-advice';

export default function Home() {
  const [ticker, setTicker] = useState('');
  const [data, setData] = useState<{ symbol?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const fetchStock = async () => {
    if (!ticker) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/stock?ticker=${ticker}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Fixed header with shadow */}
      <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <Header />
      </div>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <DollarSign className="mr-2" />
          Autonomous Financial Advisor
        </h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Stock Information
            </CardTitle>
            <CardDescription>Enter a stock symbol to fetch current price information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative w-full sm:max-w-xs">
                <Input
                  placeholder="Enter Stock Symbol (e.g., AAPL)"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  className="pl-8"
                />
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                onClick={fetchStock}
                disabled={isLoading || !ticker}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Fetch Price'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {data && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                {data.symbol || ticker.toUpperCase()} Stock Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-50 dark:bg-slate-800 p-4 rounded overflow-auto text-sm border border-slate-200 dark:border-slate-700">
                {JSON.stringify(data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Portfolio Advice Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Personalized Portfolio Advice</CardTitle>
            <CardDescription>Get AI-powered advice based on your portfolio and goals.</CardDescription>
          </CardHeader>
          <CardContent>
            {userId ? (
              <PortfolioAdvice userId={userId} onAdvice={setAdvice} />
            ) : (
              <div className="text-sm text-muted-foreground">Please sign in to get personalized advice.</div>
            )}
            {advice && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                <strong>Advice:</strong>
                <div className="whitespace-pre-line mt-2">{advice}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
