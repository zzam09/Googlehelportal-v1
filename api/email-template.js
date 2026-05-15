// api/email-template.js

export function getEmailTemplate({
  title = "Mission Update",
  mainMessage = "",
  buttonText = "LEARN MORE",
  buttonUrl = "#",
  heroImage = "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1200&q=80"
}) {

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${title}</title>
  <style>
    html, body { margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important; }
    * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; box-sizing: border-box; }
    table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
    img { -ms-interpolation-mode: bicubic; max-width: 100%; height: auto; display: block; }

    .heading-technical {
      font-family: 'Arial Black', sans-serif;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .body-technical {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    :root { color-scheme: light dark; }

    /* Light Mode */
    .bg-main { background-color: #ffffff !important; }
    .text-primary { color: #000000 !important; }
    .text-secondary { color: #555555 !important; }
    .border-accent { border: 1px solid #000000 !important; }
    .btn-bg { background-color: #000000 !important; }
    .btn-text { color: #ffffff !important; }

    /* Dark Mode */
    @media (prefers-color-scheme: dark) {
      .bg-main { background-color: #000000 !important; }
      .text-primary { color: #ffffff !important; }
      .text-secondary { color: #86868B !important; }
      .border-accent { border: 1px solid #ffffff !important; }
      .btn-bg { background-color: #ffffff !important; }
      .btn-text { color: #000000 !important; }
    }

    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body class="bg-main" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly;">
  <center class="bg-main" style="width: 100%;">
    <!--[if mso]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" align="center"><tr><td>
    <![endif]-->
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="email-container bg-main" style="margin: 0 auto;">
      
      <!-- HEADER -->
      <tr>
        <td style="padding: 40px;" class="mobile-padding">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td align="left" class="heading-technical text-primary" style="font-size: 20px; font-weight: 900;">
                SPACEX
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- HERO IMAGE -->
      <tr>
        <td style="padding: 0 40px;" class="mobile-padding">
          <img src="${heroImage}" width="520" alt="SpaceX Mission" style="width: 100%; border: 0;" />
        </td>
      </tr>

      <!-- CONTENT -->
      <tr>
        <td style="padding: 40px;" class="mobile-padding">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td class="heading-technical text-primary" style="font-size: 24px; font-weight: bold; padding-bottom: 16px;">
                ${title}
              </td>
            </tr>
            <tr>
              <td class="body-technical text-secondary" style="font-size: 15px; line-height: 24px; padding-bottom: 32px;">
                ${mainMessage}
              </td>
            </tr>
            <!-- BUTTON -->
            <tr>
              <td align="left">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td class="btn-bg border-accent" style="padding: 14px 30px; text-align: center;">
                      <a href="${buttonUrl}" class="heading-technical btn-text" style="font-size: 12px; font-weight: bold; text-decoration: none;">
                        ${buttonText}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="padding: 60px 40px 40px 40px; border-top: 1px solid #333333;" class="mobile-padding">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td class="heading-technical text-secondary" style="font-size: 11px; padding-bottom: 12px;" align="center">
                © 2026 SPACEX. ALL RIGHTS RESERVED.
              </td>
            </tr>
            <tr>
              <td class="heading-technical" style="font-size: 11px; padding-bottom: 12px;" align="center">
                <a href="#" class="text-primary" style="text-decoration: none;">UNSUBSCRIBE</a> 
                <span style="padding: 0 8px; color: #555555;">•</span> 
                <a href="#" class="text-primary" style="text-decoration: none;">PRIVACY</a>
              </td>
            </tr>
            <tr>
              <td class="heading-technical" style="font-size: 11px; color: #555555;" align="center">
                HAWTHORNE, CALIFORNIA
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>
    
    <!--[if mso]>
    </td></tr></table>
    <![endif]-->
  </center>
</body>
</html>`;
}
