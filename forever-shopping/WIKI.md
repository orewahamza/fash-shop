# User Type Toggle Feature

## Overview
This feature allows users to switch between "user" and "host" roles within the application.
It provides a dedicated "Host Panel" for users with the `host` type.

## User Types
- **user**: Standard user with access to shopping features.
- **host**: User with access to the Host Panel for managing resources.

## Implementation Details

### Database
- `userModel.js`: Added `type` (user/host), `type_changed_at` (Date), `type_changed_by` (ObjectId).
- `auditLogModel.js`: Logs all user type changes.

### Backend API
- `POST /api/user/change-type`: Changes user type. Requires `password` and `requestedType`.
- Emits `UserTypeChanged` domain event.
- Validates active resources before downgrading from host to user.

### Frontend
- **Navbar**: Displays "Host Panel" link for host users.
- **SettingsModal**: Allows toggling user type via a password-protected modal.
- **ShopContext**: Manages `userType` state and persists it to localStorage.
- **AdminPanel**: Protects route access for non-host users (403 Forbidden).

## Access Control
- Only users with `type: 'host'` can access `/admin-panel` and related routes.
- Attempts to access these routes directly result in a 403 Forbidden page.

## Toggle Process
1. User clicks "Become a Host" or "Switch to Normal User" in Settings.
2. User enters password to confirm.
3. Server validates password and updates user type.
4. Server emits `UserTypeChanged` event.
5. Server returns updated user type and token.
6. Frontend updates state and UI reflects the change immediately.

## Testing
- Backend tests: `tests/user_type.test.js` covers registration, type change, validation, and profile retrieval.
- Frontend tests: `tests/integration.test.jsx` covers UI rendering and route protection.

## Migration
Run `node scripts/migrateUserType.js` to initialize the `type` field for existing users.
