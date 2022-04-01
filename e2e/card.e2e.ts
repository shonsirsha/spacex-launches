import { test, expect } from "@playwright/test";

const ACTIVE_COLOR = "rgb(0, 112, 243)";
const SUCCESSFUL_LAUNCH_COLOR = "rgb(62, 225, 62)";
const FAILED_LAUNCH_COLOR = "rgb(255, 0, 0)";
test.beforeEach(async ({ page, baseURL }) => {
	await page.goto(`${baseURL}/past-launches`);
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
		const card = page.locator(".card").nth(0);
		const color = await card.evaluate((element) =>
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
