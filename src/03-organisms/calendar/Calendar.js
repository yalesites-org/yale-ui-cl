import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./calendar.css?inline";
import { iconSvg } from "../../01-atoms/icons/icons.js";

// Rotated in CSS to point sideways.
const angleIcon = iconSvg("angle-down");
const DEFAULT_LABEL = "Event calendar";

const calendarTemplate = document.createElement("template");
calendarTemplate.innerHTML = `
	<section class="calendar" aria-label="${DEFAULT_LABEL}">
		<div class="calendar__picker">
			<div class="calendar__header">
				<button type="button" class="calendar__nav calendar__nav--prev" aria-label="Previous month">${angleIcon}</button>
				<p class="calendar__month" id="calendar-month"></p>
				<button type="button" class="calendar__nav calendar__nav--next" aria-label="Next month">${angleIcon}</button>
			</div>
			<table class="calendar__grid" aria-labelledby="calendar-month">
				<thead><tr></tr></thead>
				<tbody></tbody>
			</table>
			<div class="calendar__footer">
				<span class="calendar__legend"><span class="calendar__dot" aria-hidden="true"></span> Has events</span>
				<button type="button" class="calendar__today">Jump to today</button>
			</div>
		</div>
		<div class="calendar__list"></div>
	</section>
`;

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MAX_DOTS = 3;
const DAY_MS = 86400000;

const pad = (n) => String(n).padStart(2, "0");
// Dates are handled as local midnights and keyed as YYYY-MM-DD.
const keyOf = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const addDays = (date, n) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + n);
const daysBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / DAY_MS);
const sameMonth = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

// Moves by whole months, keeping the day number where the target month has it (Jan 31 -> Feb 28).
function addMonths(date, n) {
	const first = new Date(date.getFullYear(), date.getMonth() + n, 1);
	return new Date(first.getFullYear(), first.getMonth(), Math.min(date.getDate(), endOfMonth(first).getDate()));
}

// A bare date ("2026-11-12") is an all-day local date; anything else goes to the Date parser
// (so "2026-11-12T16:00" is local time). Returns null when it can't be read.
function parseDate(value) {
	if (!value) return null;
	const bare = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
	if (bare) {
		const date = new Date(Number(bare[1]), Number(bare[2]) - 1, Number(bare[3]));
		// Out-of-range parts ("2026-02-31") would roll into another date, so they don't read.
		return keyOf(date) === bare[0] ? { date, allDay: true } : null;
	}
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : { date, allDay: false };
}

// The day each grid key moves focus to.
const KEY_MOVES = {
	ArrowLeft: (from) => addDays(from, -1),
	ArrowRight: (from) => addDays(from, 1),
	ArrowUp: (from) => addDays(from, -7),
	ArrowDown: (from) => addDays(from, 7),
	Home: (from) => addDays(from, -from.getDay()),
	End: (from) => addDays(from, 6 - from.getDay()),
	PageUp: (from) => addMonths(from, -1),
	PageDown: (from) => addMonths(from, 1),
};

function parseMonth(value) {
	return parseDate(value && `${value.trim()}-01`)?.date ?? null;
}

// Builds an element with an optional class and text.
function el(tag, className, text) {
	const node = document.createElement(tag);
	if (className) node.className = className;
	if (text !== undefined) node.textContent = text;
	return node;
}

const monthFormat = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const dayFormat = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
const timeFormat = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const badgeMonthFormat = new Intl.DateTimeFormat("en-US", { month: "short" });
const formatTime = (date) => timeFormat.format(date).replace(/\s?(AM|PM)$/, (_, p) => ` ${p.toLowerCase()}`);

/**
 * One event shown by a ycl-calendar. Renders nothing itself.
 * @attr {string} start - Start, as an ISO 8601 date ("2026-11-12", all day) or local date-time ("2026-11-12T16:00").
 * @attr {string} end - Optional end, in the same form. A later date makes a multi-day event.
 * @attr {string} href - Optional link to the event's page.
 * @attr {string} location - Optional place.
 * @slot - The event title, as plain text.
 */
