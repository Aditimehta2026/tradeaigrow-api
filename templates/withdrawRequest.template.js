const withdrawRequestTemplate = ({ email, withdrawAmount, walletAddress }) => {
    const requestedAt = new Date().toISOString();
  
    return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
      <h2 style="margin-bottom: 12px;">New Withdraw Request</h2>
      <p>A new withdraw request has been submitted.</p>
  
      <table cellpadding="8" cellspacing="0" border="1" style="border-collapse: collapse; margin-top: 10px;">
        <tr>
          <td><strong>User Email</strong></td>
          <td>${email || '-'}</td>
        </tr>
        <tr>
          <td><strong>Withdraw Amount</strong></td>
          <td>${withdrawAmount || '-'}</td>
        </tr>
        <tr>
          <td><strong>Wallet Address</strong></td>
          <td>${walletAddress || '-'}</td>
        </tr>
        <tr>
          <td><strong>Requested At</strong></td>
          <td>${requestedAt}</td>
        </tr>
      </table>
    </div>
    `;
  };
  
  module.exports = { withdrawRequestTemplate };