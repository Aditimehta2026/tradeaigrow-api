const BRAND = 'TradeAIGrow';
const SITE_URL = 'https://www.tradeaigrow.com/auth/reset-password';

const passwordResetTemplate = (token,email) => {
  const year = new Date().getFullYear();
  const resetLink = `${SITE_URL}?token=${token}&email=${email}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset - ${BRAND}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f5f7fb;">
    <tr>
      <td align="center" style="padding:28px 14px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e8ecf3;">

          <tr>
            <td style="padding:24px 28px;background:#111827;color:#ffffff;">
              <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:0.85;margin-bottom:8px;">${BRAND}</div>
              <h1 style="margin:0;font-size:20px;line-height:1.35;font-weight:700;">Password Reset Request</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 28px 8px 28px;">
              <p style="margin:0 0 14px 0;font-size:14px;line-height:1.7;color:#334155;">
                We received a request to reset your account password.
              </p>
              <p style="margin:0 0 14px 0;font-size:14px;line-height:1.7;color:#334155;">
                Click the button below to set a new password. This link will expire in 15 minutes.
              </p>
              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.7;color:#334155;">
                If you did not request this, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 28px 20px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
                <tr>
                  <td style="padding:18px;text-align:center;">
                    <a href="${resetLink}" style="display:inline-block;padding:12px 22px;background:#f0b90b;color:#111827;text-decoration:none;font-size:14px;font-weight:700;border-radius:8px;">
                      Reset Password
                    </a>
                    <p style="margin:12px 0 0 0;font-size:12px;color:#64748b;line-height:1.6;word-break:break-all;">
                      If the button does not work, open this link:<br />
                      <a href="${resetLink}" style="color:#2563eb;text-decoration:underline;">${resetLink}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 28px 18px 28px;">
              <h2 style="margin:0 0 10px 0;font-size:15px;color:#0f172a;">Security Tips</h2>
              <ul style="margin:0;padding:0 0 0 18px;font-size:14px;line-height:1.7;color:#334155;">
                <li style="margin-bottom:8px;">Never share your password or verification code with anyone.</li>
                <li style="margin-bottom:8px;">Use a strong and unique password that you do not use anywhere else.</li>
                <li style="margin-bottom:8px;">Always verify you are on the official website before entering sensitive information.</li>
              </ul>
            </td>
          </tr>

          <tr>
            <td style="padding:0 28px 18px 28px;">
              <p style="margin:0;font-size:13px;line-height:1.7;color:#7c2d12;background:#fff7ed;border-left:4px solid #fb923c;padding:12px 14px;border-radius:0 8px 8px 0;">
                Don’t recognize this activity? Reset your password immediately and contact customer support.
              </p>
              <p style="margin:10px 0 0 0;font-size:12px;color:#64748b;">
                This is an automated message. Please do not reply.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#0f172a;padding:16px 20px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#cbd5e1;">© ${year} ${BRAND}. All Rights Reserved.</p>
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

module.exports = { passwordResetTemplate };