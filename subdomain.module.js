const { writeFile } = require("fs/promises");
// const { v4: uuidv4 } = require("uuid");
const { env } = require("./config");
const { exec } = require("child_process");
const shortid = require("shortid");

const generateSubdomain = () => shortid.generate();

const newSubdomain = () => `${generateSubdomain()}.${env.BASE_URL}`;

exports.changeSubdomain = async () => {
	if (env.NGINX_CONF === undefined) {
		console.error("NGINX Configuration is not yet implemented.");
		return;
	}
	const newSub = newSubdomain();

	const nginxConfig = `
server {
	listen 80;
	listen [::]:80;

	server_name ${newSub};

	root /var/www/pos;
	index index.html;

	location / {
			try_files $uri $uri/ /index.html =404;
	}
}
`;

	await writeFile(env.NGINX_CONF, nginxConfig);
	await restartNGINX(newSub);
};

const configSSL = async (newSub) => {
	exec(`certbot --nginx -d  ${newSub}`, async (err, stdout) => {
		if (err) {
			console.error(err);
			return await restartNGINX();
		}
		console.log("Added Certification and shifted to", `https://${newSub}`);
		if (env.EMAIL) {
			await this.sendEmail(
				env.EMAIL,
				"Subdomain Changed",
				`Changed Subdomain to ${newSub}`
			);
		}
		if (env.PHONE) {
			await this.sendSMS(env.PHONE, `Changed Subdomain to ${newSub}`);
		}
	});
};

const restartNGINX = async (newSub, cert = false) => {
	exec("systemctl restart nginx", async (err, stdout) => {
		if (err) {
			console.error(err);
			return await restartNGINX();
		}
		console.log("Changed Subdomain to", `http://${newSub}`);
		if (cert) await configSSL(newSub);
		else {
			if (env.EMAIL) {
				await this.sendEmail(
					env.EMAIL,
					"Subdomain Changed",
					`Changed Subdomain to ${newSub}`
				);
			}
			if (env.PHONE) {
				await this.sendSMS(env.PHONE, `Changed Subdomain to ${newSub}`);
			}
		}
	});
};

exports.sendEmail = async (email, subject, message) => {
	console.log(
		"Sendine Email to",
		email,
		"With Subject: '",
		subject,
		"' and Message: '",
		message,
		"'."
	);
};

exports.sendSMS = async (phone, message) => {
	console.log("Sending SMS to", phone, "with Message: '", message, "'.");
};
