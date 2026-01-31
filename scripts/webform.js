/**
 * Google Apps Script for Psychotherapy Website Contact Form
 * 
 * This script handles form submissions from the website contact form.
 * It sends two emails:
 * 1. Notification to the therapist (jennifer.wei.du@gmail.com)
 * 2. Auto-reply confirmation to the client
 * 
 * Deploy this as a Web App with "Anyone" access to receive form submissions.
 * 
 * Current deployment URL:
 * https://script.google.com/macros/s/AKfycbyFJsHWzGDmfCUakE-hE5N_-zziuCUhI75VdCnIbI4whR8BgRADSjXJUoxuqgZB7vfQuA/exec
 */

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const formData = JSON.parse(e.postData.contents);
    
    // Extract form fields
    const name = formData.from_name;
    const email = formData.reply_to;
    const phone = formData.phone || 'Not provided';
    const subject = formData.subject;
    const message = formData.message;
    
    // Email 1: Send notification to therapist
    const therapistEmail = 'jennifer.wei.du@gmail.com';
    const therapistSubject = 'New Contact Form Submission: ' + subject;
    const therapistBody = 
`You have received a new message from your website contact form.

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}

---
This email was sent from your website contact form.`;
    
    GmailApp.sendEmail(therapistEmail, therapistSubject, therapistBody);
    
    // Email 2: Send auto-reply to client
    const clientSubject = 'Thank you for contacting Wei Du - Counsellor/Psychotherapist';
    const clientBody = 
`Dear ${name},

Thank you for reaching out to me. 
I have received your inquiry and will respond within 24 hours, Monday to Friday.

If you have any urgent concerns, 
feel free to contact me directly at jennifer.wei.du@gmail.com or 07840 232 467.

Best regards,
Wei Du
Registered Counsellor/Psychotherapist`;
    
    GmailApp.sendEmail(email, clientSubject, clientBody);
    
    // Optional: Log to Google Sheet
    // Uncomment the line below if you want to log submissions to a spreadsheet
    // logToSheet(name, email, phone, subject, message);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Emails sent successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Optional function to log form submissions to a Google Sheet
 * Create a spreadsheet and replace SPREADSHEET_ID with your actual ID
 */
function logToSheet(name, email, phone, subject, message) {
  const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your spreadsheet ID
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
  const timestamp = new Date();
  
  sheet.appendRow([timestamp, name, email, phone, subject, message]);
}
