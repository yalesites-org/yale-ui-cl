import { describe, expect, it } from "vitest";
import axe from "axe-core";
import "./02-molecules/alert/Alert.js";
import { mount } from "../test/helpers.js";

// The story a11y checks run axe over each rendered story. axe only sees inside a component if its
// shadow root is open, so this proves the checks reach a component's internals: a violation planted
// inside the shadow tree must be reported, with a target that points into that tree.
const buttonNameViolations = async (element) => {
	const { violations } = await axe.run(element, { runOnly: ["button-name"] });
	return violations.flatMap((violation) => violation.nodes);
};

describe("axe and component shadow roots", () => {
	it("reports no unnamed button in an unmodified component", async () => {
		const alert = mount(`<ycl-alert>Text</ycl-alert>`);
		expect(await buttonNameViolations(alert)).toEqual([]);
	});

	it("reports a violation planted inside a component's shadow root", async () => {
		const alert = mount(`<ycl-alert>Text</ycl-alert>`);
		const planted = document.createElement("button");
		planted.className = "planted";
		alert.shadowRoot.append(planted);

		const nodes = await buttonNameViolations(alert);
		expect(nodes).toHaveLength(1);
		// For nodes in a shadow tree, axe gives the target as [host selector, selector within the root].
		const [host, inner] = nodes[0].target[0];
		expect(document.querySelector(host)).toBe(alert);
		expect(alert.shadowRoot.querySelector(inner)).toBe(planted);
	});
});
