import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileAvatar, { getInitials } from './ProfileAvatar';
import { UserProvider } from '../context/UserContext';

describe('getInitials helper', () => {
  test('returns AA for Agency Administrator', () => {
    expect(getInitials('Agency Administrator')).toBe('AA');
  });

  test('returns JD for John Doe', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  test('returns first two letters for single word names', () => {
    expect(getInitials('Admin')).toBe('AD');
  });

  test('handles empty or missing name gracefully', () => {
    expect(getInitials('')).toBe('AA');
    expect(getInitials(null)).toBe('AA');
  });
});

describe('ProfileAvatar Component', () => {
  test('renders initials when no photoUrl exists', () => {
    render(
      <UserProvider>
        <ProfileAvatar
          user={{ fullName: 'John Doe', photoUrl: '' }}
          size="header"
        />
      </UserProvider>
    );

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  test('renders image when photoUrl exists', () => {
    render(
      <UserProvider>
        <ProfileAvatar
          user={{ fullName: 'John Doe', photoUrl: 'https://example.com/photo.jpg' }}
          size="header"
        />
      </UserProvider>
    );

    const img = screen.getByRole('img', { name: 'John Doe' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  test('renders accessible edit badge with aria-label="Change profile photo"', () => {
    render(
      <UserProvider>
        <ProfileAvatar
          user={{ fullName: 'Agency Administrator' }}
          size="header"
        />
      </UserProvider>
    );

    const editBadge = screen.getByRole('button', { name: 'Change profile photo' });
    expect(editBadge).toBeInTheDocument();
  });

  test('rejects file larger than 2MB with error message', async () => {
    render(
      <UserProvider>
        <ProfileAvatar
          user={{ fullName: 'Agency Administrator' }}
          size="modal"
        />
      </UserProvider>
    );

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();

    // Create a 2.5 MB fake file
    const largeBlob = new Blob(['a'.repeat(2.5 * 1024 * 1024)], { type: 'image/png' });
    const largeFile = new File([largeBlob], 'large.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(screen.getByText(/File size exceeds 2 MB/i)).toBeInTheDocument();
    });
  });

  test('rejects invalid file types with error message', async () => {
    render(
      <UserProvider>
        <ProfileAvatar
          user={{ fullName: 'Agency Administrator' }}
          size="modal"
        />
      </UserProvider>
    );

    const fileInput = document.querySelector('input[type="file"]');

    const invalidFile = new File(['dummy'], 'document.pdf', { type: 'application/pdf' });
    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(screen.getByText(/Invalid file type/i)).toBeInTheDocument();
    });
  });

  test('valid file selection previews and calls onSavePhoto', async () => {
    const onSavePhotoMock = jest.fn().mockResolvedValue({ success: true });

    render(
      <UserProvider>
        <ProfileAvatar
          user={{ fullName: 'Jane Doe' }}
          size="header"
          onSavePhoto={onSavePhotoMock}
        />
      </UserProvider>
    );

    const fileInput = document.querySelector('input[type="file"]');
    const validFile = new File(['valid-image-content'], 'avatar.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(onSavePhotoMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/Profile photo updated successfully/i)).toBeInTheDocument();
    });
  });
});
