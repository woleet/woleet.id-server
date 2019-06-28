export function serializeEnrollment(enrollment: InternalEnrollmentObject): ApiEnrollmentObject {
  const dates = {
    expiration: +enrollment.expiration || null,
    createdAt: +enrollment.createdAt || null,
    updatedAt: +enrollment.updatedAt || null
  };

  const { id, name, userId, device, signatureRequestId, keyExpiration } = enrollment;

  const expired = enrollment.expiration ? (+enrollment.expiration < Date.now()) : undefined;

  return Object.assign({ id, name, userId, device, signatureRequestId, keyExpiration, expired }, dates);
}
