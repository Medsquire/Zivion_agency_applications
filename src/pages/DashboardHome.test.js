import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardHome, { getRequestMedia } from './DashboardHome';

const mockRequests = [
  {
    id: 'REQ-1001',
    caseOrderId: 'CASE-2026-041',
    caseTitle: 'Main Power Distribution & Socket Sparks',
    workOrderId: 'WO-041-A',
    service: 'Electrical Repair',
    resident: 'Kavya Sharma',
    apartment: 'Surya Enclave',
    flatNo: 'A-101',
    technician: 'Suresh Babu',
    technicianId: 'TECH-001',
    assignedDate: '2026-10-11',
    targetDate: '2026-10-23',
    priority: 'Urgent',
    status: 'In Progress',
    description: 'Frequent tripping of 32A MCB in master bedroom and sparking switchboard.',
    issueImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    inImage: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80',
    outImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    inTime: '2026-10-11 10:25 AM',
    outTime: '2026-10-11 01:40 PM',
    inNotes: 'Technician Suresh Babu checked in at site. Switchboard isolated and voltage reading verified at 230V.',
    outNotes: 'Rewiring complete with 32A MCB breaker replaced and verified under full 16A load test.',
    audio: {
      hasAudio: true,
      title: 'Resident Voice Note',
      duration: '0:42',
    },
  },
  {
    id: 'REQ-1002',
    workOrderId: 'WO-042-A',
    service: 'Plumbing',
    resident: 'Priya Sharma',
    apartment: 'Golden Orbit',
    flatNo: 'C-305',
    technician: 'Mahesh Reddy',
    status: 'Work Progress State',
    description: 'Balcony drain overflowing during rain.',
  },
];

describe('DashboardHome Component - Issue & IN/OUT Image Verification', () => {
  test('renders without audio player in Recent Service Requests table', () => {
    render(
      <DashboardHome
        requests={mockRequests}
        technicians={[]}
        payments={[]}
        apartments={['Surya Enclave', 'Golden Orbit']}
        agencyAssignments={{}}
        onNavigate={jest.fn()}
      />
    );

    // Audio player duration like '0:42' or audio voice player controls should NOT be rendered in table
    expect(screen.queryByText('0:42')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Play audio/i)).not.toBeInTheDocument();

    // Table headers are present
    expect(screen.getByText('Recent Service Requests')).toBeInTheDocument();
    expect(screen.getByText('REQ-1001')).toBeInTheDocument();
    expect(screen.getByText('Electrical Repair')).toBeInTheDocument();

    // Issue Image thumbnail is rendered
    expect(screen.getAllByText('Issue').length).toBeGreaterThan(0);
  });

  test('opens popup modal when clicking on Issue Image thumbnail', () => {
    const handleNavigate = jest.fn();
    render(
      <DashboardHome
        requests={mockRequests}
        technicians={[]}
        payments={[]}
        apartments={['Surya Enclave']}
        agencyAssignments={{}}
        onNavigate={handleNavigate}
      />
    );

    // Click on the Issue thumbnail for the first request
    const issueThumb = screen.getAllByTitle('Click to view Issue photo in popup')[0];
    fireEvent.click(issueThumb);

    // The modal should open with title
    expect(screen.getByText(/Inspection Media: Issue & IN \/ OUT Verification/i)).toBeInTheDocument();
    expect(screen.getByText(/Reported Issue \/ Defect/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Kavya Sharma/i).length).toBeGreaterThan(0);

    // Close button works
    const closeBtn = screen.getByRole('button', { name: /Close modal/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/Inspection Media: Issue & IN \/ OUT Verification/i)).not.toBeInTheDocument();
  });

  test('opens popup modal and allows switching tabs (Issue, IN, OUT, Side-by-Side)', () => {
    render(
      <DashboardHome
        requests={mockRequests}
        technicians={[]}
        payments={[]}
        apartments={['Surya Enclave']}
        agencyAssignments={{}}
        onNavigate={jest.fn()}
      />
    );

    // Click Issue thumbnail to open popup modal
    const issueThumb = screen.getAllByTitle(/Click to view Issue photo in popup/i)[0];
    fireEvent.click(issueThumb);

    // Modal is open
    expect(screen.getByText(/Inspection Media: Issue & IN \/ OUT Verification/i)).toBeInTheDocument();

    // Switch to IN (Check-In) tab
    const inTab = screen.getByRole('button', { name: /IN \(Check-In\)/i });
    fireEvent.click(inTab);
    expect(screen.getByText(/Technician Arrival & Diagnostic Proof/i)).toBeInTheDocument();

    // Switch to OUT (Check-Out) tab
    const outTab = screen.getByRole('button', { name: /OUT \(Check-Out\)/i });
    fireEvent.click(outTab);
    expect(screen.getByText(/Work Completion & Resolution Sign-Off/i)).toBeInTheDocument();

    // Switch to Side-by-Side: IN vs OUT comparison tab
    const compareTab = screen.getByRole('button', { name: /Side-by-Side: IN vs OUT/i });
    fireEvent.click(compareTab);
    expect(screen.getByText(/BEFORE: Check-IN/i)).toBeInTheDocument();
    expect(screen.getByText(/AFTER: Check-OUT/i)).toBeInTheDocument();

    // Press Escape to close modal
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByText(/Inspection Media: Issue & IN \/ OUT Verification/i)).not.toBeInTheDocument();
  });

  test('getRequestMedia helper returns sensible fallbacks if images are missing', () => {
    const media = getRequestMedia({ service: 'Plumbing', status: 'In Progress' });
    expect(media.issueImage).toBeDefined();
    expect(media.inImage).toBeDefined();
    expect(media.inNotes).toBeDefined();
  });
});