export class CalendarEvent extends HTMLElement {
	// Only carries data for ycl-calendar, which renders it, so it has no shadow root.
	static dataOnly = true;

	// Static, so ycl-calendar can read children that the parser hasn't upgraded yet.
	// Returns null when the start can't be read.
	static read(element) {
		const start = parseDate(element.getAttribute("start"));
		if (!start) return null;
		const parsedEnd = parseDate(element.getAttribute("end"));
		const end = parsedEnd && parsedEnd.date >= start.date ? parsedEnd : null;
		// A timed end at midnight finishes the day before (20:00 to 00:00 is one evening).
		let lastMoment = start.date;
		if (end) lastMoment = !end.allDay && end.date > start.date ? new Date(end.date - 1) : end.date;
		return {
			title: element.textContent.trim(),
			href: element.getAttribute("href"),
			location: element.getAttribute("location"),
			start: start.date,
			end: end?.date ?? null,
			allDay: start.allDay,
			firstDay: startOfDay(start.date),
			lastDay: startOfDay(lastMoment),
		};
	}
}

/**
 * A compact month calendar beside a list of the month's events. Children are ycl-calendar-event elements.
 * Today is selected on load and the list runs from the selected day to the end of the month.
 * @attr {string} month - Month to show first, as YYYY-MM. Defaults to the month of today.
 * @attr {string} today - Overrides today's date, as YYYY-MM-DD (for demos and tests).
 * @attr {string} label - Accessible name of the calendar. Defaults to "Event calendar".
 */
export class Calendar extends HTMLElement {
	#shadow;
	#observer;
	#section;
	#monthLabel;
	#body;
	#list;
	#events = [];
	#month; // first of the displayed month
	#selected = null; // selected day, or null to list the whole month
	#focus; // the day in the tab order

	static get observedAttributes() {
		return ["month", "today", "label"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "calendar")];
		this.#shadow.appendChild(document.importNode(calendarTemplate.content, true));
		this.#section = this.#shadow.querySelector(".calendar");
		this.#monthLabel = this.#shadow.querySelector(".calendar__month");
		this.#body = this.#shadow.querySelector("tbody");
		this.#list = this.#shadow.querySelector(".calendar__list");

		const headRow = this.#shadow.querySelector("thead tr");
		for (const name of WEEKDAYS) {
			const th = el("th", "", name.slice(0, 2));
			th.scope = "col";
			th.abbr = name;
			headRow.append(th);
		}

		this.#shadow.querySelector(".calendar__nav--prev").addEventListener("click", () => this.#showMonth(addMonths(this.#month, -1)));
		this.#shadow.querySelector(".calendar__nav--next").addEventListener("click", () => this.#showMonth(addMonths(this.#month, 1)));
		this.#shadow.querySelector(".calendar__today").addEventListener("click", () => this.#select(this.today, true));
		this.#body.addEventListener("click", this.clickHandler);
		this.#body.addEventListener("keydown", this.keydownHandler);

