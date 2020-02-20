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
		this.toolbar.addHandler("emoji", () => {
			// This should always exist...
			let button = document.querySelector("button.ql-emoji");
			// This button is part of the toolbar node which is part of a different hierachy than the ql-container
			// that the palette is attached to, this means that the button's offsetTop is relative to some other
			// element and we can't use its value for the palette. However, we don't actually need to since the
			// ql-container *should* be directly below the toolbar div. Which means we can just use the button's
			// offsetLeft to move our palette horizontally to line it up with the button then add a small amount
			// of padding via style.top. Note that if style.top isn't set then the palette shows up *below* the
			// container...
			this.showPalette(button.offsetLeft, 2);
		});

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

	showPalette(left, top) {
		//TODO this should be a toggle
		// TODO Add code to relocate the box?
		this.closeDiv.style.display = "block";
		this.palette.style.display = "block";
		this.palette.style.left = left + "px";
		this.palette.style.top = top + "px";
	}

	hidePalette() {
		this.closeDiv.style.display = "none";
		this.palette.style.display = "none";
		this.quill.focus();
	}

	buildPalette() {
		let palette = document.createElement("div");
		this.palette = palette;
		this.quill.container.appendChild(palette);
		palette.id = "emoji-palette";

		let tabToolbar = document.createElement("div");
		tabToolbar.id = "tab-toolbar";
		palette.appendChild(tabToolbar);

		//panel
		let panel = document.createElement("div");
		this.panel = panel;
		panel.id = "tab-panel";
		palette.appendChild(panel);

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

		let closeDiv = document.createElement("div");
		closeDiv.id = "emoji-close-div";
		closeDiv.addEventListener("click", () => this.hidePalette(), false);
		this.quill.container.appendChild(closeDiv);
		this.closeDiv = closeDiv;

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
