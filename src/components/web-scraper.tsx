/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    // CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

// Define form schema
const scrapeFormSchema = z.object({
    url: z.string().url({ message: 'Please enter a valid URL' }),
    selectors: z.string().optional(),
});

type ScrapeFormValues = z.infer<typeof scrapeFormSchema>;

export default function WebScraper() {
    const [results, setResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize form
    const form = useForm<ScrapeFormValues>({
        resolver: zodResolver(scrapeFormSchema),
        defaultValues: {
            url: '',
            selectors: '[\n  { "name": "title", "selector": "title", "type": "text" },\n  { "name": "headings", "selector": "h1, h2", "type": "elements" }\n]',
        },
    });

    const onSubmit = async (values: ScrapeFormValues) => {
        setIsLoading(true);
        setError(null);
        setResults(null);

        try {
            let parsedSelectors;
            try {
                parsedSelectors = values.selectors ? JSON.parse(values.selectors) : null;
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                setError('Invalid JSON format for selectors');
                setIsLoading(false);
                return;
            }

            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: values.url,
                    selectors: parsedSelectors,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to scrape the website');
            }

            setResults(data.data);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-6">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Web Scraper</CardTitle>
                    <CardDescription>
                        Enter a URL and selectors to scrape data from websites
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            The URL of the website you want to scrape
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />



                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Scraping...
                                    </>
                                ) : (
                                    'Scrape Website'
                                )}
                            </Button>
                        </form>
                    </Form>

                    {error && (
                        <Alert variant="destructive" className="mt-6">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {results && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium">Results:</h3>
                            <pre className="mt-2 bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-auto max-h-96">
                                {JSON.stringify(results, null, 2)}
                            </pre>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}