$(function() {
    var originalButtonText = "Send";

    function setLoading(isLoading) {
        var $btn = $("#btnSubmit");

        if (isLoading) {
            $btn.prop("disabled", true);
            $btn.html('<i class="fa fa-spinner fa-spin"></i> Sending...');
        } else {
            $btn.prop("disabled", false);
            $btn.html('<span class="btn-text">' + originalButtonText + '</span>');
        }
    }

    function showSuccess(message) {
        $('#success').html("<div class='alert alert-success'></div>");
        $('#success > .alert-success')
            .html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>")
            .append("<strong>" + message + "</strong>");
    }

    function showError(message) {
        $('#success').html("<div class='alert alert-danger'></div>");
        $('#success > .alert-danger')
            .html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>")
            .append("<strong>" + message + "</strong>");
    }

    $("#contactForm").on("submit", function(event) {
        event.preventDefault();

        var $form = $(this);
        var name = $.trim($("input#name").val());
        var email = $.trim($("input#email").val());
        var phone = $.trim($("input#phone").val());
        var message = $.trim($("textarea#message").val());
        var honeypot = $.trim($("input#website").val());

        if (!name || !email || !phone || !message) {
            showError("Please complete all required fields before sending.");
            return false;
        }

        // Honeypot spam protection. Real users will never fill this hidden field.
        if (honeypot !== "") {
            $('#contactForm').trigger("reset");
            return false;
        }

        setLoading(true);
        $('#success').html('');

        $.ajax({
            url: "https://formsubmit.co/ajax/quevenrecorte@gmail.com",
            method: "POST",
            dataType: "json",
            accepts: "application/json",
            data: {
                name: name,
                email: email,
                phone: phone,
                message: message,
                _subject: "New Website Inquiry - Queven Recorte",
                _template: "table",
                _captcha: "false",
                _next: "https://quevenrecorte.github.io/thank-you.html",
                _honey: honeypot
            },
            success: function(response) {
                $('#contactForm').trigger("reset");
                showSuccess("Your message has been sent. Redirecting to the thank-you page...");

                setTimeout(function() {
                    window.location.href = "thank-you.html";
                }, 1000);
            },
            error: function(xhr, status, error) {
                // If AJAX fails, fall back to normal FormSubmit submit.
                // The _next hidden field in index.html will still send users to thank-you.html.
                $form.off("submit");
                $form[0].submit();
            }
        });

        return false;
    });

    $('#name, #email, #phone, #message').focus(function() {
        $('#success').html('');
    });
});
