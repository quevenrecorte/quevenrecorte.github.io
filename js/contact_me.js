/*
 * Queven Recorte Contact Form Submit
 * For GitHub Pages + Google Apps Script Web App
 *
 * IMPORTANT:
 * 1. Deploy google-apps-script/Code.gs as a Google Apps Script Web App.
 * 2. Copy the Web App URL.
 * 3. Replace GOOGLE_APPS_SCRIPT_WEB_APP_URL below.
 */

const GOOGLE_APPS_SCRIPT_WEB_APP_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

$(function () {
    $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function ($form, event, errors) {
            // Validation errors are handled by jqBootstrapValidation.
        },
        submitSuccess: function ($form, event) {
            event.preventDefault();

            const $submitButton = $("#btnSubmit");
            const name = $("input#name").val().trim();
            const email = $("input#email").val().trim();
            const phone = $("input#phone").val().trim();
            const message = $("textarea#message").val().trim();
            let firstName = name;

            if (firstName.indexOf(" ") >= 0) {
                firstName = name.split(" ").slice(0, -1).join(" ");
            }

            if (!GOOGLE_APPS_SCRIPT_WEB_APP_URL || GOOGLE_APPS_SCRIPT_WEB_APP_URL.indexOf("PASTE_YOUR") === 0) {
                showContactAlert("danger", "Contact form is not configured yet. Please add the Google Apps Script Web App URL.");
                return;
            }

            $submitButton.prop("disabled", true).text("Sending...");

            $.ajax({
                url: GOOGLE_APPS_SCRIPT_WEB_APP_URL,
                type: "POST",
                dataType: "json",
                data: {
                    source: "quevenrecorte.github.io",
                    name: name,
                    email: email,
                    phone: phone,
                    message: message
                },
                cache: false,
                success: function (response) {
                    if (response && response.result === "success") {
                        showContactAlert("success", "Your message has been sent. Thank you!");
                        $("#contactForm").trigger("reset");
                    } else {
                        const errorMessage = response && response.message ? response.message : "The message could not be sent. Please try again.";
                        showContactAlert("danger", errorMessage);
                    }
                },
                error: function () {
                    showContactAlert("danger", "Sorry " + firstName + ", the message could not be sent right now. Please try again later.");
                },
                complete: function () {
                    $submitButton.prop("disabled", false).text("Send");
                }
            });
        },
        filter: function () {
            return $(this).is(":visible");
        }
    });

    $('a[data-toggle="tab"]').click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

$("#name").focus(function () {
    $("#success").html("");
});

function showContactAlert(type, message) {
    const alertClass = type === "success" ? "alert-success" : "alert-danger";
    const buttonHtml = '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';

    $("#success").html('<div class="alert ' + alertClass + '"></div>');
    $("#success > .alert").html(buttonHtml).append(document.createTextNode(message));
}
