import { afterEach } from "vitest";
import "./helpers.js";

afterEach(() => {
	document.body.replaceChildren();
	document.body.removeAttribute("style");
	localStorage.clear();
});
