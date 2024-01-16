// Config: Node ENV
require("dotenv").config();

// Import 3rd Party Modules
var cron = require("node-cron");

// Import Files
const { changeSubdomain } = require("./subdomain.module");
const { env } = require("./config");

const schedule_string = `0 ${env.MINUTE} ${env.HOUR} * * *`;

// Schedule Tasks
cron.schedule(
	`*/50 * * * * *`, // Every 50 seconds
	async () => {
		// Tasks to be executed
		await changeSubdomain();
	},
	{
		scheduled: true,
		timezone: env.TIMEZONE, // Change this to your timezone
	}
);
