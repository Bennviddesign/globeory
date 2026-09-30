import { ProfileForm } from '@/components/forms/ProfileForm';

/** First run without an account: create a local profile stored on this device. */
export default function CreateProfileScreen() {
  return <ProfileForm mode="create" />;
}
