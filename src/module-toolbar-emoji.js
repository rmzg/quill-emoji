import Quill from "quill";
//import emojiList from "./emoji-list.js";

import EmojiPalette from "./emoji-palette";

const Module = Quill.import("core/module");

class ToolbarEmoji extends Module {
	constructor(quill, options) {
		super(quill, options);

		this.toolbar = quill.getModule("toolbar");
		this.palette = EmojiPalette.getPalette(quill);
		this.palette.hide(); //Just in case!
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
			this.palette.show(button.offsetLeft, 2);
		});

		quill.on("text-change", (_1, _2, source) => {
			if (source === "user") {
				this.palette.hide();
			}
		});
		var emojiBtn = document.querySelector("button.ql-emoji");
		emojiBtn.innerHTML = options.buttonIcon;
	}
}

ToolbarEmoji.DEFAULTS = {
	buttonIcon:
		'<svg viewbox="0 0 18 18"><circle class="ql-fill" cx="7" cy="7" r="1"></circle><circle class="ql-fill" cx="11" cy="7" r="1"></circle><path class="ql-stroke" d="M7,10a2,2,0,0,0,4,0H7Z"></path><circle class="ql-stroke" cx="9" cy="9" r="6"></circle></svg>'
};

export default ToolbarEmoji;
