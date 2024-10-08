const emailStyles = () => `
  body{font-family:Arial,sans-serif;background-color:#f9f9f9;margin:0;padding:0;color:#202124}
  .container{max-width:600px;margin:50px auto;background-color:#fff;padding:40px;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.1)}
  h1{font-size:24px;color:#1a73e8;margin-bottom:24px}
  p{font-size:16px;line-height:1.5;color:#5f6368}
  a.verify-button{display:inline-block;background-color:#1a73e8;color:#fff;padding:12px 24px;text-decoration:none;font-size:14px;font-weight:bold;border-radius:4px;margin-top:24px}
  a.verify-button:hover{background-color:#1558b6}
  footer{margin-top:40px;font-size:12px;color:#5f6368}
`;

export const getVerifyEmailTemplate = (url: string) => ({
  subject: 'Verify Your Email Address',
  text: `To complete the process, please click the link below to verify your email address: ${url}`,
  html: `
    <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Verify Your Email Address</title><style>${emailStyles()}</style></head><body><div class="container"><h1>Verify Your Email Address</h1><p>Hi,</p><p>We received a request to use this email address for your new account. If you made this request, please click the button below to verify your email address:</p><a href="${url}" class="verify-button">Verify Email</a><p>If you didn’t make this request, you can safely ignore this email.</p><footer><p>Thank you,</p></footer></div></body></html>
  `,
});

export const getPasswordResetEmailTemplate = (url: string) => ({
  subject: 'Reset Your Password',
  text: `It seems like you requested a password reset. Click the link below to reset your password: ${url}`,
  html: `
    <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Reset Your Password</title><style>${emailStyles()}</style></head><body><div class="container"><h1>Reset Your Password</h1><p>Hi,</p><p>It looks like you requested a password reset. If you did, please click the button below to reset your password:</p><a href="${url}" class="verify-button">Reset Password</a><p>If you didn't request this, you can safely ignore this email.</p><footer><p>Thank you,</p></footer></div></body></html>
  `,
});
