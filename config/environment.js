const dotenv = require("dotenv");
dotenv.config();

const development = {
  name: "Development",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "himanshubarde2001",
      pass: process.env.PASS,
    },
  },
  google_client_id: process.env.ID,
  google_client_secret: process.env.SECRET,
  google_callback_URL: process.env.URL,
};

const production = {
  name: "Production",
};

module.exports = development;
