import baseStyles from "../../styles/base.css?inline";
import { iconSvg } from "../icons/icons.js";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const speeds = [
	{ modifier: "half", rate: 0.5, label: "0.5x" },
	{ modifier: "normal", rate: 1, label: "1x" },
	{ modifier: "double", rate: 2, label: "2x" },
];

// ids only need to be unique within this shadow root, so they can be fixed.
const audioTemplate = document.createElement("template");
audioTemplate.innerHTML = `
	<div class="audio-embed">
		<div class="audio-embed__inner">
			<div class="audio-embed__content-wrapper">
				<div class="audio-embed__content">
					<slot></slot>
					<slot name="audio"><audio class="audio-embed__audio" preload="metadata"></audio></slot>
				</div>
				<div class="audio-embed__player">
					<div class="audio-embed__controls">
						<button class="audio-embed__control audio-embed__control--play">
							<span class="visually-hidden">Play the Audio File</span>
							${iconSvg("circle-play-regular", "audio-embed__icon audio-embed__icon--play")}
						</button>
						<button class="audio-embed__control audio-embed__control--pause">
							<span class="visually-hidden">Pause the Audio File</span>
							${iconSvg("circle-pause-regular", "audio-embed__icon audio-embed__icon--pause")}
						</button>
					</div>
					<div class="audio-embed__progress">
						<div class="audio-embed__progress-bar">
							<label class="visually-hidden" for="progress-bar">Progress bar for audio file playback</label>
							<input type="range" id="progress-bar" class="audio-embed__progress-bar-input" min="0" max="100" step="0.1" value="0">
						</div>
					</div>
					<div class="audio-embed__time">
						<div class="audio-embed__time--current">0:00</div>
						<span class="audio-embed__time--separator">&nbsp;/&nbsp;</span>
						<div class="audio-embed__time--total">0:00</div>
					</div>
					<div class="audio-embed__speed">
						<button class="audio-embed__speed-options-control" aria-expanded="false" aria-controls="speed-options">
							<span class="visually-hidden">Playback speed options</span>
							${iconSvg("gauge-solid", "audio-embed__icon--speed")}
						</button>
						<div class="audio-embed__speed-options" id="speed-options">
							${speeds.map(({ modifier, label }) => `<button class="audio-embed__speed-control audio-embed__speed-control--${modifier}" aria-pressed="false"><span class="visually-hidden">Playback speed </span>${label}</button>`).join("")}
						</div>
					</div>
					<div class="audio-embed__volume">
						<button class="audio-embed__volume-control-option" aria-pressed="false">
							<span class="visually-hidden">Mute the Audio File</span>
							${iconSvg("volume-high-solid", "audio-embed__icon--volume")}
							${iconSvg("volume-xmark-solid", "audio-embed__icon--volume-muted")}
						</button>
						<label class="visually-hidden" for="volume-control">Volume</label>
						<input type="range" id="volume-control" class="audio-embed__volume-control" min="0" max="1" step="0.01" value="0.5">
					</div>
				</div>
			</div>
		</div>
	</div>
`;

const formatTime = (seconds) => {
	const safe = Number.isFinite(seconds) ? seconds : 0;
	const minutes = Math.floor(safe / 60);
	const rest = Math.floor(safe % 60);
	return `${minutes}:${rest < 10 ? "0" : ""}${rest}`;
};

// Not named Audio, which would shadow the global HTMLAudioElement constructor for importers.
export class AudioPlayer extends HTMLElement {
	#shadow;
	#audio;
	#duration = 0;

	static get observedAttributes() {
		return ["src"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(audioTemplate.content, true));
		const $ = (selector) => this.#shadow.querySelector(selector);
		this.root = $(".audio-embed");
		this.internalAudio = $(".audio-embed__audio");
		this.playButton = $(".audio-embed__control--play");
		this.pauseButton = $(".audio-embed__control--pause");
		this.progressBar = $(".audio-embed__progress-bar-input");
		this.currentTimeDisplay = $(".audio-embed__time--current");
		this.totalTimeDisplay = $(".audio-embed__time--total");
		this.speedControl = $(".audio-embed__speed");
		this.speedOptionsControl = $(".audio-embed__speed-options-control");
		this.speedButtons = speeds.map((speed) => ({ ...speed, button: $(`.audio-embed__speed-control--${speed.modifier}`) }));
		this.volumeElement = $(".audio-embed__volume");
		this.volumeControl = $(".audio-embed__volume-control");
		this.muteButton = $(".audio-embed__volume-control-option");

		// play() rejects when there is nothing playable; the button just stays as it is.
		this.playButton.addEventListener("click", () => this.play().catch(() => {}));
		this.pauseButton.addEventListener("click", () => this.pause());
		this.progressBar.addEventListener("input", this.seekHandler);
		this.volumeControl.addEventListener("input", this.volumeHandler);
		this.muteButton.addEventListener("click", this.muteHandler);
		this.speedControl.addEventListener("click", this.toggleSpeedOptions);
		this.speedControl.addEventListener("keydown", this.speedKeyHandler);
		this.speedButtons.forEach((speed) => {
			speed.button.addEventListener("click", (event) => this.speedHandler(event, speed));
		});
		this.#shadow.querySelector('slot[name="audio"]').addEventListener("slotchange", this.audioSlotHandler);

		// iOS ignores scripted volume (the hardware buttons own it), so the control would do nothing.
		if (/iPad|iPhone|iPod/.test(navigator.userAgent)) this.volumeElement.hidden = true;
		this.#setActiveSpeed(this.speedButtons[1]);
		this.#useAudio(this.internalAudio);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (newValue) this.internalAudio.src = newValue;
		else this.internalAudio.removeAttribute("src");
		this.internalAudio.load();
	}

