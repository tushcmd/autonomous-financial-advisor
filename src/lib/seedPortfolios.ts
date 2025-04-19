import { PrismaClient } from "@prisma/client";

// Demo stocks with share ranges (min-max)
const DEMO_STOCKS = [
  { symbol: "AAPL", shares: [3, 8] },
  { symbol: "MSFT", shares: [1, 4] },
  { symbol: "AMZN", shares: [2, 6] },
  { symbol: "GOOGL", shares: [2, 5] },
  { symbol: "META", shares: [1, 3] },
  { symbol: "TSLA", shares: [2, 8] },
  { symbol: "NVDA", shares: [1, 3] },
  { symbol: "JNJ", shares: [3, 10] },
];

// Default cash balances
const DEFAULT_DEMO_CASH = 10000.0; // $10,000 for demo
const DEFAULT_REAL_CASH = 0.0; // $0 for real (user will fund it)

// Default fallback prices if API fails
const FALLBACK_PRICES: Record<string, number> = {
  AAPL: 197.3,
  MSFT: 410.34,
  AMZN: 183.92,
  GOOGL: 165.78,
  META: 471.1,
  TSLA: 172.82,
  NVDA: 874.5,
  JNJ: 147.52,
};

// Function to get a random number of shares within a range
function getRandomShares(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Cache for storing daily stock prices
 * Structure: { symbol: { price: number, timestamp: Date } }
 */
interface PriceCache {
  [symbol: string]: {
    price: number;
    timestamp: Date;
  };
}

const stockPriceCache: PriceCache = {};

/**
 * Fetches real-time stock data from Alpha Vantage, with daily caching
 * @param symbol The stock symbol to fetch data for
 * @returns The current price (either from cache or freshly fetched)
 */
async function getDailyStockPrice(symbol: string): Promise<number> {
  // Check if we have a cached price that's still valid (less than 24 hours old)
  const cached = stockPriceCache[symbol];
  const now = new Date();

  if (
    cached &&
    now.getTime() - cached.timestamp.getTime() < 24 * 60 * 60 * 1000
  ) {
    console.log(`Using cached price for ${symbol}: $${cached.price}`);
    return cached.price;
  }

  // If no valid cache, try to fetch from API
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    if (!apiKey) {
      console.warn("Alpha Vantage API key not found in environment variables");
      throw new Error("No API key");
    }

    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`,
    );

    const data = await response.json();

    // Check if we have valid data
    if (data["Time Series (5min)"]) {
      // Get the most recent timestamp
      const latestTimestamp = Object.keys(data["Time Series (5min)"])[0];
      // Get the closing price from the most recent data point
      const closePrice = parseFloat(
        data["Time Series (5min)"][latestTimestamp]["4. close"],
      );

      // Cache the result
      stockPriceCache[symbol] = {
        price: closePrice,
        timestamp: now,
      };

      console.log(`Fetched and cached new price for ${symbol}: $${closePrice}`);
      return closePrice;
    }

    throw new Error("Invalid API response format");
  } catch {
    console.warn(
      `Could not fetch price for ${symbol}, using fallback price: $${FALLBACK_PRICES[symbol] || 100}`,
    );

    // Use fallback price if API fails
    const fallbackPrice = FALLBACK_PRICES[symbol] || 100;

    // Cache even the fallback to avoid repeated failed API calls
    stockPriceCache[symbol] = {
      price: fallbackPrice,
      timestamp: now,
    };

    return fallbackPrice;
  }
}

/**
 * Seeds both a demo portfolio with fake trades using daily-updated prices and an empty real portfolio for a user
 * @param userId The ID of the user to create portfolios for
 * @param prisma The Prisma client instance (optional - will create one if not provided)
 */
export async function seedPortfolios(
  userId: string,
  prismaClient?: PrismaClient,
): Promise<void> {
  const prisma = prismaClient || new PrismaClient();

  try {
    // Check if the user already has any portfolios
    const existingPortfolios = await prisma.portfolio.findMany({
      where: { userId },
    });

    // If they already have portfolios, don't create new ones
    if (existingPortfolios.length > 0) {
      console.log(`User ${userId} already has portfolios. Skipping seeding.`);
      return;
    }

    // Create a demo portfolio with default cash balance
    const demoPortfolio = await prisma.portfolio.create({
      data: {
        userId,
        name: "Demo Portfolio",
        type: "DEMO",
        longTermGoal: "Long-term growth with diversified investments",
        cashBalance: DEFAULT_DEMO_CASH,
        autoTrading: false,
      },
    });

    // Fetch prices and create trades for each stock
    const tradePromises = DEMO_STOCKS.map(async (stock) => {
      // Get daily-cached price
      const currentPrice = await getDailyStockPrice(stock.symbol);

      // Generate a buy price with slight variation (as if bought in the past)
      const buyPrice = currentPrice * (0.9 + Math.random() * 0.2); // ±10% from current

      // Generate a random number of shares within the specified range
      const shares = getRandomShares(stock.shares[0], stock.shares[1]);

      // Calculate a random buy date within the last 30 days
      const buyDate = new Date(
        Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
      );

      // Create the fake trade
      return prisma.fakeTrade.create({
        data: {
          portfolioId: demoPortfolio.id,
          symbol: stock.symbol,
          shares,
          buyPrice,
          currentPrice,
          status: "open",
          buyDate,
        },
      });
    });

    // Execute all trade creation promises
    await Promise.all(tradePromises);

    // Create an empty real portfolio with default cash balance
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const realPortfolio = await prisma.portfolio.create({
      data: {
        userId,
        name: "My Portfolio",
        type: "REAL",
        cashBalance: DEFAULT_REAL_CASH,
        autoTrading: false,
      },
    });

    console.log(`Created demo and real portfolios for user ${userId}`);
  } catch (error) {
    console.error(`Error seeding portfolios for user ${userId}:`, error);
    throw error;
  } finally {
    // Only disconnect if we created a new client
    if (!prismaClient) {
      await prisma.$disconnect();
    }
  }
}

/**
 * Updates current prices for all demo portfolio holdings
 * This function can be called daily by a cron job
 */
export async function updateAllDemoPrices(
  prismaClient?: PrismaClient,
): Promise<void> {
  const prisma = prismaClient || new PrismaClient();

  try {
    // Get all unique symbols from fake trades
    const uniqueSymbolsResult = await prisma.fakeTrade.findMany({
      select: {
        symbol: true,
      },
      distinct: ["symbol"],
    });

    const uniqueSymbols = uniqueSymbolsResult.map((item) => item.symbol);

    // Fetch updated prices for each symbol
    for (const symbol of uniqueSymbols) {
      const currentPrice = await getDailyStockPrice(symbol);

      // Update all fake trades with this symbol
      await prisma.fakeTrade.updateMany({
        where: { symbol },
        data: { currentPrice },
      });

      console.log(`Updated price for ${symbol} to $${currentPrice}`);
    }

    console.log(`Updated prices for ${uniqueSymbols.length} stocks`);
  } catch (error) {
    console.error("Error updating demo prices:", error);
    throw error;
  } finally {
    // Only disconnect if we created a new client
    if (!prismaClient) {
      await prisma.$disconnect();
    }
  }
}
