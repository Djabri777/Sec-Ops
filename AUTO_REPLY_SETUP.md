# Auto-Reply Email Setup

## Current Status
The contact form now sends TWO emails:
1. **Admin Notification** → gabiselt777@gmail.com (✅ Working)
2. **Auto-Reply to Client** → Client's email address (⚠️ Needs template setup)

## Steps to Enable Auto-Reply

### 1. Create Auto-Reply Template in EmailJS

1. Go to [EmailJS.com](https://www.emailjs.com/) and sign in
2. Navigate to **Email Templates**
3. Click **Create New Template**
4. Configure the template:

#### Template Settings:
- **Template Name**: Client Auto-Reply
- **To Email**: `{{from_email}}`
- **From Name**: SecOps Team
- **Subject**: `Thank you for contacting SecOps!`

#### Template Content:
```
Hello {{from_name}},

Thank you for reaching out to SecOps! We have received your message regarding {{service_type}}.

Your Message:
{{message}}

Our team will review your inquiry and get back to you within 24 hours. We appreciate your interest in our cybersecurity services.

If you have any urgent concerns, please call us at +213 665 869 346.

Best regards,
SecOps Team
gabiselt777@gmail.com

---
This is an automated confirmation email. Please do not reply to this message.
```

5. **Save** the template and copy the **Template ID** (e.g., `template_abc123`)

### 2. Update ContactPage.jsx

1. Open `src/pages/ContactPage.jsx`
2. Find line 66: `'YOUR_AUTO_REPLY_TEMPLATE_ID',`
3. Replace with your actual template ID:
   ```javascript
   'template_abc123',  // Your auto-reply template ID
   ```

### 3. Test and Deploy

```bash
npm run dev
```

Test the contact form and verify:
- ✅ You receive admin notification at gabiselt777@gmail.com
- ✅ Client receives auto-reply at their submitted email

Then deploy:
```bash
npm run deploy
```

## How It Works

When a user submits the contact form:

1. **First Email** (Admin Notification):
   - Sent to: `gabiselt777@gmail.com`
   - Template: `template_v5ke184`
   - Contains: All form data for you to review

2. **Second Email** (Auto-Reply):
   - Sent to: User's email (`{{from_email}}`)
   - Template: Your new auto-reply template
   - Contains: Confirmation message to the user

## Template Variables Available

These variables are sent with both emails:
- `{{from_name}}` - Client's name
- `{{from_email}}` - Client's email
- `{{company}}` - Company name (or "N/A")
- `{{phone}}` - Phone number
- `{{service_type}}` - Selected service type
- `{{message}}` - Client's message

## Error Handling

The form will still work even if:
- Auto-reply template isn't set up yet (only admin email will send)
- One email fails (the other will still send)
- EmailJS has temporary issues (error message shown to user)
