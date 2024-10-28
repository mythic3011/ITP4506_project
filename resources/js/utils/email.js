export async function sendResetEmail(email, token) {
  // In a real application, integrate with an email service
  // This is a mock implementation for demo purposes
  console.log(`Password reset email sent to ${email} with token: ${token}`);
  return true;
}