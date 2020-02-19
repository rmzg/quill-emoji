import Quill from "quill";
import Fuse from "fuse.js";
//import emojiList from "./emoji-list.js";

const emojiList = require("emoji-datasource/emoji.json");

const Delta = Quill.import("delta");
const Module = Quill.import("core/module");

class ToolbarEmoji extends Module {
	constructor(quill, options) {
		super(quill, options);

		this.quill = quill;
		this.toolbar = quill.getModule("toolbar");
		this.buildPalette();
		this.hidePalette();
		if (typeof this.toolbar !== "undefined")
			this.toolbar.addHandler("emoji", this.showPalette.bind(this));

		this.quill.on("text-change", (delta, oldDelta, source) => {
			if (source === "user") {
				this.hidePalette();
			}
		});
		var emojiBtn = document.querySelector(".ql-emoji");
		if (emojiBtn) {
			emojiBtn.innerHTML = options.buttonIcon;
		}
	}

	showPalette() {
		//TODO this should be a toggle
		// TODO Add code to relocate the box?
		this.palette.style.display = "block";
	}

	hidePalette() {
		document.getElementById("emoji-close-div").style.display = "none";
		this.palette.style.display = "none";
	}

	buildPalette() {
		let ele_emoji_area = document.createElement("div");
		// This places the palette someplace
		// TODO Figure out where to put it
		// TODO Update max width sanely
		const atSignBounds = { left: 100, top: 10, height: 20 };
		this.palette = ele_emoji_area;

		this.quill.container.appendChild(ele_emoji_area);
		let paletteMaxPos = atSignBounds.left + 250; //palette max width is 250
		ele_emoji_area.id = "emoji-palette";
		ele_emoji_area.style.top =
			10 + atSignBounds.top + atSignBounds.height + "px";
		if (paletteMaxPos > this.quill.container.offsetWidth) {
			ele_emoji_area.style.left = atSignBounds.left - 250 + "px";
		} else {
			ele_emoji_area.style.left = atSignBounds.left + "px";
		}

		let tabToolbar = document.createElement("div");
		tabToolbar.id = "tab-toolbar";
		ele_emoji_area.appendChild(tabToolbar);

		//panel
		let panel = document.createElement("div");
		this.panel = panel;
		panel.id = "tab-panel";
		ele_emoji_area.appendChild(panel);

		//prettier-ignore
		let emojiType = [
			{ category: "Activities", content: '<div class="i-activity"></div>' },
			{ category: "Animals & Nature", content: '<div class="i-nature"></div>' },
			{ category: "Flags", content: '<div class="i-flags"></div>' },
			{ category: "Food & Drink", content: '<div class="i-food"></div>' },
			{ category: "Objects", content: '<div class="i-objects"></div>' },
			{ category: "People & Body", content: '<div class="i-people"></div>' },
			{ category: "Smileys & Emotion", content: '<div class="i-people"></div>' },
			{ category: "Symbols", content: '<div class="i-symbols"></div>' },
			{ category: "Travel & Places", content: '<div class="i-travel"></div>' }
		];

		let tabElementHolder = document.createElement("ul");

		emojiType.forEach(type => {
			let tabElement = document.createElement("li");
			tabElement.classList.add("emoji-tab");
			tabElement.innerHTML = type.content;
			tabElementHolder.appendChild(tabElement);
			tabElement.dataset.category = type.category;

			tabElement.addEventListener("click", () => {
				this.activateTab(tabElement);
			});
		});
		tabToolbar.appendChild(tabElementHolder);

		//TODO Move this to the right spot
		if (document.getElementById("emoji-close-div") === null) {
			let closeDiv = document.createElement("div");
			closeDiv.id = "emoji-close-div";
			closeDiv.addEventListener("click", close, false);
			this.quill.container.appendChild(closeDiv);
		} else {
			document.getElementById("emoji-close-div").style.display = "block";
		}

		emojiList.forEach(emoji => {
			let span = document.createElement("span");
			span.classList.add("em");
			span.classList.add("em-" + emoji.short_name);
			let grapheme = String.fromCodePoint(
				...emoji.unified.split("-").map(x => parseInt(x, 16))
			);
			span.innerHTML = `:${emoji.short_name}: ${grapheme}`;
			span.dataset.category = emoji.category;
			this.panel.appendChild(span);

			span.addEventListener("click", () => {
				let range = this.quill.getSelection(true);
				this.quill.insertEmbed(range.index, "emoji", emoji, Quill.sources.USER);
				setTimeout(() => this.quill.setSelection(range.index + 1), 0);
				this.hidePalette();
			});
		});

		//Set starting point
		this.activateTab(tabElementHolder.children[0]);
	}

	activateTab(tab) {
		let oldTab = document.querySelector("#emoji-palette .emoji-tab.active");
		if (oldTab) {
			oldTab.classList.remove("active");
		}
		tab.classList.add("active");
		this.emojiElementsToPanel(tab.dataset.category);
	}

	emojiElementsToPanel(type) {
		//let fuseOptions = {
		//shouldSort: true,
		//matchAllTokens: true,
		//threshold: 0.3,
		//location: 0,
		//distance: 100,
		//maxPatternLength: 32,
		//minMatchCharLength: 3,
		//keys: ["category"]
		//};
		//let fuse = new Fuse(emojiList, fuseOptions);
		//let result = fuse.search(type);
		//result.sort((a, b) => a.emoji_order - b.emoji_order);

		let children = this.panel.children;
		for (let i = 0; i < children.length; i++) {
			if (children[i].dataset.category === type) {
				children[i].style.display = "inline-block";
			} else {
				children[i].style.display = "none";
			}
		}
	}
}

function makeElement(tag, attrs, ...children) {
	const elem = document.createElement(tag);
	Object.keys(attrs).forEach(key => (elem[key] = attrs[key]));
	children.forEach(child => {
		if (typeof child === "string") child = document.createTextNode(child);
		elem.appendChild(child);
	});
	return elem;
}

ToolbarEmoji.DEFAULTS = {
	buttonIcon:
		'<svg viewbox="0 0 18 18"><circle class="ql-fill" cx="7" cy="7" r="1"></circle><circle class="ql-fill" cx="11" cy="7" r="1"></circle><path class="ql-stroke" d="M7,10a2,2,0,0,0,4,0H7Z"></path><circle class="ql-stroke" cx="9" cy="9" r="6"></circle></svg>'
};

export default ToolbarEmoji;
