$(function() {
    $("#contactForm input,#contactForm textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // Additional error messages or events can be added here.
        },
        submitSuccess: function($form, event) {
            event.preventDefault();

            var $btn = $("#btnSubmit");
            $btn.prop("disabled", true);

            var name = $.trim($("input#name").val());
            var email = $.trim($("input#email").val());
            var phone = $.trim($("input#phone").val());
            var message = $.trim($("textarea#message").val());

            var firstName = name;
            if (firstName.indexOf(" ") >= 0) {
                firstName = name.split(" ").slice(0, -1).join(" ");
            }

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
                    _captcha: "false"
                },
                success: function(response) {
                    $btn.prop("disabled", false);

                    $('#success').html("<div class='alert alert-success'></div>");
                    $('#success > .alert-success')
                        .html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>")
                        .append("<strong>Your message has been sent.</strong>");

                    $('#contactForm').trigger("reset");
                },
                error: function(xhr, status, error) {
                    $btn.prop("disabled", false);

                    $('#success').html("<div class='alert alert-danger'></div>");
                    $('#success > .alert-danger')
                        .html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>")
                        .append("<strong>Sorry " + firstName + ", your message could not be sent. Please try again later.</strong>");
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

$('#name').focus(function() {
    $('#success').html('');
});
