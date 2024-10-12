$(document).ready(function () {
    $('#registrationForm').on('submit', function (event) {
        event.preventDefault();

        // Clear previous error messages
        $('.error').hide();

        // Validate inputs
        let isValid = true;

        if ($('#fullName').val().trim() === '') {
            $('#fullNameError').show();
            isValid = false;
        }

        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!emailPattern.test($('#email').val())) {
            $('#emailError').show();
            isValid = false;
        }

        // 85212345678
        const phonePattern = /^[0-9]{8}$/;
        if ($('#phone').val().trim() === '' && !phonePattern.test($('#phone').val())) {
            $('#phoneError').show();
            isValid = false;
        }

        if ($('#password').val().trim() === '') {
            $('#passwordError').show();
            isValid = false;
        }

        if (isValid) {
            const registrationData = {
                fullName: $('#fullName').val(),
                email: $('#email').val(),
                phone: $('#phone').val(),
                password: $('#password').val(),
                staffNumber: $('#staffNumber').val()
            };

            checkAndUpload(registrationData);
        }
    });

    function checkAndUpload(data) {
        $.ajax({
            url: "resources/json/user.json", type: "GET", dataType: "json", success: function (users) {
                let userExists = users.some(user => user.email === data.email);

                if (userExists) {
                    alert("User already exists!");
                } else {
                    data.userId = users.length + 1; // Increment user ID
                    // if the staffNumber is not provided, the role will be defaulted to Customer
                    if (!data.staffNumber) {
                        data.role = "Customer";
                    } else {
                        data.role = "Staff";
                    }
                    users.push(data);
                    upload(users);
                }
            }, error: function (xhr, status, error) {
                console.error("Error fetching users:", error);
                alert("There was an error processing your request.");
            }
        });
    }

    function upload(data) {
        $.ajax({
            url: "../../resources/json/user.json",
            type: "PUT",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function (response) {
                console.log("Data updated successfully:", response);
                $('#successMessage').show();
                setTimeout(function () {
                    $('#successMessage').hide();
                    window.location.href = "../../index.html";
                }, 5000);
                $('#registrationForm')[0].reset();
            },
            error: function (xhr, status, error) {
                console.error("Error updating data:", error);
                alert("Failed to update data.");
            }
        });
    }

    // Theme toggle functionality
    $('#darkModeToggle').on('click', function () {
        // on click, toggle #switch-theme class
        $('body').addClass('switch-theme');
        $('body').toggleClass('dark');
        $('.container').toggleClass('dark');
        $('input').toggleClass('dark');
    });

    // Check system preference for dark mode
    const savedTheme = localStorage.getItem('theme');
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme :dark)').matches || savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        $('body').addClass('dark');
        $('.container').addClass('dark');
        $('input').addClass('dark');
        $('body').addClass('switch-theme');
    }
});