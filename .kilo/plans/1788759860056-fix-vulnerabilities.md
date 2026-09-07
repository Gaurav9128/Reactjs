# Fix Security Vulnerabilities

## Context
The `reactworkshop.md` documents reconnaissance on a deployed Vercel site. Cross-checking against the local source code revealed actual security issues in the project itself, primarily broken access control and client-side-only trust.

## Vulnerabilities Found

1. **Admin API routes have no authentication**
   - `server.js` mounts `/api/admin/student`, `/api/admin/students`, `/api/admin/dashboard` without any auth middleware.
   - `server/routes/adminDashboardRoutes.js` exposes stats and attendance without verifying the caller.

2. **Empty roleMiddleware.js**
   - File exists but has 0 lines of implementation. No role checks anywhere.

3. **Client-side-only route protection**
   - `PrivateRoute.jsx` only checks `localStorage.getItem("token")`.
   - `App.jsx` admin routes (`/admin/*`) are completely unprotected on the client.

4. **JWT stored in localStorage**
   - Both student and admin JWTs are stored in `localStorage`, making them XSS-stealable.

5. **No rate limiting on login endpoints**
   - `/api/auth/login` and `/api/admin/login` are vulnerable to brute-force.

6. **Overly permissive CORS**
   - `app.use(cors())` with no origin restrictions.

7. **IDOR / missing authorization on admin student routes**
   - `getStudentDetails` and `deleteStudent` use `req.params.studentId` directly. While intended for admins, there is no server-side check that the caller is an admin.

8. **ReDoS in searchStudents**
   - User input is passed directly into a regex without sanitization.

9. **No security headers**
   - No Helmet, CSP, HSTS, or X-Frame-Options.

10. **Duplicate route mounting**
    - `adminStudentRoutes` mounted at both `/api/admin/student` and `/api/admin/students`.

## Plan

### Task 1: Implement auth middleware and protect admin routes
- Implement `roleMiddleware.js` with `requireAuth` and `requireRole('admin')`.
- Update `server.js` to apply `authMiddleware` to all admin route groups: `/api/admin`, `/api/admin/dashboard`, `/api/admin/student(s)`.

### Task 2: Add server-side admin route protection in React
- Create `AdminRoute.jsx` (client-side guard) and wrap all `/admin/*` routes in `App.jsx`.

### Task 3: Add rate limiting
- Add `express-rate-limit` to `/api/auth/login` and `/api/admin/login` (max 5 attempts per 15 minutes).

### Task 4: Restrict CORS
- Configure CORS with explicit allowed origins from `.env` (`CLIENT_URL`, `ADMIN_URL`).

### Task 5: Add authorization checks to admin controllers
- In `adminStudentController.js`, verify `req.user.role === 'admin'` before allowing access.
- In `adminDashboardController.js`, verify admin role.

### Task 6: Add input sanitization
- Sanitize regex inputs in `searchStudents` (escape regex special chars or use `$regex` safely).
- Add express-validator or manual sanitization to all query/body inputs.

### Task 7: Add security headers
- Add `helmet` middleware in `server.js`.

### Task 8: Fix duplicate route mounting
- Remove duplicate `app.use("/api/admin/student", ...)` line in `server.js`.

### Task 9: Remove exposed sensitive info from client bundle
- Ensure no secrets/keys are embedded in client-side code.

## Validation
- Test that unauthenticated requests to `/api/admin/*` return 401.
- Test that non-admin users cannot access admin routes.
- Test that brute-force login attempts are rate-limited.
- Verify CORS rejects unknown origins.

## Risks
- Rate limiting may affect legitimate users during testing; keep limits configurable via `.env`.
- Role checks require the `Admin` model to have a `role` field (confirmed present in `adminController.js`).
