import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { name, email, tier, clearance, joined } = req.body;

    if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' });

    const tierColors = {
        'Explorer': '#f59e0b',
        'Pioneer': '#60a5fa',
        'Vanguard': '#c5a059'
    };

    const tierColor = tierColors[tier] || '#a1a1aa';

    const { error } = await resend.emails.send({
        from: 'SpaceX HQ <${process.env.RESEND_FROM_EMAIL}>',
        to: email,
        subject: 'Welcome to SpaceX HQ — Your Access Has Been Granted',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SpaceX HQ - Welcome</title>
</head>
<body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#111111;border-radius:8px;overflow:hidden;">
          <tr>
            <td align="center" style="padding:32px 24px 16px;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2e/SpaceX_logo_black.svg"
                   width="110" style="filter:brightness(0) invert(1);" alt="SpaceX">
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#52525b;text-transform:uppercase;letter-spacing:0.1em;">Membership Approved</p>
              <h2 style="margin:0 0 16px;font-size:24px;color:#ffffff;">Welcome, ${name}</h2>
              <p style="margin:0 0 24px;font-size:15px;color:#aaaaaa;line-height:1.5;">
                Your SpaceX HQ membership has been approved.<br>
                Here are your access details:
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <span style="font-size:11px;color:#52525b;text-transform:uppercase;letter-spacing:0.08em;">Email</span><br>
                    <span style="font-size:14px;color:#ffffff;font-family:'Courier New',monospace;">${email}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <span style="font-size:11px;color:#52525b;text-transform:uppercase;letter-spacing:0.08em;">Tier</span><br>
                    <span style="font-size:14px;font-weight:700;color:${tierColor};">${tier}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <span style="font-size:11px;color:#52525b;text-transform:uppercase;letter-spacing:0.08em;">Clearance</span><br>
                    <span style="font-size:14px;color:#ffffff;font-family:'Courier New',monospace;">${clearance}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <span style="font-size:11px;color:#52525b;text-transform:uppercase;letter-spacing:0.08em;">Member Since</span><br>
                    <span style="font-size:14px;color:#ffffff;">${joined}</span>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 24px;font-size:14px;color:#aaaaaa;line-height:1.5;">
                Use your email to sign in to the portal.<br>
                A verification code will be sent each time you log in.
              </p>
              <p style="margin:0;font-size:13px;color:#666666;">
                If you did not expect this invitation, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#0a0a0a;padding:20px;text-align:center;font-size:12px;color:#555555;">
              SpaceX HQ • Restricted Access
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    });

    if (error) return res.status(500).json({ error: 'Failed to send welcome email.' });
    return res.status(200).json({ success: true });
}
