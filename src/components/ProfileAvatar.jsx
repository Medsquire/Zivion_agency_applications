import React, { useState, useRef, useEffect } from 'react';
import './ProfileAvatar.css';
import { useUser } from '../context/UserContext';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

/**
 * Extracts initials from a name (e.g., 'Agency Administrator' -> 'AA', 'John Doe' -> 'JD').
 */
export function getInitials(name) {
  if (!name || typeof name !== 'string') return 'AA';
  const trimmed = name.trim();
  if (!trimmed) return 'AA';

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Reusable ProfileAvatar component.
 * Displays photo if available, or initials on a vibrant gradient background.
 * Includes a keyboard-accessible circular edit badge with file validation and immediate preview.
 */
function ProfileAvatar({
  user: propUser,
  name: propName,
  photoUrl: propPhotoUrl,
  size = 'header', // 'header' (~40px) | 'modal' (~76px)
  editable = true,
  onSavePhoto,
  className = '',
}) {
  const userContext = useUser();
  const fileInputRef = useRef(null);
  const feedbackTimerRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  // Resolve user info from props or context
  const activeUser = propUser || userContext?.user || {};
  const displayName = propName || activeUser.fullName || activeUser.name || 'Agency Administrator';
  const currentPhoto = previewUrl !== null ? previewUrl : (propPhotoUrl !== undefined ? propPhotoUrl : (activeUser.photoUrl || ''));
  const initials = getInitials(displayName);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const showFeedback = (type, message) => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }
    setFeedback({ type, message });
    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null);
    }, 3800);
  };

  const handleBadgeClick = (event) => {
    event.stopPropagation();
    if (isLoading) return;
    if (fileInputRef.current) {
      // Clear input value to ensure onChange fires even if same file is re-selected
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleBadgeKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleBadgeClick(event);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 1. Validate MIME type & file extension
    const isAllowedType = ALLOWED_TYPES.includes(file.type.toLowerCase()) ||
      /\.(png|jpe?g|webp)$/i.test(file.name);

    if (!isAllowedType) {
      showFeedback('error', 'Invalid file type. Please upload a PNG, JPEG, or WEBP image.');
      return;
    }

    // 2. Validate file size (max 2 MB)
    if (file.size > MAX_FILE_SIZE) {
      showFeedback('error', 'File size exceeds 2 MB. Please select an image under 2 MB.');
      return;
    }

    // 3. Read file, show preview immediately, and save
    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      const dataUrl = reader.result;
      // Show preview immediately
      setPreviewUrl(dataUrl);

      try {
        if (typeof onSavePhoto === 'function') {
          await onSavePhoto(dataUrl);
        } else if (userContext?.uploadPhoto) {
          await userContext.uploadPhoto(dataUrl);
        }
        showFeedback('success', 'Profile photo updated successfully!');
      } catch (err) {
        console.error('Failed to save profile photo:', err);
        showFeedback('error', err?.message || 'Failed to save profile photo. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    reader.onerror = () => {
      setIsLoading(false);
      showFeedback('error', 'Could not read the selected file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`profile-avatar-wrapper size-${size} ${className}`}
      data-testid="profile-avatar-wrapper"
    >
      {/* Hidden file input */}
      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          style={{ display: 'none' }}
          tabIndex={-1}
          aria-hidden="true"
          onChange={handleFileChange}
        />
      )}

      {/* Circular Avatar Container */}
      <div className="profile-avatar-circle" title={displayName}>
        {currentPhoto ? (
          <img
            src={currentPhoto}
            alt={displayName}
            className="profile-avatar-image"
          />
        ) : (
          <span className="profile-avatar-initials" aria-hidden="true">
            {initials}
          </span>
        )}

        {/* Loading overlay while saving */}
        {isLoading && (
          <div
            className="profile-avatar-loading-overlay"
            role="status"
            aria-live="polite"
            aria-label="Saving photo"
          >
            <div className="profile-avatar-spinner" />
          </div>
        )}
      </div>

      {/* Circular Edit Badge */}
      {editable && (
        <button
          type="button"
          className="profile-avatar-edit-badge"
          onClick={handleBadgeClick}
          onKeyDown={handleBadgeKeyDown}
          aria-label="Change profile photo"
          title="Change profile photo"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              width={size === 'modal' ? '14' : '10'}
              height={size === 'modal' ? '14' : '10'}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="profile-avatar-spinner"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="#FFFFFF" />
            </svg>
          ) : (
            <svg
              width={size === 'modal' ? '15' : '11'}
              height={size === 'modal' ? '15' : '11'}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
          )}
        </button>
      )}

      {/* Floating feedback message */}
      {feedback && (
        <div
          className={`profile-avatar-feedback feedback-${feedback.type}`}
          role="status"
          aria-live="polite"
        >
          <span className="feedback-icon" aria-hidden="true">
            {feedback.type === 'success' ? '✓' : '!'}
          </span>
          <span className="feedback-text">{feedback.message}</span>
          <button
            type="button"
            className="feedback-dismiss"
            onClick={() => setFeedback(null)}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileAvatar;
