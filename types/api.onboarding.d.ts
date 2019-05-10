/* Onboarding */
interface OnboardingObject { }

interface ApiOnboardingObject extends OnboardingObject, ApiCommonProperties {
  userId: string;
  expiration?: number;
  expired?: boolean;
}
