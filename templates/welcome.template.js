const BRAND = 'TradeAIGrow';
const SITE_URL = 'https://tradeaigrow.com';

const welcomeTemplate = (activationCode) => {
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome — ${BRAND}</title>
</head>
<body style="margin:0;padding:0;background-color:#eaf4ff;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#eaf4ff;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.35);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d1b2a 0%,#1b263b 50%,#0d1b2a 100%);padding:28px 32px;text-align:center;">
              <div style="color:#e8eef5;font-size:11px;letter-spacing:3px;text-transform:uppercase;opacity:0.85;">${BRAND}</div>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="padding:32px 32px 8px 32px;text-align:center;">
              <h1 style="margin:0;font-size:24px;line-height:1.3;color:#0d1b2a;font-weight:700;">Your Crypto Journey Starts Now</h1>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:8px 32px 24px 32px;">
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.65;color:#3d4a5c;">
                Welcome to <strong style="color:#0d1b2a;">${BRAND}</strong>. Confirm your registration by using the activation code below.
              </p>
            </td>
          </tr>

          <!-- Activation code -->
          <tr>
            <td style="padding:0 32px 28px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(180deg,#f0f4f8 0%,#e8eef5 100%);border-radius:10px;border:1px solid #d4dde8;">
                <tr>
                  <td style="padding:20px 24px;text-align:center;">
                    <div style="font-size:12px;color:#5c6b7a;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:10px;">Account activation code</div>
                    <div style="font-size:32px;font-weight:700;letter-spacing:8px;color:#0d1b2a;font-family:'Courier New',Courier,monospace;">${activationCode}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Security tips -->
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <h2 style="margin:0 0 12px 0;font-size:15px;color:#0d1b2a;">Security tips</h2>
              <ul style="margin:0;padding:0 0 0 18px;color:#3d4a5c;font-size:14px;line-height:1.7;">
                <li style="margin-bottom:8px;">Never give your password to anyone.</li>
                <li style="margin-bottom:8px;">Never call any phone number from someone claiming to be ${BRAND} Customer Support.</li>
                <li style="margin-bottom:8px;">Never send any money to anyone claiming to be a member of the ${BRAND} team.</li>
                <li style="margin-bottom:8px;">Bookmark <a href="${SITE_URL}" style="color:#1e3a5f;text-decoration:underline;">${SITE_URL.replace('https://','')}</a> and use ${BRAND} Verify to check whether the ${BRAND} domain you’re visiting is genuine.</li>
                <li style="margin-bottom:0;">For more information, visit <a href="${SITE_URL}/security-tips" style="color:#1e3a5f;text-decoration:underline;">15 Tips to Enhance Security for Your ${BRAND} Account</a>.</li>
              </ul>
            </td>
          </tr>

          <!-- Alert -->
          <tr>
            <td style="padding:0 32px 24px 32px;">
              <p style="margin:0;font-size:13px;line-height:1.65;color:#5c4a3a;background-color:#fff8e6;border-left:4px solid #c9a227;padding:14px 16px;border-radius:0 8px 8px 0;">
                Don’t recognize this activity? Please reset your password and contact customer support immediately.
              </p>
              <p style="margin:12px 0 0 0;font-size:12px;color:#7a8794;">This is an automated message, please do not reply.</p>
            </td>
          </tr>

          <!-- Stay connected -->
          <tr>
            <td style="padding:8px 32px 28px 32px;text-align:center;border-top:1px solid #e8eef5;">
              <p style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#0d1b2a;">Stay connected!</p>
            </td>
          </tr>

          <!-- Disclaimers -->
          <tr>
            <td style="padding:0 28px 20px 28px;">
              <p style="margin:0 0 12px 0;font-size:11px;line-height:1.6;color:#6b7684;">
                <strong>Disclaimer:</strong> Digital asset prices are subject to high market risk and price volatility. The value of your investment may go down or up, and you may not get back the amount invested. You are solely responsible for your investment decisions and ${BRAND} is not liable for any losses you may incur. Past performance is not a reliable predictor of future performance. You should only invest in products you are familiar with and where you understand the risks. You should carefully consider your investment experience, financial situation, investment objectives and risk tolerance and consult an independent financial adviser prior to making any investment. This material should not be construed as financial advice. For more information, see our <a href="${SITE_URL}/terms" style="color:#5c6b7a;">Terms of Use</a> and <a href="${SITE_URL}/risk-warning" style="color:#5c6b7a;">Risk Warning</a>.
              </p>
              <p style="margin:0 0 12px 0;font-size:11px;line-height:1.6;color:#6b7684;">
                <strong>Kindly note:</strong> Please be aware of phishing sites and always make sure you are visiting the official <a href="${SITE_URL}" style="color:#5c6b7a;">${SITE_URL.replace('https://','')}</a> website when entering sensitive data.
              </p>
              <p style="margin:0;font-size:11px;line-height:1.6;color:#6b7684;">
                You have received this email as a registered user of ${SITE_URL.replace('https://','')}<br />
                For more information about how we process data, please see our <a href="${SITE_URL}/privacy" style="color:#5c6b7a;">Privacy policy</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0d1b2a;padding:20px 24px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#8a9aaa;">© ${year} ${SITE_URL.replace('https://','')}, All Rights Reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

module.exports = { welcomeTemplate };