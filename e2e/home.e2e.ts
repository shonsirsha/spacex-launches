import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page, baseURL }) => {
	await page.goto(baseURL);
});

test.describe("Renders header elements on the page correctly", () => {
	test("If page correctly renders header text", async ({ page }) => {
		const headerText = await page.locator("h1");
		await expect(headerText).toContainText("SpaceX Launches");
	});
	test("If page correctly renders sub-header (h2) text", async ({ page }) => {
		const headerText = await page.locator("h2");
		await expect(headerText).toContainText("Upcoming Launches");
	});
});

test.describe("Renders Upcoming Launches Cards", () => {
	test("If cards are rendered", async ({ page }) => {
		await page.waitForSelector(".card", { state: "attached" });
		const cards = (await page.$$(".card")).length;
		expect(cards).toBeGreaterThanOrEqual(1);
	});
});

test.describe("Link & anchor elements behaviours", () => {
	//Internal Link
	test("If clicking 'See All Launches' link will redirect to /past-launches", async ({
		page,
		baseURL,
	}) => {
		const anchorElement = await page.locator(
			"a:has-text('See all past launches')"
		);
		await anchorElement.click();
		expect(page.url()).toBe(`${baseURL}/past-launches`);
	});

	//External Link
	test("If clicking 'Go to SpaceX Website' link will redirect to https://www.spacex.com/", async ({
		page,
	}) => {
		const anchorElement = await page.locator(
			"a:has-text('Go to SpaceX Website')"
		);
		await anchorElement.click();
		expect(page.url()).toBe(`https://www.spacex.com/`);
	});
});
