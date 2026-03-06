const twilio = require('twilio');

let client;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

const sendSMS = async (to, body) => {
    try {
        if (!client) {
            console.log(`[Mock SMS] To: ${to} - Body: ${body}`);
            return;
        }

        const message = await client.messages.create({
            body: body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });
        console.log(`SMS sent: ${message.sid}`);
        return message;
    } catch (error) {
        console.error(`Error sending SMS: ${error.message}`);
    }
};

module.exports = { sendSMS };
