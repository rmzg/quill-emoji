import Quill from "quill";
import EmojiBlot from "./format-emoji-blot";
import ShortNameEmoji from "./module-emoji";
import ToolbarEmoji from "./module-toolbar-emoji";
import "./scss/quill-emoji.scss";

Quill.register(
	{
		"formats/emoji": EmojiBlot,
		"modules/emoji-shortname": ShortNameEmoji,
		"modules/emoji-toolbar": ToolbarEmoji
	},
	true
);

export default { EmojiBlot, ShortNameEmoji, ToolbarEmoji };
