
const getPasswordResetTemplate = (name, resetUrl, isGoogleAuth = false, supportEmail = "support@forevershopping.com") => {
    const title = isGoogleAuth ? "Create Your Password" : "Reset Your Password";
    const buttonText = isGoogleAuth ? "Create Password" : "Reset Password";
    const messageText = isGoogleAuth 
        ? "You are receiving this email to create a password for your account (originally signed up via Google). Please click the button below to set your password."
        : "We received a request to reset the password for your Forever Shopping account. If you made this request, please click the button below to choose a new password.";

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #000000;
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            font-weight: bold;
        }
        .message {
            margin-bottom: 25px;
            color: #555555;
            font-size: 16px;
        }
        .button-container {
            text-align: center;
            margin: 35px 0;
        }
        .button {
            background-color: #000000;
            color: #ffffff !important;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            display: inline-block;
            transition: background-color 0.3s;
            font-size: 16px;
        }
        .button:hover {
            background-color: #333333;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            padding: 15px;
            border-radius: 4px;
            font-size: 14px;
            margin-bottom: 25px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #888888;
            border-top: 1px solid #eeeeee;
        }
        .footer a {
            color: #000000;
            text-decoration: underline;
        }
        .link-text {
            word-break: break-all;
            font-size: 12px;
            color: #888888;
            margin-top: 10px;
            padding: 10px;
            background: #f9f9f9;
            border-radius: 4px;
        }
        @media only screen and (max-width: 480px) {
            .content {
                padding: 20px;
            }
            .button {
                display: block;
                width: 100%;
                text-align: center;
                box-sizing: border-box;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Forever Shopping</h1>
        </div>
        <div class="content">
            <div class="greeting">Hello ${name},</div>
            <p class="message">
                ${messageText}
            </p>
            
            <div class="button-container">
                <a href="${resetUrl}" class="button">${buttonText}</a>
            </div>

            <div class="warning">
                <strong>Security Notice:</strong> This link will expire in 15 minutes. 
                If you did not request this, please ignore this email or contact support immediately.
            </div>

            <p class="message" style="font-size: 14px;">
                If the button above doesn't work, copy and paste the following link into your browser:
            </p>
            <div class="link-text">
                ${resetUrl}
            </div>
        </div>
        <div class="footer">
            <p>
                Need help? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>
            </p>
            <p>
                &copy; ${new Date().getFullYear()} Forever Shopping. All rights reserved.<br>
                123 Fashion Street, Style City, SC 12345
            </p>
            <p style="font-size: 10px; margin-top: 10px;">
                This is an automated message, please do not reply directly to this email.
            </p>
        </div>
    </div>
</body>
</html>
    `;
};

export { getPasswordResetTemplate };