	// Authors can supply their own <audio slot="audio"> (e.g. with several <source>s) in place of src.
	audioSlotHandler = (event) => {
		const slotted = event.target.assignedElements().find((el) => el.localName === "audio");
		this.#useAudio(slotted ?? this.internalAudio);
	};

	#useAudio(audio) {
		if (audio === this.#audio) return;
		if (this.#audio) {
			this.#audio.pause();
			["loadedmetadata", "durationchange", "timeupdate", "ended", "play", "pause"].forEach((type) => {
				this.#audio.removeEventListener(type, this.mediaHandler);
			});
		}
		this.#audio = audio;
		// The custom controls replace the browser's own.
		audio.controls = false;
		audio.volume = this.muteButton.getAttribute("aria-pressed") === "true" ? 0 : Number(this.volumeControl.value);
		audio.playbackRate = this.speedButtons.find(({ button }) => button.classList.contains("active")).rate;
		["loadedmetadata", "durationchange", "timeupdate", "ended", "play", "pause"].forEach((type) => {
			audio.addEventListener(type, this.mediaHandler);
		});
		this.#updateDuration();
		this.#updateTime();
	}

	mediaHandler = (event) => {
		switch (event.type) {
		case "loadedmetadata":
		case "durationchange":
			this.#updateDuration();
			break;
		case "timeupdate":
			this.#updateTime();
			break;
		case "play":
			this.#setPlaying(true);
			break;
		case "pause":
		case "ended":
			// Covers the end of playback too, so the play icon comes back.
			this.#setPlaying(false);
			break;
		}
	};

	play() {
		return this.#audio.play();
	}

	pause() {
		this.#audio.pause();
	}

	get playing() { return !this.#audio.paused; }

	#setPlaying(playing) {
		// Hand focus to the button that replaces the one just hidden, so keyboard users don't lose it.
		const hadFocus = this.#shadow.activeElement;
		this.root.setAttribute("is-playing", String(playing));
		if (playing && hadFocus === this.playButton) this.pauseButton.focus();
		if (!playing && hadFocus === this.pauseButton) this.playButton.focus();
	}

	// Some streams report no duration until played through. The last known duration for a file
	// is cached in localStorage; storage may be blocked or full, which must never break the player.
	#updateDuration() {
		const audio = this.#audio;
		const key = audio.currentSrc ? `audioDuration_${audio.currentSrc}` : null;
		if (Number.isFinite(audio.duration) && audio.duration > 0) {
			this.#duration = audio.duration;
			try {
				if (key) localStorage.setItem(key, String(audio.duration));
			} catch {
				// Caching failed; the duration is still correct.
			}
		} else {
			let stored = null;
			try {
				stored = key ? localStorage.getItem(key) : null;
			} catch {
				// Nothing readable is cached.
			}
			this.#duration = Number(stored) || 0;
		}
		this.totalTimeDisplay.textContent = formatTime(this.#duration);
		this.#updateTime();
	}

	#updateTime() {
		const { currentTime } = this.#audio;
		this.currentTimeDisplay.textContent = formatTime(currentTime);
		this.progressBar.value = this.#duration ? (currentTime / this.#duration) * 100 : 0;
		this.progressBar.setAttribute("aria-valuetext", `${formatTime(currentTime)} of ${formatTime(this.#duration)}`);
	}

	seekHandler = () => {
		if (!this.#duration) return;
		this.#audio.currentTime = (this.progressBar.value / 100) * this.#duration;
	};

	volumeHandler = () => {
		const volume = Number(this.volumeControl.value);
		this.#audio.volume = volume;
		this.muteButton.setAttribute("aria-pressed", String(volume === 0));
	};

	muteHandler = () => {
		const muted = this.muteButton.getAttribute("aria-pressed") === "true";
		const volume = muted ? 0.5 : 0;
		this.volumeControl.value = volume;
		this.#audio.volume = volume;
		this.muteButton.setAttribute("aria-pressed", String(!muted));
	};

	// The whole speed area is a click target: the gauge and the visible active speed both open
	// the options. Inactive speeds are only shown while the options are open.
	toggleSpeedOptions = () => {
		this.#setSpeedOptionsOpen(this.speedControl.getAttribute("options-open") !== "true");
	};

	#setSpeedOptionsOpen(open) {
		this.speedControl.setAttribute("options-open", String(open));
		this.speedOptionsControl.setAttribute("aria-expanded", String(open));
	}

	// Choosing a speed only counts while the options are open; stopping propagation keeps the
	// click from reaching the container toggle, which would immediately reopen them.
	speedHandler = (event, speed) => {
		if (this.speedControl.getAttribute("options-open") !== "true") return;
		event.stopPropagation();
		this.#audio.playbackRate = speed.rate;
		this.#setActiveSpeed(speed);
		this.#setSpeedOptionsOpen(false);
		speed.button.focus();
	};

	speedKeyHandler = (event) => {
		if (event.key !== "Escape" || this.speedControl.getAttribute("options-open") !== "true") return;
		this.#setSpeedOptionsOpen(false);
		this.speedOptionsControl.focus();
	};

	#setActiveSpeed(active) {
		this.speedButtons.forEach(({ button }) => {
			const isActive = button === active.button;
			button.classList.toggle("active", isActive);
			button.setAttribute("aria-pressed", String(isActive));
		});
	}
}

customElements.define("ycl-audio", AudioPlayer);
