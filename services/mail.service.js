const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ to, subject, html }) => {
  const { data, error } = await resend.emails.send({
    from: 'TradeAIGrow <noreply@tradeaigrow.com>',
    to,
    subject,
    html
  });

  if (error) throw new Error(error.message || 'Resend failed');
  return data;
};

module.exports = { sendMail };