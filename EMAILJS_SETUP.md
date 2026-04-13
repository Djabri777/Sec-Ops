# EmailJS Setup Instructions

## Steps to Enable Contact Form Email Functionality

1. **Create EmailJS Account**
   - Go to [EmailJS.com](https://www.emailjs.com/)
   - Sign up for a free account

2. **Add Email Service**
   - Go to Email Services
   - Click "Add New Service"
   - Choose "Gmail" and connect your Gmail account (gabiselt777@gmail.com)
   - Note the **SERVICE_ID** (e.g., "service_abc123")

3. **Create Email Template**
   - Go to Email Templates
   - Click "Create New Template"
   - Use this template:

```
Subject: New Contact Form Submission from {{from_name}}

From: {{from_name}}
Email: {{from_email}}
Company: {{company}}
Phone: {{phone}}
Service Interest: {{service_type}}

Message:
{{message}}
```

   - Save and note the **TEMPLATE_ID** (e.g., "template_xyz789")

4. **Get Public Key**
   - Go to Account > General
   - Copy your **PUBLIC_KEY** (e.g., "user_AbC123XyZ")

5. **Update ContactPage.jsx**
   - Open `src/pages/ContactPage.jsx`
   - Find line 46-50 where it says:
   ```javascript
   await emailjs.send(
     'YOUR_SERVICE_ID',
     'YOUR_TEMPLATE_ID',
     templateParams,
     'YOUR_PUBLIC_KEY'
   );
   ```
   - Replace the placeholders with your actual values:
   ```javascript
   await emailjs.send(
     'service_abc123',      // Your SERVICE_ID
     'template_xyz789',     // Your TEMPLATE_ID
     templateParams,
     'user_AbC123XyZ'       // Your PUBLIC_KEY
   );
   ```

6. **Test**
   - Run `npm run dev` to test locally
   - Submit a test message through the contact form
   - Check your email at gabiselt777@gmail.com

7. **Deploy**
   - Run `npm run deploy` to publish to GitHub Pages

## Email Will Contain:
- Sender's name
- Sender's email
- Company name
- Phone number
- Service type requested
- Message content

All messages will be sent to: **gabiselt777@gmail.com**
