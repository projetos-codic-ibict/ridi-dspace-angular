import { getInfoModulePath } from '../app-routing-paths';

export const END_USER_AGREEMENT_PATH = 'end-user-agreement';
export const PRIVACY_PATH = 'privacy';
export const FEEDBACK_PATH = 'feedback';
export const COAR_NOTIFY_SUPPORT = 'coar-notify-support';
export const ACCESSIBILITY_SETTINGS_PATH = 'accessibility';
export const PRESENTATION_PATH = 'presentation';
export const REPOSITORY_POLICY_PATH = 'repositorypolicy';
export const CONTACTS_PATH = 'contacts';

export function getPresentationPath() {
  return getSubPath(PRESENTATION_PATH);
}

export function getRepositoryPolicyPath() {
  return getSubPath(REPOSITORY_POLICY_PATH);
}

export function getContactsPath() {
  return getSubPath(CONTACTS_PATH);
}

export function getEndUserAgreementPath() {
  return getSubPath(END_USER_AGREEMENT_PATH);
}

export function getPrivacyPath() {
  return getSubPath(PRIVACY_PATH);
}

export function getFeedbackPath() {
  return getSubPath(FEEDBACK_PATH);
}

export function getCOARNotifySupportPath(): string {
  return getSubPath(COAR_NOTIFY_SUPPORT);
}

export function getAccessibilitySettingsPath() {
  return getSubPath(ACCESSIBILITY_SETTINGS_PATH);
}

function getSubPath(path: string) {
  return `${getInfoModulePath()}/${path}`;
}
