import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./date-time.css?inline";

const dateTimeTemplate = document.createElement("template");
dateTimeTemplate.innerHTML = `<time class="date-time"><slot></slot></time>`;

const emDash = "—";

// The Twig template's PHP date() formats, rebuilt from Intl parts. Each named format has a
// "start" variant used before the end date when a range is shown.
const formats = {
	time: { end: (p) => `${p.g}:${p.i} ${p.a}`, start: (p) => `${p.g}:${p.i} ${p.a}${emDash}` },
	date: { end: (p) => `${p.F} ${p.j}, ${p.Y}`, start: (p) => `${p.F} ${p.j}, ${p.Y}${emDash}` },
	day__full: { end: (p) => `${p.D} ${p.M} ${p.j}, ${p.Y}`, start: (p) => `${p.D} ${p.M} ${p.j} to ` },
	day__long: { end: (p) => `${p.l}, ${p.F} ${p.j}, ${p.Y}`, start: (p) => `${p.l}, ${p.F} ${p.j}, ${p.Y}${emDash}` },
	month_year: { end: (p) => `${p.F} ${p.Y}`, start: (p) => `${p.F} ${p.Y}${emDash}` },
	year_only: { end: (p) => p.Y, start: (p) => `${p.Y}${emDash}` },
	same_day_diff_time: { end: (p) => `${p.g}:${p.i} ${p.a}`, start: (p) => `${p.F} ${p.j}, ${p.Y} ${p.g}:${p.i} ${p.a}${emDash}` },
	date_time_multiple_days: {
		end: (p) => `${p.D} ${p.M} ${p.j}, ${p.Y} ${p.g}:${p.i} ${p.a}`,
		start: (p) => `${p.D} ${p.M} ${p.j}, ${p.Y} ${p.g}:${p.i} ${p.a}${emDash}`,
	},
	localist_same_day: { end: (p) => `${p.g}:${p.i} ${p.a}`, start: (p) => `${p.D} ${p.M} ${p.j}, ${p.Y} ${p.g}:${p.i} ${p.a}${emDash}` },
};
// Twig's "date_and_time" has always rendered the full day without a time; kept for parity.
formats.date_and_time = formats.day__full;

// All-day formats show only the date(s), followed by "All day".
const allDayFormats = { all_day: formats.date.end, localist_all_day: formats.day__full.end };

// Accepts ISO 8601 strings or Unix timestamps in seconds (what Drupal date fields hand over).
function parseDate(value) {
	if (!value) return null;
	const date = /^\d+$/.test(value.trim()) ? new Date(Number(value) * 1000) : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

function dateParts(date, timeZone) {
	let formatter;
	try {
		formatter = new Intl.DateTimeFormat("en-US", {
			timeZone: timeZone || undefined,
			weekday: "long", year: "numeric", month: "long", day: "numeric",
			hour: "numeric", minute: "2-digit", hour12: true,
		});
	} catch {
		// An unknown time-zone value falls back to the visitor's local time rather than failing.
		return dateParts(date);
	}
	const parts = Object.fromEntries(formatter.formatToParts(date).map(({ type, value }) => [type, value]));
	return {
		F: parts.month, M: parts.month.slice(0, 3),
		l: parts.weekday, D: parts.weekday.slice(0, 3),
		j: parts.day, Y: parts.year,
		g: parts.hour, i: parts.minute, a: parts.dayPeriod.toLowerCase(),
	};
}

export class DateTime extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["start", "end", "format", "all-day", "time-zone"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "date-time")];
		this.#shadow.appendChild(document.importNode(dateTimeTemplate.content, true));
		this.time = this.#shadow.querySelector("time");
		this.fallback = this.#shadow.querySelector("slot");
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		this.#render();
	}

	#render() {
		const start = parseDate(this.getAttribute("start"));
		// Without a parseable start date, show whatever the author put inside the element.
		if (!start) {
			this.time.removeAttribute("datetime");
			this.time.replaceChildren(this.fallback);
			this.time.classList.remove("date-time--all-day");
			return;
		}
		const end = parseDate(this.getAttribute("end")) ?? start;
		const timeZone = this.getAttribute("time-zone");
		const format = this.allDay ? "all_day" : this.getAttribute("format") ?? "date_and_time";
		const startParts = dateParts(start, timeZone);
		const endParts = dateParts(end, timeZone);

		let text;
		if (allDayFormats[format]) {
			const startText = allDayFormats[format](startParts);
			const endText = allDayFormats[format](endParts);
			text = startText === endText ? `${startText} All day` : `${startText}${emDash}${endText} All day`;
		} else {
			const { start: startFormat, end: endFormat } = formats[format] ?? formats.date_and_time;
			text = start.getTime() === end.getTime()
				? endFormat(startParts)
				: startFormat(startParts) + endFormat(endParts);
		}

		this.time.textContent = text;
		this.time.setAttribute("datetime", start.toISOString());
		this.time.classList.toggle("date-time--all-day", format === "all_day");
	}

	get allDay() { return this.hasAttribute("all-day"); }
	set allDay(value) {
		if (value) this.setAttribute("all-day", "");
		else this.removeAttribute("all-day");
	}

	get start() { return this.getAttribute("start"); }
	set start(value) { this.setAttribute("start", value); }

	get end() { return this.getAttribute("end"); }
	set end(value) {
		if (value) this.setAttribute("end", value);
		else this.removeAttribute("end");
	}
}

if (!customElements.get("ycl-date-time")) customElements.define("ycl-date-time", DateTime);
