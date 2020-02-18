import Quill from "quill";

const Embed = Quill.import("blots/embed");

class EmojiBlot extends Embed {
	static blotName = "emoji";
	static className = "ql-emojiblot";
	static tagName = "span";
	static emojiClass = "em";
	static emojiPrefix = "em-";

	static create(emoji) {
		console.log("CREATE IS HERE");
		let node = super.create();
		console.log("Created ", node, " with ", emoji);

		//TODO Make overridable

		node.dataset.name = emoji.short_name;
		let span = document.createElement(EmojiBlot.tagName);
		span.classList.add(
			EmojiBlot.className,
			EmojiBlot.emojiClass,
			EmojiBlot.emojiPrefix + emoji.short_name
		);
		// unicode can be '1f1f5-1f1ea',see emoji-list.js.
		span.innerText = String.fromCodePoint(
			...emoji.unified.split("-").map(str => parseInt(str, 16))
		);
		node.appendChild(span);

		return node;
	}

	static value(node) {
		return node.dataset.name;
	}
}

export default EmojiBlot;
