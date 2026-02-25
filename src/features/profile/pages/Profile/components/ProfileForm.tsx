import { useState, useEffect } from 'react';
import { Loader2, Mail, Phone, MapPin, Calendar, User as UserIcon } from 'lucide-react';
import type { User } from '@/features/auth/store/action-types';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import '../../css/styles.scss';

interface ProfileFormProps {
    initialData: User | null;
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
}

export const ProfileForm = ({ initialData, onSubmit, isLoading }: ProfileFormProps) => {
    const [formData, setFormData] = useState({
        fullName: initialData?.fullName || initialData?.name || '',
        email: initialData?.email || '',
        phoneNumber: initialData?.phoneNumber || '',
        dateOfBirth: initialData?.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
        preferredCity: initialData?.preferredCity || '',
        profilePictureUrl: initialData?.profilePictureUrl || '',
        roleId: initialData?.roleId || 0,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || initialData.name || '',
                email: initialData.email || '',
                phoneNumber: initialData.phoneNumber || '',
                dateOfBirth: initialData.dateOfBirth ? initialData.dateOfBirth.split('T')[0] : '',
                preferredCity: initialData.preferredCity || '',
                profilePictureUrl: initialData.profilePictureUrl || '',
                roleId: initialData.roleId || 0,
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let formattedDate = formData.dateOfBirth;
        if (formattedDate && !formattedDate.includes('T')) {
            formattedDate = new Date(formattedDate).toISOString();
        }

        await onSubmit({
            ...formData,
            dateOfBirth: formattedDate
        });
    };

    const initials = formData.fullName
        ? formData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : 'U';

    return (
        <form onSubmit={handleSubmit} className="relative">
            {isLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 rounded-[20px] backdrop-blur-sm">
                    <Loader2 className="animate-spin h-8 w-8 text-[#c9622f]" />
                </div>
            )}

            {/* Avatar */}
            <div className="avatarSection">
                <div className="avatar">
                    {formData.profilePictureUrl ? (
                        <img src={formData.profilePictureUrl} alt={formData.fullName} />
                    ) : (
                        initials
                    )}
                    <div className="avatarChange">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                    </div>
                </div>
                <div className="avatarInfo">
                    <h3>{formData.fullName || 'User'}</h3>
                    <p>{formData.email}</p>
                    <button type="button" className="avatarBtn">Change photo</button>
                </div>
            </div>

            {/* Personal Info */}
            <div className="section">
                <div className="sectionLabel">Personal Info</div>
                <div className="grid">
                    <div className="field">
                        <Input
                            label="Full Name"
                            icon={UserIcon}
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="field">
                        <Input
                            label="Date of Birth"
                            icon={Calendar}
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="section">
                <div className="sectionLabel">Contact & Location</div>
                <div className="grid">
                    <div className="field relative">
                        <Input
                            label="Email Address"
                            icon={Mail}
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            disabled={true}
                        />
                        <span className="absolute right-3 top-[34px] flex items-center gap-1 text-[0.65rem] text-gray-400 font-medium">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-[10px] h-[10px]"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                            Locked
                        </span>
                    </div>
                    <div className="field">
                        <Input
                            label="Phone Number"
                            icon={Phone}
                            type="tel"
                            placeholder="+1234567890"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="field">
                        <Input
                            label="Preferred City"
                            icon={MapPin}
                            type="text"
                            value={formData.preferredCity}
                            onChange={(e) => setFormData({ ...formData, preferredCity: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="footer">
                <Button
                    type="submit"
                    disabled={isLoading}
                    isLoading={isLoading}
                    loadingText="Saving..."
                >
                    {!isLoading && (
                        <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                            Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
};
