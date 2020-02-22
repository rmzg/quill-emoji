import Quill from "quill";
const emojiList = require("./new-emoji-list.json");
import Fuse from "fuse.js";

let _pallette;
class EmojiPalette {
	static getPalette(quill) {
		if (!_pallette) _pallette = new EmojiPalette(quill);

		return _pallette;
	}

	constructor(quill) {
		this.quill = quill; // This sucks!
		let container = document.createElement("div");
		this.container = container;
		this.quill.container.appendChild(container);
		container.id = "emoji-palette";

		let tabToolbar = document.createElement("div");
		tabToolbar.id = "tab-toolbar";
		container.appendChild(tabToolbar);

		//panel
		let panel = document.createElement("div");
		this.panel = panel;
		panel.id = "tab-panel";
		container.appendChild(panel);

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
		closeDiv.addEventListener("click", () => this.hide(), false);
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
				this.hide();
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

	show(left, top) {
		//TODO this should be a toggle
		// TODO Add code to relocate the box?
		this.closeDiv.style.display = "block";
		this.container.style.display = "block";
		this.container.style.left = left + "px";
		this.container.style.top = top + "px";
	}

	hide() {
		this.closeDiv.style.display = "none";
		this.container.style.display = "none";
		this.quill.focus();
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

export default EmojiPalette;
