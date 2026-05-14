export const welcomeTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Inter', system-ui, sans-serif; background: #050505; color: #ffffff; margin: 0; padding: 40px; }
        .container { max-width: 600px; margin: 0 auto; background: #0f0f0f; border: 1px solid #1a1a1a; border-radius: 24px; overflow: hidden; }
        .header { padding: 40px; text-align: center; border-bottom: 1px solid #1a1a1a; }
        .content { padding: 40px; text-align: left; }
        .footer { padding: 24px; text-align: center; font-size: 11px; color: #52525b; border-top: 1px solid #1a1a1a; }
        h1 { font-size: 24px; font-weight: 600; margin-bottom: 16px; letter-spacing: -0.02em; }
        p { font-size: 15px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px; }
        .btn { display: inline-block; padding: 12px 24px; background: #ffffff; color: #000000; text-decoration: none; border-radius: 12px; font-weight: 600; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.1em; color: #52525b;">WELCOME TO SPACEX</span>
        </div>
        <div class="content">
            <h1>Welcome to the Fleet, ${name}</h1>
            <p>Your Access granted. Your [SpaceX/Tesla] Member Portal is now online. Use it to schedule your next private meeting, find local meetups, or access exclusive member documents and more.</p>
            <a href="#" class="btn">Access Portal</a>
        </div>
        <div class="footer">
            &copy; 2026 SpaceX Member Operations
        </div>
    </div>
</body>
</html>
`;
