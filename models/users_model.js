const table_name = "g01_users";

exports.table_name = table_name;

const g01_id = "g01_id";
const g01_user = "g01_user";
const g01_password = "g01_password";
const g01_email = "g01_email";

exports.g01_id = g01_id;
exports.g01_user = g01_user;
exports.g01_password = g01_password;
exports.g01_email = g01_email;

exports.rules = {
	required: [g01_id, g01_user, g01_password, g01_email], 
	integer: [g01_id], 
	text: [g01_user, g01_password, g01_email]
};


exports.labels = {
	g01_id: "ID",
	g01_user: "User name",
	g01_password: "Password",
	g01_email: "Email"
};
