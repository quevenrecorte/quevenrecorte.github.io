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

    $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            setLoading(false);
        },
        submitSuccess: function($form, event) {
            event.preventDefault();

            var name = $.trim($("input#name").val());
            var email = $.trim($("input#email").val());
            var phone = $.trim($("input#phone").val());
            var message = $.trim($("textarea#message").val());
            var honeypot = $.trim($("input#website").val());

            // Honeypot spam protection. Real users will never fill this hidden field.
            if (honeypot !== "") {
                $('#contactForm').trigger("reset");
                return false;
            }

            var firstName = name;
            if (firstName.indexOf(" ") >= 0) {
                firstName = name.split(" ").slice(0, -1).join(" ");
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
                    _honey: honeypot
                },
                success: function(response) {
                    $('#contactForm').trigger("reset");
                    showSuccess("Your message has been sent. Redirecting to the thank-you page...");

                    setTimeout(function() {
                        window.location.href = "thank-you.html";
                    }, 1200);
                },
                error: function(xhr, status, error) {
                    setLoading(false);
                    showError("Sorry " + firstName + ", your message could not be sent. Please try again later.");
                }
            });
        },
        filter: function() {
            return $(this).is(":visible");
        }
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

$('#name, #email, #phone, #message').focus(function() {
    $('#success').html('');
});
