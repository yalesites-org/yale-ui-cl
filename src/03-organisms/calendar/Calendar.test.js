import { describe, expect, it } from "vitest";
import "./Calendar.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const $ = (cal, selector) => shadowOf(cal).querySelector(selector);
const $$ = (cal, selector) => [...shadowOf(cal).querySelectorAll(selector)];
const day = (cal, date) => $(cal, `[data-date="${date}"]`);
const monthLabel = (cal) => $(cal, ".calendar__month").textContent.trim();
const listedTitles = (cal) => $$(cal, ".calendar__event-title").map((el) => el.textContent.trim());
const key = (target, name) => target.dispatchEvent(new KeyboardEvent("keydown", { key: name, bubbles: true, composed: true }));

const markup = `
	<ycl-calendar today="2026-11-12">
		<ycl-calendar-event start="2026-11-03T10:00" end="2026-11-03T11:00" location="Sterling Library">Past talk</ycl-calendar-event>
		<ycl-calendar-event start="2026-11-12T16:00" end="2026-11-12T17:30" href="/events/lecture" location="Kroon Hall">Today's lecture</ycl-calendar-event>
		<ycl-calendar-event start="2026-11-12T19:00">Evening concert</ycl-calendar-event>
		<ycl-calendar-event start="2026-11-20" end="2026-11-22">Weekend conference</ycl-calendar-event>
		<ycl-calendar-event start="2026-12-04T12:00">December lunch</ycl-calendar-event>
	</ycl-calendar>`;

