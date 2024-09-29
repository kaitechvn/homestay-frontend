import PAGES from "@/constants/pages"; // Assuming you have a pages constants file

export function adminGuard(to, from, next) {
  const userRole = localStorage.getItem('userRole');

  // Check if the route starts with /admin and the user is not an admin
  if (to.path.startsWith('/admin') && userRole !== 'ADMIN') {
    // Redirect to /403 if the user is not an admin
    return next(PAGES.FORBIDDEN); // Assuming PAGES.FORBIDDEN maps to "/403"
  }

  next();
}