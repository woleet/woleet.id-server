/* Enrollment */
interface EnrollmentObject { }

interface ApiEnrollmentObject extends EnrollmentObject, ApiCommonProperties {
  userId: string;
  name: string;
  expiration?: number;
  expired?: boolean;
  device?: KeyDeviceEnum;
}

interface ApiPostEnrollmentObject extends EnrollmentObject {
  name: string;
  userId: string;
  device?: KeyDeviceEnum;
  expiration?: number;
}
