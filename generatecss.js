const emojis = require("emoji-datasource/emoji.json");
const fs = require("fs");

let out = fs.openSync("./src/scss/core/_emoji.scss", "w");

const size = 34;

fs.writeSync(
	out,
	`
.em {
	background: url("../../sheet.png") no-repeat;
	width: ${size}px;
	height: ${size}px;
	display: inline-block;
	text-indent: -9999px;
	cursor: pointer;
}
`
);

emojis.forEach(e => {
	fs.writeSync(
		out,
		`
	.em-${e.short_name} {
		background-position: -${e.sheet_x * size}px -${e.sheet_y * size}px;
	}`
	);
});

console.log("Created _emoji.scss");

fs.copyFileSync(
	"./node_modules/emoji-datasource/img/twitter/sheets/32.png",
	"./src/sheet.png"
);

console.log("Copied sheet.png");
