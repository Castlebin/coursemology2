import { useState } from 'react';
import { toast } from 'react-toastify';

import { TimeZones } from 'types/course/admin/course';
import LoadingIndicator from 'lib/components/core/LoadingIndicator';
import Preload from 'lib/components/wrappers/Preload';
import { FormEmitter } from 'lib/components/form/Form';
import useTranslation from 'lib/hooks/useTranslation';
import formTranslations from 'lib/translations/form';
import { EmailData } from 'types/users';
import AccountSettingsForm from './AccountSettingsForm';
import {
  AccountSettingsData,
  addEmail,
  fetchAccountSettings,
  fetchTimeZones,
  removeEmail,
  resendConfirmationEmail,
  setEmailAsPrimary,
  updateAccountSettings,
  updateProfilePicture,
} from '../operations';
import translations from '../translations';

const fetchAccountSettingsAndTimeZones = (): Promise<
  [AccountSettingsData, TimeZones]
> => Promise.all([fetchAccountSettings(), fetchTimeZones()]);

const AccountSettings = (): JSX.Element => {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormEmitter>();
  const [submitting, setSubmitting] = useState(false);

  const handleUpdateAccountSettings = (
    data: Partial<AccountSettingsData>,
  ): void => {
    setSubmitting(true);

    updateAccountSettings(data)
      .then((newData) => {
        form?.resetByMerging?.(newData);
        toast.success(t(formTranslations.changesSaved));
      })
      .catch(form?.receiveErrors)
      .finally(() => setSubmitting(false));
  };

  const handleUploadProfilePicture = (
    image: File,
    onSuccess: () => void,
  ): void => {
    setSubmitting(true);

    toast
      .promise(updateProfilePicture(image), {
        pending: t(translations.uploadingProfilePicture),
        success: t(translations.profilePictureUpdated),
      })
      .then((newData) => {
        form?.resetByMerging?.(newData);
        onSuccess();
      })
      .catch((error: Error) => {
        toast.error(error.message);
      })
      .finally(() => setSubmitting(false));
  };

  const handleAddEmail = (
    email: EmailData['email'],
    onSuccess: () => void,
    onError: (message: string) => void,
  ): void => {
    setSubmitting(true);

    addEmail(email)
      .then((emails) => {
        form?.mutate?.(emails);
        toast.success(t(translations.emailAdded, { email }));
        onSuccess();
      })
      .catch((errors) => {
        if (errors?.email) {
          onError(errors.email);
        } else {
          toast.error(t(translations.errorAddingEmail, { email }));
        }
      })
      .finally(() => setSubmitting(false));
  };

  const handleRemoveEmail = (
    id: EmailData['id'],
    email: EmailData['email'],
  ): void => {
    setSubmitting(true);

    removeEmail(id)
      .then((emails) => {
        form?.mutate?.(emails);
        toast.success(t(translations.emailRemoved, { email }));
      })
      .catch(() => {
        toast.error(t(translations.errorRemovingEmail, { email }));
      })
      .finally(() => setSubmitting(false));
  };

  const handleSetEmailAsPrimary = (
    url: NonNullable<EmailData['setPrimaryUserEmailPath']>,
    email: EmailData['email'],
  ): void => {
    setSubmitting(true);

    setEmailAsPrimary(url)
      .then((emails) => {
        form?.mutate?.(emails);
        toast.success(t(translations.emailSetAsPrimary, { email }));
      })
      .catch(() => {
        toast.error(t(translations.errorSettingPrimaryEmail, { email }));
      })
      .finally(() => setSubmitting(false));
  };

  const handleResendConfirmationEmail = (
    url: NonNullable<EmailData['confirmationEmailPath']>,
    email: EmailData['email'],
  ): void => {
    setSubmitting(true);

    resendConfirmationEmail(url)
      .then(() => {
        toast.success(t(translations.confirmationEmailSent, { email }));
      })
      .catch(() => {
        toast.error(t(translations.errorSendingConfirmationEmail, { email }));
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Preload
      while={fetchAccountSettingsAndTimeZones}
      render={<LoadingIndicator />}
    >
      {([settings, timeZones]): JSX.Element => (
        <AccountSettingsForm
          settings={settings}
          timeZones={timeZones}
          onSubmit={handleUpdateAccountSettings}
          onUpdateProfilePicture={handleUploadProfilePicture}
          onAddEmail={handleAddEmail}
          onRemoveEmail={handleRemoveEmail}
          onSetEmailAsPrimary={handleSetEmailAsPrimary}
          onResendConfirmationEmail={handleResendConfirmationEmail}
          disabled={submitting}
          emitsVia={setForm}
        />
      )}
    </Preload>
  );
};

export default AccountSettings;
