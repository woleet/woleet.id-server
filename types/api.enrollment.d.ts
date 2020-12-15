interface EnrollmentObject {
}

interface ApiEnrollmentObject extends EnrollmentObject, ApiCommonProperties {
  userId: string;
  name: string;
  expiration?: number;
  expired?: boolean;
  device?: KeyDeviceEnum;
  signatureRequestId?: string;
  keyExpiration?: number;
}

interface ApiPostEnrollmentObject extends EnrollmentObject {
  name: string;
  userId: string;
  device?: KeyDeviceEnum;
  expiration?: number;
  keyExpiration?: number;
  test?: boolean;
}

interface ApiPutEnrollmentObject extends EnrollmentObject {
  name?: string;
  device?: KeyDeviceEnum;
  expiration?: number;
  keyExpiration?: number;
}
