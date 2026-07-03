import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import {
  getWorkplaceMembers,
  getTeamMemberProfile,
  getMembershipRequestsForWorkplace,
  getAuditLogs,
  getMyMembershipRequests,
  updateWorkplaceMemberRole,
  approveMembershipRequest,
  declineMembershipRequest,
  inviteClinicianToWorkplace,
  requestWorkplaceMembership,
} from './store'

export const workplaceQueryKeys = {
  workplace: ['workplace'],
  members: (workplaceId) => ['workplace', 'members', workplaceId],
  memberProfile: (workplaceId, userId) => ['workplace', 'member', workplaceId, userId],
  joinRequests: (workplaceId, status = 'pending') => ['workplace', 'joinRequests', workplaceId, status],
  auditLogs: (workplaceId) => ['workplace', 'auditLogs', workplaceId],
  myMembershipRequests: (userId) => ['workplace', 'myRequests', userId],
}

export function useWorkplaceMembersQuery(workplaceId, myWorkplace) {
  return useQuery({
    queryKey: workplaceQueryKeys.members(workplaceId),
    queryFn: () => getWorkplaceMembers(workplaceId, myWorkplace),
    enabled: Boolean(workplaceId && myWorkplace),
    placeholderData: keepPreviousData,
  })
}

export function useTeamMemberProfileQuery(userId, workplaceId, myWorkplace) {
  return useQuery({
    queryKey: workplaceQueryKeys.memberProfile(workplaceId, userId),
    queryFn: () => getTeamMemberProfile(userId, workplaceId, myWorkplace),
    enabled: Boolean(userId && workplaceId && myWorkplace),
    placeholderData: keepPreviousData,
  })
}

export function useMembershipRequestsQuery(workplaceId, status = 'pending') {
  return useQuery({
    queryKey: workplaceQueryKeys.joinRequests(workplaceId, status),
    queryFn: () => getMembershipRequestsForWorkplace(workplaceId, status),
    enabled: Boolean(workplaceId),
    placeholderData: keepPreviousData,
  })
}

export function useWorkplaceAuditLogsQuery(workplaceId, myWorkplace) {
  return useQuery({
    queryKey: workplaceQueryKeys.auditLogs(workplaceId),
    queryFn: () => getAuditLogs(workplaceId, myWorkplace),
    enabled: Boolean(workplaceId && myWorkplace),
    placeholderData: keepPreviousData,
  })
}

export function useMyMembershipRequestsQuery(userId) {
  return useQuery({
    queryKey: workplaceQueryKeys.myMembershipRequests(userId),
    queryFn: () => getMyMembershipRequests(userId),
    enabled: Boolean(userId),
    placeholderData: keepPreviousData,
  })
}

function invalidateWorkplaceDomain(queryClient, workplaceId) {
  queryClient.invalidateQueries({ queryKey: workplaceQueryKeys.workplace })
  if (workplaceId) {
    queryClient.invalidateQueries({ queryKey: workplaceQueryKeys.members(workplaceId) })
    queryClient.invalidateQueries({ queryKey: workplaceQueryKeys.joinRequests(workplaceId) })
    queryClient.invalidateQueries({ queryKey: workplaceQueryKeys.auditLogs(workplaceId) })
  }
}

export function useUpdateWorkplaceMemberRoleMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ workplaceId, memberUserId, newRole, actorId, myWorkplace }) =>
      updateWorkplaceMemberRole(workplaceId, memberUserId, newRole, actorId, myWorkplace),
    onSuccess: (_result, { workplaceId, memberUserId }) => {
      invalidateWorkplaceDomain(queryClient, workplaceId)
      queryClient.invalidateQueries({
        queryKey: workplaceQueryKeys.memberProfile(workplaceId, memberUserId),
      })
    },
  })
}

export function useApproveMembershipRequestMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, actorId, myWorkplace, role }) =>
      approveMembershipRequest(requestId, actorId, myWorkplace, role),
    onSuccess: (_result, { myWorkplace }) => {
      invalidateWorkplaceDomain(queryClient, myWorkplace?.id)
    },
  })
}

export function useDeclineMembershipRequestMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ requestId, actorId, myWorkplace }) =>
      declineMembershipRequest(requestId, actorId, myWorkplace),
    onSuccess: (_result, { myWorkplace }) => {
      invalidateWorkplaceDomain(queryClient, myWorkplace?.id)
    },
  })
}

export function useInviteClinicianToWorkplaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ workplaceId, userId, actorId, myWorkplace, role }) =>
      inviteClinicianToWorkplace(workplaceId, userId, actorId, myWorkplace, role),
    onSuccess: (_result, { workplaceId }) => {
      invalidateWorkplaceDomain(queryClient, workplaceId)
    },
  })
}

export function useRequestWorkplaceMembershipMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, workplaceId, message }) =>
      requestWorkplaceMembership(userId, workplaceId, message),
    onSuccess: (_result, { userId }) => {
      queryClient.invalidateQueries({ queryKey: workplaceQueryKeys.myMembershipRequests(userId) })
    },
  })
}
