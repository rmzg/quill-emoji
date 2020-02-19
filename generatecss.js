const emojis = require("emoji-datasource/emoji.json");
const fs = require("fs");

let out = fs.openSync("./src/scss/core/_emoji.scss", "w");

const EmojiDataSourceSize = 34; //The size of each sprite, in px, squared.
const EmojiDataSourceCount = 57; // The number of columns/rows in the sheet

const desiredSize = 20; // The size to resize the each sprite to

const newSize = EmojiDataSourceCount * desiredSize;

fs.writeSync(
	out,
	`.em {
	background: url("../../sheet.png") no-repeat;
	background-size: ${newSize}px ${newSize}px;
	width: ${desiredSize}px;
	height: ${desiredSize}px;
	display: inline-block;
	text-indent: -9999px; /*Emojis get their symbol as their text, this hides it so the image shows through */
}\n`
);

emojis.forEach(e => {
	fs.writeSync(
		out,
		`.em-${e.short_name} {
		background-position: -${e.sheet_x * desiredSize}px -${e.sheet_y *
			desiredSize}px;
	}`
	);
});

console.log("Created _emoji.scss");

fs.copyFileSync(
	"./node_modules/emoji-datasource/img/twitter/sheets/32.png",
	"./src/sheet.png"
);

console.log("Copied sheet.png");
