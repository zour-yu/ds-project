exports.sendSMS = async (phone, message) => {
  try {
    console.log(`SMS sent to ${phone}: ${message}`);
  } catch (err) {
    console.error("SMS error:", err.message);
  }
};