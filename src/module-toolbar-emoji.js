import Quill from "quill";
import Fuse from "fuse.js";
import emojiList from "./emoji-list.js";

const Delta = Quill.import("delta");
const Module = Quill.import("core/module");

class ToolbarEmoji extends Module {
	constructor(quill, options) {
		super(quill, options);

		this.quill = quill;
		this.toolbar = quill.getModule("toolbar");
		if (typeof this.toolbar !== "undefined")
			this.toolbar.addHandler("emoji", this.checkPaletteExist.bind(this));

		var emojiBtn = document.querySelector(".ql-emoji");
		if (emojiBtn) {
			emojiBtn.innerHTML = options.buttonIcon;
		}
	}

	checkPaletteExist() {
		this.checkDialogOpen();
		this.quill.on("text-change", (delta, oldDelta, source) => {
			if (source === "user") {
				this.close();
			}
		});
	}

	close() {
		document.getElementById("emoji-close-div").style.display = "none";
		if (this.palette) {
			//TODO display:none?
			this.palette.remove();
			this.palette = null;
		}
	}

	checkDialogOpen() {
		if (this.palette) {
			//this.palette.remove();
			this.close();
		} else {
			this.showEmojiPalette();
		}
	}

	showEmojiPalette() {
		let ele_emoji_area = document.createElement("div");
		let range = this.quill.getSelection();
		const atSignBounds = this.quill.getBounds(range.index);
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
		var emojiType = [
			{ type: "p", name: "people", content: '<div class="i-people"></div>' },
			{ type: "n", name: "nature", content: '<div class="i-nature"></div>' },
			{ type: "d", name: "food", content: '<div class="i-food"></div>' },
			{ type: "s", name: "symbols", content: '<div class="i-symbols"></div>' },
			{ type: "a", name: "activity", content: '<div class="i-activity"></div>' },
			{ type: "t", name: "travel", content: '<div class="i-travel"></div>' },
			{ type: "o", name: "objects", content: '<div class="i-objects"></div>' },
			{ type: "f", name: "flags", content: '<div class="i-flags"></div>' }
		];

		let tabElementHolder = document.createElement("ul");
		tabToolbar.appendChild(tabElementHolder);

		if (document.getElementById("emoji-close-div") === null) {
			let closeDiv = document.createElement("div");
			closeDiv.id = "emoji-close-div";
			closeDiv.addEventListener("click", close, false);
			this.quill.container.appendChild(closeDiv);
		} else {
			document.getElementById("emoji-close-div").style.display = "block";
		}

		emojiType.forEach(emojiType => {
			//add tab bar
			let tabElement = document.createElement("li");
			tabElement.classList.add("emoji-tab");
			tabElement.classList.add("filter-" + emojiType.name);
			let tabValue = emojiType.content;
			tabElement.innerHTML = tabValue;
			tabElement.dataset.filter = emojiType.type;
			tabElementHolder.appendChild(tabElement);

			let emojiFilter = document.querySelector(".filter-" + emojiType.name);
			emojiFilter.addEventListener("click", () => {
				let tab = document.querySelector("#emoji-palette .emoji-tab.active");
				if (tab) {
					tab.classList.remove("active");
				}
				emojiFilter.classList.toggle("active");
				updateEmojiContainer(emojiFilter, panel, this.quill);
			});
		});
		this.emojiPanelInit();
	}

	emojiPanelInit() {
		this.emojiElementsToPanel("p");
		document.querySelector(".filter-people").classList.add("active");
	}

	emojiElementsToPanel(type) {
		let fuseOptions = {
			shouldSort: true,
			matchAllTokens: true,
			threshold: 0.3,
			location: 0,
			distance: 100,
			maxPatternLength: 32,
			minMatchCharLength: 3,
			keys: ["category"]
		};
		let fuse = new Fuse(emojiList, fuseOptions);
		let result = fuse.search(type);
		result.sort((a, b) => a.emoji_order - b.emoji_order);

		this.quill.focus();
		let range = this.quill.getSelection();

		result.forEach(emoji => {
			let span = document.createElement("span");
			let t = document.createTextNode(emoji.shortname);
			span.appendChild(t);
			span.classList.add("em");
			span.classList.add("em-" + emoji.name);
			let output = "" + emoji.code_decimal + "";
			span.innerHTML = output + " ";
			this.panel.appendChild(span);

			span.addEventListener("click", () => {
				this.quill.insertEmbed(range.index, "emoji", emoji, Quill.sources.USER);
				setTimeout(() => this.quill.setSelection(range.index + 1), 0);
				this.close();
			});
		});
	}

	updateEmojiContainer(emojiFilter) {
		while (this.panel.firstChild) {
			this.panel.removeChild(this.panel.firstChild);
		}
		let type = emojiFilter.dataset.filter;
		this.emojiElementsToPanel(type);
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
