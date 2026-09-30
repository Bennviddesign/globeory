import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useSession } from '@/context/SessionContext';
import { useActions } from '@/context/useActions';
import type { ProfileVisibility } from '@/models/common';
import type { UserInput } from '@/models/user';
import { SegmentedControl } from '../common/SegmentedControl';
import { showError } from '../modals/confirm';
import { FormField } from './FormField';
import { FormScreen } from './FormScreen';
import { TextField } from './TextField';

/**
 * Creates the local profile (first run) or edits the current one.
 * The profile can be public (discoverable) or private at any time.
 */
export function ProfileForm({ mode }: { mode: 'create' | 'edit' }) {
  const router = useRouter();
  const { currentUser } = useData();
  const { createLocalProfile } = useSession();
  const actions = useActions();
  const existing = mode === 'edit' ? currentUser : null;

  const [displayName, setDisplayName] = useState(existing?.display_name ?? '');
  const [username, setUsername] = useState(existing?.username ?? '');
  const [bio, setBio] = useState(existing?.bio ?? '');
  const [homeCity, setHomeCity] = useState(existing?.home_city ?? '');
  const [homeCountry, setHomeCountry] = useState(existing?.home_country ?? '');
  const [visibility, setVisibility] = useState<ProfileVisibility>(existing?.profile_visibility ?? 'public');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const input: UserInput = {
      username,
      display_name: displayName,
      avatar_url: existing?.avatar_url ?? null,
      bio,
      home_city: homeCity,
      home_country: homeCountry,
      profile_visibility: visibility,
      preferred_unit: existing?.preferred_unit ?? 'km',
    };
    try {
      setSaving(true);
      if (mode === 'create') {
        await createLocalProfile(input);
        router.replace('/explore');
      } else {
        actions.updateProfile(input);
        router.back();
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Please check the form and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormScreen
      title={mode === 'create' ? 'Create your profile' : 'Edit profile'}
      subtitle={mode === 'create' ? 'Stored on this device. No account needed.' : undefined}
      saveLabel={mode === 'create' ? 'Start my archive' : 'Save'}
      onSave={save}
      saving={saving}
    >
      <TextField label="Name" required value={displayName} onChangeText={setDisplayName} placeholder="Marcus" />
      <TextField
        label="Username"
        required
        value={username}
        onChangeText={(v) => setUsername(v.toLowerCase())}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="marcus"
        hint="Letters, numbers and underscores."
      />
      <TextField label="Bio" value={bio} onChangeText={setBio} multiline placeholder="Tell other travelers about yourself" />
      <TextField label="Home city" value={homeCity} onChangeText={setHomeCity} placeholder="Malmö" />
      <TextField label="Home country" value={homeCountry} onChangeText={setHomeCountry} placeholder="Sweden" />
      <FormField
        label="Profile visibility"
        hint={
          visibility === 'public'
            ? 'Public: others can find you by username and destination.'
            : 'Private: not discoverable through destination search. Only followers see your content.'
        }
      >
        <SegmentedControl
          options={[
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
          ]}
          value={visibility}
          onChange={setVisibility}
        />
      </FormField>
    </FormScreen>
  );
}
