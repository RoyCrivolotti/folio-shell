/** Keep group IDs aligned with admin-hub / expense-tracker / oncall-tracker accessGroups. */
export type AccessGroupId = 'expenses' | 'finance' | 'legacy' | 'oncall'

export type GroupGrants = Record<AccessGroupId, boolean>

export function hasGroupGrant(grants: GroupGrants, groupId: AccessGroupId): boolean {
  return grants[groupId]
}

export function filterByGroupAccess<T extends { groupId: AccessGroupId }>(
  items: T[],
  grants: GroupGrants,
): T[] {
  return items.filter((item) => hasGroupGrant(grants, item.groupId))
}
