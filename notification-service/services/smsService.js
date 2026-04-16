const axios = require("axios");

exports.sendSMS = async (phone, message) => {
  try {
    const params = new URLSearchParams();

    params.append("user_id", process.env.NOTIFY_API_KEY);
    params.append("sender_id", process.env.NOTIFY_SENDER_ID);
    params.append("to", phone);
    params.append("message", message);

    const response = await axios.post(
      "https://app.notify.lk/api/v1/send",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    console.log("Notify.lk response:", response.data);

  } catch (err) {
    console.error("Notify.lk error:", err.response?.data || err.message);
  }
};