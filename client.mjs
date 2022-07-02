import axios from "axios";

const args = process.argv.slice(2);
if (args.length !== 1) {
	console.log("Usage: node client.mjs <number of requests>");
	process.exit(1);
}
const runs = parseInt(args[0]);

for (let i = 0; i < runs; i++) {
	axios.get("http://localhost:3000/bucket/123").catch((e) => {});
}
