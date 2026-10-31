import React, { useState, useEffect } from 'react';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  className?: string;
  fallbackTextClassName?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  className = 'w-full h-full',
  fallbackTextClassName = 'text-xs font-bold text-blue-700',
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [avatarUrl]);

  // Compute initials: e.g. "Beatriz Mendonça" -> "BM" or "B"
  const getInitials = (fullName: string) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0][0]?.toUpperCase() || '?';
  };

  const showImage = Boolean(avatarUrl && !hasError);

  return (
    <div className={`relative overflow-hidden shrink-0 flex items-center justify-center bg-blue-100 ${className}`}>
      {showImage ? (
        <img
          src={avatarUrl}
          alt={name}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
          loading="eager"
        />
      ) : (
        <span className={fallbackTextClassName}>
          {getInitials(name)}
        </span>
      )}
    </div>
  );
};
