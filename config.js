// Config: Node ENV
require("dotenv").config();

exports.env = {
	TIMEZONE: process.env.TIMEZONE || "Asia/Dhaka",
	HOUR: process.env.HOUR || 0,
	MINUTE: process.env.MINUTE || 0,
	PHONE: process.env.PHONE,
	EMAIL: process.env.EMAIL,
	BASE_URL: process.env.BASE_URL,
	NGINX_CONF: process.env.NGINX_CONF,
};

/*
// ENVIRONMENT VARIABLES
TIMEZONE=
HOUR=
MINUTE=
PHONE=
EMAIL=
BASE_URL=
NGINX_CONF=
*/
