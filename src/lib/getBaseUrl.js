export function getBaseUrl() {
  if (process.env.NODE_ENV === "production") {
    // Replace with the actual Vercel deployment URL once available
    return "<the url vercel will provide>";
  }
  return "http://localhost:3000";
}