describe("ycl-calendar", () => {
	it("shows the month containing today, with a button per day", () => {
		const cal = mount(markup);
		expect(monthLabel(cal)).toBe("November 2026");
		expect($$(cal, ".calendar__day")).toHaveLength(30);
		expect($$(cal, "thead th").map((th) => th.textContent.trim())).toEqual(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]);
		// November 1, 2026 is a Sunday.
		expect($(cal, "tbody tr td:first-child [data-date]").dataset.date).toBe("2026-11-01");
	});

	it("starts on the month attribute when given", () => {
		const cal = mount(markup.replace(`today="2026-11-12"`, `today="2026-11-12" month="2026-12"`));
		expect(monthLabel(cal)).toBe("December 2026");
		expect(listedTitles(cal)).toEqual(["December lunch"]);
	});

	it("marks today and days with events, without relying on color", () => {
		const cal = mount(markup);
		const today = day(cal, "2026-11-12");
		expect(today.getAttribute("aria-current")).toBe("date");
		expect(today.getAttribute("aria-label")).toBe("Thursday, November 12, 2026, today, 2 events");
		expect(today.querySelectorAll(".calendar__dot")).toHaveLength(2);
		expect(day(cal, "2026-11-21").getAttribute("aria-label")).toBe("Saturday, November 21, 2026, 1 event");
		expect(day(cal, "2026-11-13").getAttribute("aria-label")).toBe("Friday, November 13, 2026");
		expect(day(cal, "2026-11-13").classList.contains("calendar__day--events")).toBe(false);
	});

	it("shows three dots then a plus on busy days", () => {
		const events = Array.from({ length: 5 }, (_, i) => `<ycl-calendar-event start="2026-11-05T0${i + 1}:00">E${i}</ycl-calendar-event>`).join("");
		const cal = mount(`<ycl-calendar today="2026-11-01">${events}</ycl-calendar>`);
		expect(day(cal, "2026-11-05").querySelectorAll(".calendar__dot")).toHaveLength(3);
		expect(day(cal, "2026-11-05").querySelector(".calendar__more").textContent).toBe("+");
	});

	it("selects today on load and lists today's and later events in the month", () => {
		const cal = mount(markup);
		expect(day(cal, "2026-11-12").getAttribute("aria-pressed")).toBe("true");
		expect(listedTitles(cal)).toEqual(["Today's lecture", "Evening concert", "Weekend conference"]);
	});

	it("renders event details from the page", () => {
		const cal = mount(markup);
		const lecture = $$(cal, ".calendar__event")[0];
		expect(lecture.querySelector("a").getAttribute("href")).toBe("/events/lecture");
		expect(lecture.querySelector(".calendar__event-meta").textContent).toContain("4:00 pm");
		expect(lecture.querySelector(".calendar__event-location").textContent).toBe("Kroon Hall");
	});

	it("lists from a clicked day onward, and shows past events as past", () => {
		const cal = mount(markup);
		day(cal, "2026-11-03").click();
		expect(day(cal, "2026-11-03").getAttribute("aria-pressed")).toBe("true");
		expect(day(cal, "2026-11-12").getAttribute("aria-pressed")).toBe("false");
		expect(listedTitles(cal)[0]).toBe("Past talk");
		const past = $$(cal, ".calendar__event")[0];
		expect(past.classList.contains("calendar__event--past")).toBe(true);
		expect(past.textContent).toContain("Past event");
	});

	it("labels later days of a multi-day event", () => {
		const cal = mount(markup);
		day(cal, "2026-11-21").click();
		expect(listedTitles(cal)).toEqual(["Weekend conference"]);
		expect($(cal, ".calendar__event").textContent).toContain("Day 2 of 3");
	});

	it("moves between months with the previous and next buttons", () => {
		const cal = mount(markup);
		const next = $(cal, ".calendar__nav--next");
		expect(next.getAttribute("aria-label")).toBe("Next month");
		next.click();
		expect(monthLabel(cal)).toBe("December 2026");
		expect(listedTitles(cal)).toEqual(["December lunch"]);
		$(cal, ".calendar__nav--prev").click();
		$(cal, ".calendar__nav--prev").click();
		expect(monthLabel(cal)).toBe("October 2026");
		expect($(cal, ".calendar__empty").textContent).toContain("No events");
	});

	it("announces the month to screen readers", () => {
		const cal = mount(markup);
		expect($(cal, ".calendar__month").getAttribute("aria-live")).toBe("polite");
		expect($(cal, "table").getAttribute("aria-labelledby")).toBe($(cal, ".calendar__month").id);
	});

	it("keeps one day in the tab order", () => {
		const cal = mount(markup);
		expect($$(cal, ".calendar__day").filter((b) => b.tabIndex === 0).map((b) => b.dataset.date)).toEqual(["2026-11-12"]);
	});

	it.each([
		["ArrowRight", "2026-11-13"],
		["ArrowLeft", "2026-11-11"],
		["ArrowDown", "2026-11-19"],
		["ArrowUp", "2026-11-05"],
		["Home", "2026-11-08"],
		["End", "2026-11-14"],
		["PageDown", "2026-12-12"],
		["PageUp", "2026-10-12"],
	])("%s moves focus to %s", (name, expected) => {
		const cal = mount(markup);
		day(cal, "2026-11-12").focus();
		key(day(cal, "2026-11-12"), name);
		expect(shadowOf(cal).activeElement?.dataset.date).toBe(expected);
		expect(day(cal, expected).tabIndex).toBe(0);
	});

	it("crosses into the next month with the arrow keys", () => {
		const cal = mount(markup);
		day(cal, "2026-11-30").focus();
		key(day(cal, "2026-11-30"), "ArrowRight");
		expect(monthLabel(cal)).toBe("December 2026");
		expect(shadowOf(cal).activeElement?.dataset.date).toBe("2026-12-01");
	});

	it("jumps back to today", () => {
		const cal = mount(markup);
		$(cal, ".calendar__nav--next").click();
		$(cal, ".calendar__today").click();
		expect(monthLabel(cal)).toBe("November 2026");
		expect(day(cal, "2026-11-12").getAttribute("aria-pressed")).toBe("true");
		expect(shadowOf(cal).activeElement?.dataset.date).toBe("2026-11-12");
	});

	it("keeps focus on a day selected from the keyboard", () => {
		const cal = mount(markup);
		day(cal, "2026-11-03").focus();
		day(cal, "2026-11-03").click();
		expect(shadowOf(cal).activeElement?.dataset.date).toBe("2026-11-03");
	});

	it("only rewrites the live month label when the month changes", () => {
		const cal = mount(markup);
		const text = $(cal, ".calendar__month").firstChild;
		day(cal, "2026-11-03").click();
		expect($(cal, ".calendar__month").firstChild).toBe(text);
	});

	it("treats an event ending at midnight as one day", () => {
		const cal = mount(`<ycl-calendar today="2026-11-01"><ycl-calendar-event start="2026-11-12T20:00" end="2026-11-13T00:00">Late show</ycl-calendar-event></ycl-calendar>`);
		expect(day(cal, "2026-11-13").querySelectorAll(".calendar__dot")).toHaveLength(0);
		expect($(cal, ".calendar__event-meta").textContent).toBe("8:00 pm to 12:00 am");
	});

	it("keeps the shown month when moved in the page", () => {
		const cal = mount(markup);
		$(cal, ".calendar__nav--next").click();
		document.body.prepend(cal);
		expect(monthLabel(cal)).toBe("December 2026");
	});

	it("updates when events change", async () => {
		const cal = mount(markup);
		const added = document.createElement("ycl-calendar-event");
		added.setAttribute("start", "2026-11-25T09:00");
		added.textContent = "Added later";
		cal.append(added);
		cal.querySelector("ycl-calendar-event").textContent = "Renamed";
		await settle();
		expect(listedTitles(cal)).toContain("Added later");
		expect(day(cal, "2026-11-25").querySelectorAll(".calendar__dot")).toHaveLength(1);
	});

	it("ignores out-of-range dates instead of rolling them over", () => {
		const cal = mount(`<ycl-calendar today="2026-02-10" month="2026-13"><ycl-calendar-event start="2026-02-31">Bad</ycl-calendar-event></ycl-calendar>`);
		expect(monthLabel(cal)).toBe("February 2026");
		$(cal, ".calendar__nav--next").click();
		expect(listedTitles(cal)).toEqual([]);
	});

	it("treats a today with a time as the whole day", () => {
		const cal = mount(markup.replace(`today="2026-11-12"`, `today="2026-11-12T18:00"`));
		expect(day(cal, "2026-11-12").getAttribute("aria-current")).toBe("date");
		expect($$(cal, ".calendar__event--past")).toHaveLength(0);
	});

	it("ignores events with an unreadable start", () => {
		const cal = mount(`<ycl-calendar today="2026-11-12"><ycl-calendar-event start="soon">Bad</ycl-calendar-event></ycl-calendar>`);
		expect(listedTitles(cal)).toEqual([]);
	});
});
