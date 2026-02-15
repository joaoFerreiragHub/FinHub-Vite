import { UserRole } from '@/features/auth/types'
import {
  Permission,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isRoleAtLeast,
} from '@/lib/permissions/config'

describe('Permission system', () => {
  describe('hasPermission', () => {
    it('visitors can view public articles', () => {
      expect(hasPermission(UserRole.VISITOR, Permission.VIEW_ARTICLES)).toBe(true)
    })

    it('visitors cannot follow creators', () => {
      expect(hasPermission(UserRole.VISITOR, Permission.FOLLOW_CREATORS)).toBe(false)
    })

    it('free users can follow creators', () => {
      expect(hasPermission(UserRole.FREE, Permission.FOLLOW_CREATORS)).toBe(true)
    })

    it('free users cannot view premium articles', () => {
      expect(hasPermission(UserRole.FREE, Permission.VIEW_ARTICLES_PREMIUM)).toBe(false)
    })

    it('premium users can view premium content', () => {
      expect(hasPermission(UserRole.PREMIUM, Permission.VIEW_ARTICLES_PREMIUM)).toBe(true)
      expect(hasPermission(UserRole.PREMIUM, Permission.VIEW_COURSES_PREMIUM)).toBe(true)
      expect(hasPermission(UserRole.PREMIUM, Permission.VIEW_VIDEOS_PREMIUM)).toBe(true)
    })

    it('creators can create and edit content', () => {
      expect(hasPermission(UserRole.CREATOR, Permission.CREATE_ARTICLES)).toBe(true)
      expect(hasPermission(UserRole.CREATOR, Permission.EDIT_ARTICLES)).toBe(true)
      expect(hasPermission(UserRole.CREATOR, Permission.CREATE_COURSES)).toBe(true)
      expect(hasPermission(UserRole.CREATOR, Permission.UPLOAD_VIDEOS)).toBe(true)
    })

    it('creators cannot access admin panel', () => {
      expect(hasPermission(UserRole.CREATOR, Permission.ADMIN_PANEL)).toBe(false)
    })

    it('admins have all permissions', () => {
      expect(hasPermission(UserRole.ADMIN, Permission.ADMIN_PANEL)).toBe(true)
      expect(hasPermission(UserRole.ADMIN, Permission.MANAGE_USERS)).toBe(true)
      expect(hasPermission(UserRole.ADMIN, Permission.DELETE_ARTICLES)).toBe(true)
    })
  })

  describe('hasAnyPermission', () => {
    it('returns true when at least one permission matches', () => {
      expect(
        hasAnyPermission(UserRole.FREE, [Permission.FOLLOW_CREATORS, Permission.ADMIN_PANEL]),
      ).toBe(true)
    })

    it('returns false when no permission matches', () => {
      expect(
        hasAnyPermission(UserRole.VISITOR, [Permission.FOLLOW_CREATORS, Permission.POST_COMMENTS]),
      ).toBe(false)
    })

    it('returns false for empty permissions array', () => {
      expect(hasAnyPermission(UserRole.ADMIN, [])).toBe(false)
    })
  })

  describe('hasAllPermissions', () => {
    it('returns true when all permissions match', () => {
      expect(
        hasAllPermissions(UserRole.FREE, [Permission.VIEW_ARTICLES, Permission.FOLLOW_CREATORS]),
      ).toBe(true)
    })

    it('returns false when some permissions are missing', () => {
      expect(
        hasAllPermissions(UserRole.FREE, [
          Permission.FOLLOW_CREATORS,
          Permission.VIEW_ARTICLES_PREMIUM,
        ]),
      ).toBe(false)
    })

    it('returns true for empty permissions array', () => {
      expect(hasAllPermissions(UserRole.VISITOR, [])).toBe(true)
    })
  })

  describe('isRoleAtLeast', () => {
    it('VISITOR is at least VISITOR', () => {
      expect(isRoleAtLeast(UserRole.VISITOR, UserRole.VISITOR)).toBe(true)
    })

    it('FREE is at least VISITOR', () => {
      expect(isRoleAtLeast(UserRole.FREE, UserRole.VISITOR)).toBe(true)
    })

    it('VISITOR is NOT at least FREE', () => {
      expect(isRoleAtLeast(UserRole.VISITOR, UserRole.FREE)).toBe(false)
    })

    it('ADMIN is at least any role', () => {
      expect(isRoleAtLeast(UserRole.ADMIN, UserRole.VISITOR)).toBe(true)
      expect(isRoleAtLeast(UserRole.ADMIN, UserRole.FREE)).toBe(true)
      expect(isRoleAtLeast(UserRole.ADMIN, UserRole.PREMIUM)).toBe(true)
      expect(isRoleAtLeast(UserRole.ADMIN, UserRole.CREATOR)).toBe(true)
      expect(isRoleAtLeast(UserRole.ADMIN, UserRole.ADMIN)).toBe(true)
    })

    it('PREMIUM is not at least CREATOR', () => {
      expect(isRoleAtLeast(UserRole.PREMIUM, UserRole.CREATOR)).toBe(false)
    })
  })

  describe('ROLE_PERMISSIONS inheritance', () => {
    it('each role has more or equal permissions than the previous', () => {
      const hierarchy = [
        UserRole.VISITOR,
        UserRole.FREE,
        UserRole.PREMIUM,
        UserRole.CREATOR,
        UserRole.ADMIN,
      ]

      for (let i = 1; i < hierarchy.length; i++) {
        const currentPermissions = ROLE_PERMISSIONS[hierarchy[i]]
        const previousPermissions = ROLE_PERMISSIONS[hierarchy[i - 1]]
        // Every permission of the previous role should exist in the current role
        for (const perm of previousPermissions) {
          expect(currentPermissions).toContain(perm)
        }
      }
    })
  })
})
