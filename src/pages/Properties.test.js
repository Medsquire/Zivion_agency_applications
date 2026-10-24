import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Properties from './Properties';
import Communities from './Communities';

describe('Communities & Properties Exact UI & Hierarchy Flow', () => {
  test('renders Screen 1: Communities & properties heading, 4 KPI cards, and initial Community Tier cards (Diamond, Gold, Silver)', () => {
    render(<Properties />);
    expect(screen.getByRole('heading', { level: 1, name: /Communities & properties/i })).toBeInTheDocument();
    expect(screen.getByText(/Community → Society → Tower → Floor → Flat/i)).toBeInTheDocument();

    // 4 KPI Cards
    expect(screen.getAllByText(/COMMUNITIES/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/SOCIETIES/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/RESIDENTIAL UNITS/i)).toBeInTheDocument();
    expect(screen.getByText(/PENDING REQUESTS/i)).toBeInTheDocument();

    // Initial Community Tier Cards (without enclaves directly)
    expect(screen.getByText('Diamond Communities')).toBeInTheDocument();
    expect(screen.getByText('Gold Communities')).toBeInTheDocument();
    expect(screen.getByText('Silver Communities')).toBeInTheDocument();
  });

  test('Communities wrapper renders Screen 1 with Community Tiers by default', () => {
    render(<Communities />);
    expect(screen.getByRole('heading', { level: 1, name: /Communities & properties/i })).toBeInTheDocument();
    expect(screen.getByText('Gold Communities')).toBeInTheDocument();
  });

  test('drilling down: Gold Communities -> Surya Enclave -> Tower A -> Floor map -> Unit Dossier with all functionalities', () => {
    render(<Properties />);

    // Step 1: Click "Open" on Gold Communities
    const openButtons = screen.getAllByRole('button', { name: /^Open$/i });
    // openButtons[0] = Diamond, openButtons[1] = Gold, openButtons[2] = Silver
    fireEvent.click(openButtons[1]); // Gold Communities

    // Screen 1b: Societies under Gold Communities
    expect(screen.getByText(/Gold Communities — Enclaves & Societies/i)).toBeInTheDocument();
    expect(screen.getByText(/Rajeshwar Rao/i)).toBeInTheDocument(); // Team Access Community Admin
    expect(screen.getByText('Surya Enclave')).toBeInTheDocument();
    expect(screen.getByText('Golden Orbit')).toBeInTheDocument();

    // Step 2: Click "Open" on Surya Enclave
    const societyOpenButtons = screen.getAllByRole('button', { name: /^Open$/i });
    fireEvent.click(societyOpenButtons[0]); // Surya Enclave

    // Screen 2: Society Detail & Towers
    expect(screen.getByRole('heading', { level: 1, name: 'Surya Enclave' })).toBeInTheDocument();
    expect(screen.getByText(/Gold Communities · 250 units · 3 towers/i)).toBeInTheDocument();
    expect(screen.getByText('Tower A')).toBeInTheDocument();
    expect(screen.getByText('Tower B')).toBeInTheDocument();
    expect(screen.getByText('Tower C')).toBeInTheDocument();
    expect(screen.getByText(/Service technicians for this society/i)).toBeInTheDocument();
    expect(screen.getByText(/Suresh Babu/i)).toBeInTheDocument();

    // Step 3: Click "Open floor map →" on Tower A
    const mapLinks = screen.getAllByRole('button', { name: /Open floor map →/i });
    fireEvent.click(mapLinks[0]);

    // Screen 3: Floor Map view
    expect(screen.getByRole('heading', { level: 1, name: /Tower A · Floor map/i })).toBeInTheDocument();
    expect(screen.getByText(/Tap a flat to open its profile/i)).toBeInTheDocument();
    expect(screen.getByText(/Occupied/i)).toBeInTheDocument();
    expect(screen.getByText(/Open request/i)).toBeInTheDocument();
    expect(screen.getByText(/Dues overdue/i)).toBeInTheDocument();
    expect(screen.getByText(/Vacant/i)).toBeInTheDocument();

    // Floor labels
    expect(screen.getAllByText(/Floor 8/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Floor 1/i).length).toBeGreaterThan(0);

    // Step 4: Click flat A-101 to open Unit Dossier Modal
    const flat101 = screen.getByRole('button', { name: 'A-101' });
    fireEvent.click(flat101);

    expect(screen.getByText(/RESIDENTIAL UNIT DOSSIER/i)).toBeInTheDocument();
    expect(screen.getByText(/Flat A-101 — Surya Enclave/i)).toBeInTheDocument();

    // Verify Tab 1: Owner & Tenant
    expect(screen.getByText(/Registered Property Owner/i)).toBeInTheDocument();
    expect(screen.getByText(/Col\. Rajesh Bakshi/i)).toBeInTheDocument();
    expect(screen.getByText(/Verified \(KYC Complete\)/i)).toBeInTheDocument();

    // Verify Tab 2: Bills & Dues
    const billsTab = screen.getByRole('button', { name: /Bills & Dues/i });
    fireEvent.click(billsTab);
    expect(screen.getByText(/OUTSTANDING MAINTENANCE DUES/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Maintenance Fee/i)).toBeInTheDocument();

    // Verify Tab 4: Team Admins (from Team & Access)
    const adminsTab = screen.getByRole('button', { name: /Team Admins/i });
    fireEvent.click(adminsTab);
    expect(screen.getByText(/Governance & Administrative Contacts/i)).toBeInTheDocument();
    expect(screen.getByText(/Rajeshwar Rao \(Gold Community Operations Lead\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Ravi Kumar \(Senior Estate Manager\)/i)).toBeInTheDocument();
    expect(screen.getByText(/K\. Srinivas \(Tower Facility Administrator\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Suresh Babu/i)).toBeInTheDocument();

    // Verify Tab 5: Unit Specs
    const specsTab = screen.getByRole('button', { name: /Unit Specs/i });
    fireEvent.click(specsTab);
    expect(screen.getByText(/Configuration/i)).toBeInTheDocument();
    expect(screen.getByText(/Reserved Parking/i)).toBeInTheDocument();

    // Verify Tab 3: Service Tickets & Interactive Ticket Raising
    const ticketsTab = screen.getByRole('button', { name: /Service Tickets/i });
    fireEvent.click(ticketsTab);
    expect(screen.getByRole('button', { name: /\+ Raise New Ticket/i })).toBeInTheDocument();

    // Raise new ticket
    fireEvent.click(screen.getByRole('button', { name: /\+ Raise New Ticket/i }));
    expect(screen.getByText(/Raise New Service Ticket/i)).toBeInTheDocument();

    const descInput = screen.getByPlaceholderText(/Describe the problem/i);
    fireEvent.change(descInput, { target: { value: 'Water leakage in master bathroom fixture' } });

    fireEvent.click(screen.getByRole('button', { name: /Dispatch & Save Ticket/i }));

    // Verify new ticket is displayed
    expect(screen.getByText(/Water leakage in master bathroom fixture/i)).toBeInTheDocument();
    expect(screen.getByText(/Pending/i)).toBeInTheDocument();

    // Close dossier modal
    fireEvent.click(screen.getByRole('button', { name: /Close Dossier/i }));
    expect(screen.queryByText(/RESIDENTIAL UNIT DOSSIER/i)).not.toBeInTheDocument();
  });
});
