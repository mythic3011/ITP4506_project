// // forget-password.js
// $(document).ready(function () {
//     $('#recoveryForm').on('submit', function (event) {
//         event.preventDefault();
//
//         const email = $('#email').val().trim();
//         const $terms = $('#terms').prop('checked');
//
//         if (!email) {
//             $('#emailError').show();
//             isValid = false;
//         }
//
//         if (!$terms) {
//             $('#termsError').show();
//             isValid = false;
//         }
//
//         if (isValid) {
//             const recoveryData = {
//                 email: email,
//                 terms: $terms
//             };
//
//             checkAndUpload(recoveryData);
//         }
//     });
//
//     function checkisExist(data) {
//         $.ajax({
//             url: "resources/json/user.json", type: "GET", dataType: "json", success: function (users) {
//                 let userExists = users.some(user => user.email === data.email);
//
//                 if (userExists) {
//                     //
//                 }