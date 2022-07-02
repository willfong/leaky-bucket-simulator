import express from "express";
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));

let buckets = {};

const MAX_BUCKET_SIZE = 40;
const BUCKET_FILL_RATE_PER_SECOND = 2;

const filler = (id) => {
	buckets[id].timer = setTimeout(() => {
		buckets[id].requests += BUCKET_FILL_RATE_PER_SECOND;
		console.log(
			`[BUCKET ${id}]: Added ${BUCKET_FILL_RATE_PER_SECOND} - Size now: ${buckets[id].requests}/${MAX_BUCKET_SIZE}`
		);
		if (buckets[id].requests < MAX_BUCKET_SIZE) {
			filler(id);
		} else {
			console.log(`[BUCKET ${id}]: FULL`);
			buckets[id].requests = MAX_BUCKET_SIZE;
			buckets[id].timer = undefined;
		}
	}, 5000);
};

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.get("/bucket/:id", (req, res) => {
	const id = req.params.id;
	if (!(id in buckets)) {
		console.log(`New Bucket: ${id}`);
		buckets[id] = { requests: MAX_BUCKET_SIZE, timer: undefined };
	}
	if (buckets[id].requests > 0) {
		res.send(`Hello Bucket ${id}`);
		buckets[id].requests--;
		if (!buckets[id].timer) {
			console.log("starting filler");
			filler(id);
		}
	} else {
		res.status(429).send("Too Many Requests");
	}
});

app.get("/error", (req, res) => {
	throw new Error("Error was intentionally thrown");
});

app.use((req, res) => {
	res.status(404).send("404 Not Found");
});

app.use((err, req, res) => {
	console.error(err.stack);
	res.status(500).send("500 Internal Server Error");
});

app.listen(3000, () => {
	console.log("Listening on port 3000");
});
