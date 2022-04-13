import { InternalEnrollmentObject } from '../../types';

export function serializeEnrollment(enrollment: InternalEnrollmentObject): ApiEnrollmentObject {
  const dates = {
    expiration: +enrollment.expiration || null,
    keyExpiration: +enrollment.keyExpiration || null,
    createdAt: +enrollment.createdAt || null,
    updatedAt: +enrollment.updatedAt || null
  };
  const { id, name, userId, device, signatureRequestId } = enrollment;
  const expired = enrollment.expiration ? (+enrollment.expiration < Date.now()) : undefined;
  return Object.assign({ id, name, userId, device, signatureRequestId, expired }, dates);
}
