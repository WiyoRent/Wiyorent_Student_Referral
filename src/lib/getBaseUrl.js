export function getBaseUrl() {
  if (process.env.NODE_ENV === "production") {
    return "https://wiyorent-student-referral.vercel.app/";
  }
  return "http://localhost:3000";
}


