export const investmentGoals = [
  "RETIREMENT",
  "GROWTH",
  "INCOME",
  "PRESERVATION",
  "SPECULATION",
  "OTHER",
] as const;

export type InvestmentGoal = (typeof investmentGoals)[number];
