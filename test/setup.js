import { afterEach } from "vitest";

afterEach(() => {
	document.body.replaceChildren();
	document.body.removeAttribute("style");
	localStorage.clear();
});
