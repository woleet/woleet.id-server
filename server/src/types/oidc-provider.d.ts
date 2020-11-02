interface Interaction {
  error: 'login_required' | 'consent_required';
  error_description: string;
  reason: string;
}

interface ConsentInteraction extends Interaction {
  error: 'consent_required';
  error_description: 'client not authorized for End-User session yet';
  reason: 'client_not_authorized';
}

interface LoginInteraction extends Interaction {
  error: 'login_required';
  error_description: 'End-User authentication is required';
  reason: 'no_session';
  reason_description: 'Please sign-in to continue';
}
