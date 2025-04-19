-- CreateEnum
CREATE TYPE "PortfolioType" AS ENUM ('DEMO', 'REAL');

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Portfolio',
    "type" "PortfolioType" NOT NULL DEFAULT 'DEMO',
    "broker" TEXT,
    "accountId" TEXT,
    "longTermGoal" TEXT,
    "aiSummary" TEXT,
    "autoTrading" BOOLEAN NOT NULL DEFAULT false,
    "cashBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FakeTrade" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "shares" DOUBLE PRECISION NOT NULL,
    "buyPrice" DOUBLE PRECISION NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "buyDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'open',

    CONSTRAINT "FakeTrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RealHolding" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "shares" DOUBLE PRECISION NOT NULL,
    "avgPrice" DOUBLE PRECISION NOT NULL,
    "currentPrice" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RealHolding_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FakeTrade" ADD CONSTRAINT "FakeTrade_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RealHolding" ADD CONSTRAINT "RealHolding_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
