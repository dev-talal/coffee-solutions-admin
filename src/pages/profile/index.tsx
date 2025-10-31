import { useState } from 'react';
import ProfileTabs from '@/components/profile/ProfileTabs';
import ProfileForm from '@/components/profile/ProfileForm';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import { Card } from '@/components/ui/card';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <Card className="min-h-[80vh] rounded-md gap-0">
      <ProfileTabs active={activeTab} setActive={setActiveTab} />
      <div>
        {activeTab === 'profile' && <ProfileForm />}
        {activeTab === 'changePassword' && <ChangePasswordForm />}
      </div>
    </Card>
  );
}
