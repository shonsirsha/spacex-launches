import { test, expect } from "@playwright/test";
const SEARCH_TERM_WITH_MULTIPLE_RESULT = "Falcon";
const SEARCH_TERM_WITH_SINGLE_RESULT = "DemoSat";

test.beforeEach(async ({ page, baseURL }) => {
	await page.goto(`${baseURL}/past-launches`);
});

const ACTIVE_COLOR = "rgb(0, 112, 243)";
const SUCCESSFUL_LAUNCH_COLOR = "rgb(62, 225, 62)";
const FAILED_LAUNCH_COLOR = "rgb(255, 0, 0)";

test.describe("Renders header elements on the page correctly", () => {
	test("If page correctly renders sub-header (h2) text", async ({ page }) => {
		const headerText = await page.locator("h2");
		await expect(headerText).toContainText("Past Launches");
	});
});

test.describe("Link & anchor elements behaviours", () => {
	//Internal Link
	test("If clicking '< Go back home' link will redirect to /", async ({
		page,
		baseURL,
	}) => {
		const anchorElement = await page.locator("a:has-text('< Go back home')");
		await anchorElement.click();
		expect(page.url()).toBe(`${baseURL}/`);
	});
});

test.describe("Searching, displaying/rendering, and sorting launches", () => {
	let button;
	test.beforeEach(async ({ page }) => {
		button = page.locator("button:has-text('Toggle Sort')");
		await page.waitForSelector(".card", { state: "attached" });
	});
	test(`If clicking "Toggle Sort" button will properly toggle the info text`, async ({
		page,
	}) => {
		await button.click();
		const infoTextAfterToggle = await page.locator(
			"#num-of-launches-display-paragraph"
		);

		await expect(infoTextAfterToggle).toContainText("Newest to Oldest");
	});
	test(`If clicking "Toggle Sort" button will properly toggle the sorting of launch cards and info text`, async ({
		page,
	}) => {
		const firstLaunchBeforeToggle = await page
			.locator(".card .launchName")
			.nth(0)
			.textContent();

		await button.click();

		const lastLaunchAfterToggle = await page
			.locator(".card .launchName")
			.nth(-1)
			.textContent();

		expect(firstLaunchBeforeToggle).toEqual(lastLaunchAfterToggle);
	});
	test(`If searching for ${SEARCH_TERM_WITH_MULTIPLE_RESULT} will render appropriate number of cards`, async ({
		page,
	}) => {
		//Fill a form/input field through its label.
		//Its label is a label with this text: "Search by Flight Number or Name"

		//Searching for elements by the label has the additional benefit of ensuring that
		//your labels are appropriately associated with form inputs.

		//Having label associations is essential for accessibility,
		//helping remove barriers for people with disabilities.
		await page.fill(
			"text=Search by Flight Number or Name",
			SEARCH_TERM_WITH_MULTIPLE_RESULT
		);

		const cards = (await page.$$(".card")).length;
		expect(cards).toBeGreaterThanOrEqual(3);
	});
	test(`If searching for ${SEARCH_TERM_WITH_SINGLE_RESULT} will render appropriate info text`, async ({
		page,
	}) => {
		const infoText = await page.locator("#num-of-launches-display-paragraph");
		await page.fill(
			"text=Search by Flight Number or Name",
			SEARCH_TERM_WITH_SINGLE_RESULT
		);

		await expect(infoText).toContainText("Displaying 1 launches");
	});
});

test.describe("Card rendering", () => {
	test.beforeEach(async ({ page }) => {
		await page.waitForSelector(".card", { state: "attached" });
	});
	test(`Launch / flight name rendered`, async ({ page }) => {
		expect(page.locator(".card p.launchName").nth(0)).toBeTruthy();
	});
	test(`Launch / flight date rendered`, async ({ page }) => {
		expect(page.locator(".card p.date").nth(0)).toBeTruthy();
	});
	test(`Launch / flight number rendered`, async ({ page }) => {
		expect(page.locator(".card kbd:has-text(Flight Num:)").nth(0)).toBeTruthy();
	});

	test(`Failed launch card to have proper colour`, async ({ page }) => {
		const failedLaunchCard = page.locator(".card div.status.failed").nth(0);
		const color = await failedLaunchCard.evaluate((element) =>
			window.getComputedStyle(element).getPropertyValue("background-color")
		);
		expect(color).toBe(FAILED_LAUNCH_COLOR); // red
	});
	test(`Successful launch card to have proper colour`, async ({ page }) => {
		const successfulLaunchCard = page
			.locator(".card div.status.success")
			.nth(0);
		const color = await successfulLaunchCard.evaluate((element) =>
			window.getComputedStyle(element).getPropertyValue("background-color")
		);
		expect(color).toBe(SUCCESSFUL_LAUNCH_COLOR); // green
	});
	test(`Any launch card to have proper border colour when hovered`, async ({
		page,
	}) => {
		page.locator(".card").nth(0).hover();
		await delay(650); // wait for hover transition to be completed
		const successfulLaunchCard = page.locator(".card").nth(0);
		const color = await successfulLaunchCard.evaluate((element) =>
			window.getComputedStyle(element).getPropertyValue("border-bottom-color")
		);
		expect(color).toBe(ACTIVE_COLOR); // blue
	});
});

function delay(time) {
	return new Promise(function (resolve) {
		setTimeout(resolve, time);
	});
}
