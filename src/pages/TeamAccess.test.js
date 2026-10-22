import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TeamAccess from './TeamAccess';

describe('Team & Access Hierarchy Page', () => {
  const mockAgencyAdmin = {
    fullName: 'John Doe',
    email: 'john.doe@agency.com',
    phone: '+91 98450 00001',
  };

  test('renders Team & Access Hierarchy heading and KPI metrics', () => {
    render(<TeamAccess agencyAdmin={mockAgencyAdmin} />);
    expect(screen.getByText(/Team & Access Hierarchy/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Governance Personnel/i)).toBeInTheDocument();
    expect(screen.getByText(/Agency Admin \/ Supervisors/i)).toBeInTheDocument();
  });

  test('renders Level 1 Agency Admin and Level 2 Supervisors', () => {
    render(<TeamAccess agencyAdmin={mockAgencyAdmin} />);
    expect(screen.getByText(/LEVEL 1 · AGENCY EXECUTIVE HEADQUARTERS/i)).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Kavitha Nair')).toBeInTheDocument();
    expect(screen.getByText('Rohit Malhotra')).toBeInTheDocument();
  });

  test('renders Community Admins and Society Admins in hierarchy', () => {
    render(<TeamAccess agencyAdmin={mockAgencyAdmin} />);
    expect(screen.getByText('Vikram Malhotra')).toBeInTheDocument();
    expect(screen.getByText('Rajeshwar Rao')).toBeInTheDocument();
    expect(screen.getByText('Sunita Deshmukh')).toBeInTheDocument();

    // Society Admins
    expect(screen.getByText('Arjun Singhania')).toBeInTheDocument();
    expect(screen.getByText('Ravi Kumar')).toBeInTheDocument();
  });

  test('opens inspector modal when Details button is clicked', () => {
    render(<TeamAccess agencyAdmin={mockAgencyAdmin} />);
    const detailButtons = screen.getAllByRole('button', { name: /Details/i });
    fireEvent.click(detailButtons[0]);

    expect(screen.getByText(/ADMINISTRATIVE CREDENTIALS DOSSIER/i)).toBeInTheDocument();
    expect(screen.getByText(/Incident & Ticket Escalation Dispatch/i)).toBeInTheDocument();
  });

  test('searching filters admins dynamically', () => {
    render(<TeamAccess agencyAdmin={mockAgencyAdmin} />);
    const searchInput = screen.getByPlaceholderText(/Search admins by name/i);
    fireEvent.change(searchInput, { target: { value: 'Vikram' } });

    expect(screen.getByText('Vikram Malhotra')).toBeInTheDocument();
    expect(screen.queryByText('Kavitha Nair')).not.toBeInTheDocument();
  });
});
