/* Enrollment */
interface EnrollmentObject { }

interface ApiEnrollmentObject extends EnrollmentObject, ApiCommonProperties {
  userId: string;
  expiration?: number;
  expired?: boolean;
}
