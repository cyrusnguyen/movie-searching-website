import { useEffect, useState } from 'react';

import { ErrorState, Spinner } from '../components/States';
import { useProfile } from '../api/profile';
import { useAuth } from '../hooks/useAuth';
import './Profile.css';

const EMPTY = { firstName: '', lastName: '', dob: '', address: '' };

/**
 * The API has exposed GET and PUT /user/:email/profile since 2023; the old UI
 * never surfaced them, so there was no way to fill in a name or address.
 */
export default function Profile() {
  const { user } = useAuth();
  const { profile, loading, error, save } = useProfile(user);

  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;

    setForm({
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      dob: profile.dob ?? '',
      address: profile.address ?? '',
    });
  }, [profile]);

  const update = (field) => (event) =>
    setForm((previous) => ({ ...previous, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    setSaving(true);

    try {
      await save(form);
      setStatus({ type: 'success', message: 'Profile saved.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading profile" />;
  if (error) return <ErrorState error={error} title="Could not load your profile" />;

  const complete = Object.values(form).every(Boolean);
  const initials = [form.firstName, form.lastName]
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .join('');

  return (
    <div className="container profile">
      <header className="profile__header">
        <div className="profile__avatar" aria-hidden="true">
          {initials || (user ? user[0].toUpperCase() : '?')}
        </div>
        <div>
          <h1 className="profile__name">
            {complete ? `${form.firstName} ${form.lastName}` : 'Your profile'}
          </h1>
          <p className="profile__email">{user}</p>
        </div>
      </header>

      <form className="profile__form card" onSubmit={handleSubmit} noValidate>
        <h2 className="profile__section-title">Details</h2>
        <p className="profile__section-hint">
          Only you can see your date of birth and address. Everyone else sees your name.
        </p>

        {status ? (
          <p
            className={`notice notice--${status.type}`}
            role={status.type === 'error' ? 'alert' : 'status'}
          >
            {status.message}
          </p>
        ) : null}

        <div className="profile__grid">
          <div className="field">
            <label className="field__label" htmlFor="firstName">
              First name<span className="field__required"> *</span>
            </label>
            <input
              className="field__input"
              id="firstName"
              type="text"
              autoComplete="given-name"
              value={form.firstName}
              onChange={update('firstName')}
              required
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="lastName">
              Last name<span className="field__required"> *</span>
            </label>
            <input
              className="field__input"
              id="lastName"
              type="text"
              autoComplete="family-name"
              value={form.lastName}
              onChange={update('lastName')}
              required
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="dob">
              Date of birth<span className="field__required"> *</span>
            </label>
            <input
              className="field__input"
              id="dob"
              type="date"
              autoComplete="bday"
              max={new Date().toISOString().slice(0, 10)}
              value={form.dob}
              onChange={update('dob')}
              required
            />
          </div>

          <div className="field profile__field--wide">
            <label className="field__label" htmlFor="address">
              Address<span className="field__required"> *</span>
            </label>
            <input
              className="field__input"
              id="address"
              type="text"
              autoComplete="street-address"
              value={form.address}
              onChange={update('address')}
              required
            />
          </div>
        </div>

        <div className="profile__actions">
          <button className="btn btn--primary" type="submit" disabled={saving || !complete}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {!complete ? (
            <p className="field__hint">All four fields are required by the API.</p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
