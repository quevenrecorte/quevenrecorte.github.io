/**
 * Queven Recorte Contact Form Receiver
 * Deploy this file as a Google Apps Script Web App.
 * Execute as: Me
 * Who has access: Anyone
 */

const RECIPIENT_EMAIL = "quevenrecorte@gmail.com";
const EMAIL_SUBJECT = "New message from Queven Recorte website";

function doPost(e) {
  try {
    const data = e.parameter || {};

    const name = sanitize_(data.name);
    const email = sanitize_(data.email);
    const phone = sanitize_(data.phone);
    const message = sanitize_(data.message);
    const source = sanitize_(data.source || "quevenrecorte.github.io");

    if (!name || !email || !message) {
      return json_({
        result: "error",
        message: "Please complete the required fields."
      });
    }

    const body = [
      "You received a new message from your Queven Recorte website.",
      "",
      "Name: " + name,
      "Email: " + email,
      "Phone: " + (phone || "N/A"),
      "Source: " + source,
      "Date: " + new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }),
      "",
      "Message:",
      message
    ].join("\n");

    MailApp.sendEmail({
      to: RECIPIENT_EMAIL,
      subject: EMAIL_SUBJECT,
      body: body,
      replyTo: email,
      name: "Queven Recorte Website"
    });

    return json_({
      result: "success",
      message: "Message sent successfully."
    });
  } catch (error) {
    return json_({
      result: "error",
      message: error.toString()
    });
  }
}

function doGet() {
  return json_({
    result: "success",
    message: "Queven Recorte contact form receiver is running."
  });
}

function sanitize_(value) {
  return String(value || "").trim();
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