		this.#observer = new MutationObserver(() => this.#read());
	}

	get today() {
		return startOfDay(parseDate(this.getAttribute("today"))?.date ?? new Date());
	}

	connectedCallback() {
		// Titles are text content, so text and child changes count as well as the event attributes.
		this.#observer.observe(this, {
			childList: true, subtree: true, characterData: true,
			attributes: true, attributeFilter: ["start", "end", "href", "location"],
		});
		// Only the first connect picks the month, so moving the element keeps the visitor's place.
		if (!this.#month) this.#showMonth(this.#initialMonth(), false);
		this.#read();
	}

	disconnectedCallback() {
		this.#observer.disconnect();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "label") {
			this.#section.setAttribute("aria-label", newValue || DEFAULT_LABEL);
			return;
		}
		if (this.isConnected) this.#showMonth(this.#initialMonth());
	}

	clickHandler = (event) => {
		const button = event.target.closest("[data-date]");
		if (button) this.#select(parseDate(button.dataset.date).date);
	};

	// Arrow keys, Home/End and PageUp/PageDown move focus between days (APG date grid);
	// Enter and Space select through the button's own click.
	keydownHandler = (event) => {
		const button = event.target.closest("[data-date]");
		if (!button) return;
		const move = KEY_MOVES[event.key];
		if (!move) return;
		event.preventDefault();
		this.#moveFocus(move(parseDate(button.dataset.date).date));
	};

	#initialMonth() {
		return parseMonth(this.getAttribute("month")) ?? this.today;
	}

	#read() {
		this.#events = [...this.children]
			.filter((child) => child.localName === "ycl-calendar-event")
			.map((child) => CalendarEvent.read(child))
			.filter(Boolean)
			.sort((a, b) => a.start - b.start);
		this.#render();
	}

	// Shows a month with today selected if it's in it, otherwise nothing selected.
	#showMonth(date, render = true) {
		const today = this.today;
		this.#month = startOfMonth(date);
		this.#selected = sameMonth(today, this.#month) ? today : null;
		this.#focus = this.#selected ?? this.#month;
		if (render) this.#render();
	}

	#select(day, focus = false) {
		this.#month = startOfMonth(day);
		this.#selected = day;
		this.#focus = day;
		this.#render();
		if (focus) this.#focusDay();
	}

	#moveFocus(day) {
		this.#focus = day;
		if (sameMonth(day, this.#month)) {
			this.#updateTabStop();
		} else {
			this.#month = startOfMonth(day);
			this.#selected = null;
			this.#render();
		}
		this.#focusDay();
	}

	#focusDay() {
		this.#body.querySelector(`[data-date="${keyOf(this.#focus)}"]`)?.focus();
	}

	#updateTabStop() {
		const focusKey = keyOf(this.#focus);
		for (const button of this.#body.querySelectorAll("[data-date]")) button.tabIndex = button.dataset.date === focusKey ? 0 : -1;
	}

	#render() {
		if (!this.#month) return;
		const today = this.today;
		// Each displayed day's events, found in one pass over the events.
		const first = this.#month;
		const last = endOfMonth(first);
		const byDay = new Map();
		for (const event of this.#events) {
			if (event.lastDay < first || event.firstDay > last) continue;
			const from = event.firstDay < first ? first : event.firstDay;
			const to = event.lastDay > last ? last : event.lastDay;
			for (let day = from; day <= to; day = addDays(day, 1)) {
				const key = keyOf(day);
				if (!byDay.has(key)) byDay.set(key, []);
				byDay.get(key).push(event);
			}
		}
		// The label is a live region, so it's only written when the month changes.
		const label = monthFormat.format(first);
		if (this.#monthLabel.textContent !== label) this.#monthLabel.textContent = label;
		// Live only after the first month is written, so loading the page announces nothing.
		this.#monthLabel.setAttribute("aria-live", "polite");
		// Rebuilding the grid removes the focused day, so put focus back on the new one.
		const hadFocus = this.#body.contains(this.#shadow.activeElement);
		this.#renderGrid(byDay, today);
		this.#renderList(byDay, today);
		if (hadFocus) this.#focusDay();
	}

	#renderGrid(byDay, today) {
		const todayKey = keyOf(today);
		const selectedKey = this.#selected && keyOf(this.#selected);
		const last = endOfMonth(this.#month).getDate();
		const rows = [];
		let row = el("tr");
		for (let i = 0; i < this.#month.getDay(); i++) row.append(el("td"));

		for (let d = 1; d <= last; d++) {
			const day = new Date(this.#month.getFullYear(), this.#month.getMonth(), d);
			const key = keyOf(day);
			const count = byDay.get(key)?.length ?? 0;
			const button = el("button", "calendar__day");
			button.type = "button";
			button.dataset.date = key;
			button.setAttribute("aria-pressed", String(key === selectedKey));
			if (key === todayKey) button.setAttribute("aria-current", "date");
			const label = [dayFormat.format(day)];
			if (key === todayKey) label.push("today");
			if (count) label.push(`${count} ${count === 1 ? "event" : "events"}`);
			button.setAttribute("aria-label", label.join(", "));
			button.append(el("span", "calendar__number", d));

			if (count) {
				button.classList.add("calendar__day--events");
				const dots = el("span", "calendar__dots");
				dots.setAttribute("aria-hidden", "true");
				for (let i = 0; i < Math.min(count, MAX_DOTS); i++) dots.append(el("span", "calendar__dot"));
				if (count > MAX_DOTS) dots.append(el("span", "calendar__more", "+"));
				button.append(dots);
			}

			const cell = el("td");
			cell.append(button);
			row.append(cell);
			if (day.getDay() === 6) {
				rows.push(row);
				row = el("tr");
			}
		}
		if (row.children.length) {
			while (row.children.length < 7) row.append(el("td"));
			rows.push(row);
		}
		this.#body.replaceChildren(...rows);
		this.#updateTabStop();
	}

	// Events from the selected day (or the first of the month) to the month's end, each once,
	// under the first listed day it covers.
	#renderList(byDay, today) {
		const last = endOfMonth(this.#month);
		const groups = [];
		const listed = new Set();
		for (let day = this.#selected ?? this.#month; day <= last; day = addDays(day, 1)) {
			const events = (byDay.get(keyOf(day)) ?? []).filter((e) => !listed.has(e));
			if (!events.length) continue;
			events.forEach((e) => listed.add(e));
			groups.push(this.#renderGroup(day, events, today, groups.length));
		}

		if (groups.length) {
			this.#list.replaceChildren(...groups);
			return;
		}
		const message = this.#selected ? "No events from this day to the end of the month." : "No events this month.";
		this.#list.replaceChildren(el("p", "calendar__empty", message));
	}

	#renderGroup(day, events, today, index) {
		const group = el("div", "calendar__group");
		const heading = el("p", "calendar__group-day", dayFormat.format(day));
		heading.id = `calendar-group-${index}`;
		const list = el("ul", "calendar__events");
		list.setAttribute("aria-labelledby", heading.id);
		list.append(...events.map((e) => this.#renderEvent(e, day, today)));
		group.append(heading, list);
		return group;
	}

	#renderEvent(event, day, today) {
		const past = event.lastDay < today;
		const item = el("li", `calendar__event${past ? " calendar__event--past" : ""}`);

		const badge = el("span", "calendar__badge");
		badge.setAttribute("aria-hidden", "true");
		badge.append(el("span", "calendar__badge-month", badgeMonthFormat.format(day)), el("span", "calendar__badge-day", day.getDate()));

		const parts = [];
		if (past) parts.push("Past event");
		const length = daysBetween(event.firstDay, event.lastDay) + 1;
		if (length > 1) parts.push(`Day ${daysBetween(event.firstDay, day) + 1} of ${length}`);
		if (event.allDay) parts.push("All day");
		else if (length === 1) parts.push(event.end ? `${formatTime(event.start)} to ${formatTime(event.end)}` : formatTime(event.start));

		const title = el(event.href ? "a" : "span", "calendar__event-title", event.title);
		if (event.href) title.setAttribute("href", event.href);
		const heading = el("p", "calendar__event-heading");
		heading.append(title);

		const body = el("div", "calendar__event-body");
		body.append(el("p", "calendar__event-meta", parts.join(" · ")), heading);
		if (event.location) body.append(el("p", "calendar__event-location", event.location));
		item.append(badge, body);
		return item;
	}
}

// ycl-calendar-event first, so it exists by the time ycl-calendar upgrades and reads its children.
if (!customElements.get("ycl-calendar-event")) customElements.define("ycl-calendar-event", CalendarEvent);
if (!customElements.get("ycl-calendar")) customElements.define("ycl-calendar", Calendar);
