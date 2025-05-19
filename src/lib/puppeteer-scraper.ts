// Main thing I need in this file is extract p tags (news)
import puppeteer, { Browser, Page } from "puppeteer";

class PuppeteerScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  /**
   * Initialize the browser
   */
  async initialize(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true, // Enable headless mode
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }
  }

  /**
   * Create a new page
   */
  async newPage(): Promise<Page> {
    await this.initialize();
    if (!this.browser) {
      throw new Error("Browser not initialized");
    }
    this.page = await this.browser.newPage();

    // Set viewport size to mimic a desktop browser
    await this.page.setViewport({ width: 1366, height: 768 });

    // Set user agent to avoid detection
    await this.page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    );

    return this.page;
  }

  /**
   * Navigate to a URL
   */
  async goTo(url: string): Promise<void> {
    if (!this.page) {
      this.page = await this.newPage();
    }
    await this.page.goto(url, { waitUntil: "networkidle2", timeout: 60000 }); // 60s timeout
  }

  /**
   * Scrape data from the current page using a selector
   */
  async scrapeData<T>(
    evaluateFunction: (page: Page) => Promise<T>,
  ): Promise<T> {
    if (!this.page) {
      throw new Error("Page not initialized");
    }
    return await evaluateFunction(this.page);
  }

  /**
   * Take a screenshot of the current page
   */
  async takeScreenshot(path: string): Promise<void> {
    if (!this.page) {
      throw new Error("Page not initialized");
    }
    await this.page.screenshot({ path });
  }

  /**
   * Extract all links from the current page
   */
  async extractLinks(): Promise<string[]> {
    if (!this.page) {
      throw new Error("Page not initialized");
    }

    return await this.page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a"));
      return links
        .map((link) => link.href)
        .filter((href) => href && href.startsWith("http"));
    });
  }

  /**
   * Extract all headings (h1-h6) text content as an array
   */
  async extractAllHeadings(): Promise<string[]> {
    if (!this.page) {
      throw new Error("Page not initialized");
    }
    await this.page
      .waitForSelector("h1,h2,h3,h4,h5,h6", { timeout: 5000 })
      .catch(() => {
        console.warn("No headings found on page");
      });
    return await this.page.evaluate(() => {
      const headings = Array.from(
        document.querySelectorAll("h1,h2,h3,h4,h5,h6"),
      );
      return headings.map((h) => h.textContent?.trim() || "");
    });
  }

  /**
   * Extract all paragraphs (<p> tags) text content as an array
   */
  async extractAllParagraphs(): Promise<string[]> {
    if (!this.page) {
      throw new Error("Page not initialized");
    }
    await this.page.waitForSelector("p", { timeout: 5000 }).catch(() => {
      console.warn("No <p> tags found on page");
    });
    return await this.page.evaluate(() => {
      const paragraphs = Array.from(document.querySelectorAll("p"));
      return paragraphs.map((p) => p.textContent?.trim() || "");
    });
  }

  /**
   * Extract the <title> tag text content
   */
  async extractTitle(): Promise<string> {
    if (!this.page) {
      throw new Error("Page not initialized");
    }
    await this.page.waitForSelector("title", { timeout: 5000 }).catch(() => {
      console.warn("No <title> tag found on page");
    });
    return await this.page.title();
  }

  /**
   * Extract text content based on a CSS selector
   */
  async extractText(selector: string): Promise<string> {
    if (!this.page) {
      throw new Error("Page not initialized");
    }

    await this.page.waitForSelector(selector, { timeout: 5000 }).catch(() => {
      console.warn(`Selector "${selector}" not found on page`);
    });

    return await this.page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.textContent?.trim() || "" : "";
    }, selector);
  }

  /**
   * Extract multiple elements based on a CSS selector
   */
  async extractElements(selector: string): Promise<string[]> {
    if (!this.page) {
      throw new Error("Page not initialized");
    }

    await this.page.waitForSelector(selector, { timeout: 5000 }).catch(() => {
      console.warn(`Selector "${selector}" not found on page`);
    });

    return await this.page.evaluate((sel) => {
      const elements = Array.from(document.querySelectorAll(sel));
      return elements.map((el) => el.textContent?.trim() || "");
    }, selector);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    if (!this.page) {
      throw new Error("Page not initialized");
    }
    await this.page.waitForNavigation({
      waitUntil: "networkidle2",
      // timeout: 60000,
      timeout: 120000,
    }); // 60s timeout
  }

  /**
   * Click an element and wait for navigation
   */
  async clickAndWait(selector: string): Promise<void> {
    if (!this.page) {
      throw new Error("Page not initialized");
    }

    await this.page.waitForSelector(selector, { visible: true });

    // Promise.all to handle both the click and the navigation
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: "networkidle2" }),
      this.page.click(selector),
    ]);
  }

  /**
   * Scrape multiple URLs and extract all <p> tag contents from each
   * @param urls Array of URLs to scrape
   * @returns Array of objects: { url, paragraphs: string[] }
   */
  async scrapeMultipleUrls(
    urls: string[],
  ): Promise<{ url: string; paragraphs: string[] }[]> {
    const results: { url: string; paragraphs: string[] }[] = [];
    for (const url of urls) {
      try {
        await this.goTo(url);
        const paragraphs = await this.extractAllParagraphs();
        results.push({ url, paragraphs });
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error);
        results.push({ url, paragraphs: [] });
      }
    }
    return results;
  }

  /**
   * Close the browser
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

// Export a singleton instance
export const scraper = new PuppeteerScraper();

// Also export the class for testing or custom instances
export default PuppeteerScraper;
