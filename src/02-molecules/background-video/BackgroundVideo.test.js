import { describe, expect, it, vi } from "vitest";
import "./BackgroundVideo.js";
import { mount, shadowOf, settle } from "../../../test/helpers.js";

const video = (el) => shadowOf(el).querySelector("video");
const button = (el) => shadowOf(el).querySelector("ycl-button");
const reduceMotion = (reduce) =>
	vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
		matches: reduce && query.includes("prefers-reduced-motion"),
		media: query,
		addEventListener() {},
		removeEventListener() {},
	}));
const stubPlayback = () => {
	vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function () {
		Object.defineProperty(this, "paused", { value: false, configurable: true });
		return Promise.resolve();
	});
	vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function () {
		Object.defineProperty(this, "paused", { value: true, configurable: true });
	});
};

describe("ycl-background-video", () => {
	it("renders a muted, looping, inline video with no native controls", () => {
		reduceMotion(false);
		stubPlayback();
		const el = mount(`<ycl-background-video src="/clip.mp4" poster="/poster.jpg"></ycl-background-video>`);
		const v = video(el);
		expect(v.getAttribute("src")).toBe("/clip.mp4");
		expect(v.muted).toBe(true);
		expect(v.loop).toBe(true);
		expect(v.playsInline).toBe(true);
		expect(v.controls).toBe(false);
	});

	it("uses the poster image", () => {
		reduceMotion(false);
		stubPlayback();
		const el = mount(`<ycl-background-video src="/clip.mp4" poster="/poster.jpg"></ycl-background-video>`);
		expect(video(el).getAttribute("poster")).toBe("/poster.jpg");
	});

	it("is hidden from assistive tech, since it is decoration", () => {
		reduceMotion(false);
		stubPlayback();
		const el = mount(`<ycl-background-video src="/clip.mp4"></ycl-background-video>`);
		expect(video(el).getAttribute("aria-hidden")).toBe("true");
	});

	it("autoplays and offers a Pause control built from the Button atom", () => {
		reduceMotion(false);
		stubPlayback();
		const el = mount(`<ycl-background-video src="/clip.mp4"></ycl-background-video>`);
		expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
		expect(button(el).localName).toBe("ycl-button");
		expect(button(el).getAttribute("label")).toBe("Pause background video");
	});

	it("pauses and plays from the control, and the name follows the state", () => {
		reduceMotion(false);
		stubPlayback();
		const el = mount(`<ycl-background-video src="/clip.mp4"></ycl-background-video>`);
		button(el).click();
		expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
		expect(button(el).getAttribute("label")).toBe("Play background video");
		button(el).click();
		expect(button(el).getAttribute("label")).toBe("Pause background video");
	});

	it("does not autoplay under reduced motion and starts on the Play control", async () => {
		reduceMotion(true);
		stubPlayback();
		const el = mount(`<ycl-background-video src="/clip.mp4" poster="/poster.jpg"></ycl-background-video>`);
		await settle();
		expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
		expect(video(el).hasAttribute("autoplay")).toBe(false);
		expect(video(el).getAttribute("poster")).toBe("/poster.jpg");
		expect(button(el).getAttribute("label")).toBe("Play background video");
	});

	it("fills its container with object-fit: cover", () => {
		reduceMotion(false);
		stubPlayback();
		const el = mount(`<ycl-background-video src="/clip.mp4"></ycl-background-video>`);
		expect(getComputedStyle(video(el)).objectFit).toBe("cover");
	});

	it("leaves a slot for content placed over the video", () => {
		reduceMotion(false);
		stubPlayback();
		const el = mount(`<ycl-background-video src="/clip.mp4"></ycl-background-video>`);
		expect(shadowOf(el).querySelector("slot:not([name])")).not.toBeNull();
	});
});
