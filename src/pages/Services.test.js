import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Services from './Services';

const mockRequests = [
  {
    id: 'REQ-1001',
    caseOrderId: 'CASE-2026-041',
    caseTitle: 'Main Power Distribution & Socket Sparks',
    workOrderId: 'WO-041-A',
    workOrderTitle: 'Circuit breaker diagnosis & rewire',
    category: 'Technicians',
    service: 'Electrical Repair',
    resident: 'Kavya Sharma',
    apartment: 'Surya Enclave',
    flatNo: 'A-101',
    technician: 'Suresh Babu',
    technicianId: 'TECH-001',
    assignedDate: '2026-10-11',
    targetDate: '2026-10-23',
    priority: 'High',
    status: 'In Progress',
    description: 'Frequent tripping of 32A MCB in master bedroom and sparking switchboard.',
  },
  {
    id: 'SEC-2001',
    caseOrderId: 'CASE-SEC-012',
    caseTitle: 'Heavy Furniture Delivery & Service Lift Pass',
    workOrderId: 'WO-SEC-01',
    workOrderTitle: 'Gate 2 security clearance & service lift booking',
    category: 'Security',
    service: 'Permission Request',
    securityPassType: 'Permission Request',
    resident: 'Kavya Sharma',
    apartment: 'Surya Enclave',
    flatNo: 'A-101',
    technician: 'Security Desk',
    technicianId: 'SEC-001',
    assignedDate: '2026-10-22',
    targetDate: '2026-10-23',
    priority: 'Medium',
    status: 'Received Request',
    description: 'Delivery truck carrying modular sofa arriving at 11:00 AM.',
  },
  {
    id: 'DAY-3001',
    caseOrderId: 'CASE-DAY-008',
    caseTitle: 'Community Organic Waste Segregation',
    workOrderId: 'WO-DAY-01',
    workOrderTitle: 'Door-to-door collection',
    category: 'Daily Works',
    service: 'Waste & Garbage Collection',
    resident: 'Community Association',
    apartment: 'Surya Enclave',
    flatNo: 'All Towers',
    technician: 'Daily Works Crew',
    technicianId: 'DAY-001',
    assignedDate: '2026-10-22',
    targetDate: '2026-10-22',
    priority: 'Normal',
    status: 'Pending',
    description: 'Daily morning wet and dry segregated collection.',
  },
];

describe('Services Management Page & Hierarchy Flow', () => {
  test('renders categories, 6 lifecycle stages, and hierarchy flow banner', () => {
    render(<Services requests={mockRequests} />);

    expect(screen.getByRole('heading', { level: 1, name: /Services & Work Orders/i })).toBeInTheDocument();

    // Categories
    expect(screen.getAllByText('Technicians').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Security').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Daily Works').length).toBeGreaterThan(0);

    // 6 Lifecycle Stages
    expect(screen.getByText('Received Req')).toBeInTheDocument();
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
    expect(screen.getAllByText('In Progress').length).toBeGreaterThan(0);
    expect(screen.getByText('Work Progress')).toBeInTheDocument();
    expect(screen.getByText('On Hold')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();

    // Diagram Hierarchy Flow
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('RWA')).toBeInTheDocument();
    expect(screen.getByText('Agency')).toBeInTheDocument();
    expect(screen.getByText(/Residence & Security/i)).toBeInTheDocument();
  });

  test('filters by category (Security, Technicians, Daily Works)', () => {
    render(<Services requests={mockRequests} />);

    // Click Security category tab
    const securityTab = screen.getByRole('button', { name: /Security/i });
    fireEvent.click(securityTab);

    // Security items should be visible
    expect(screen.getByText('Permission Request')).toBeInTheDocument();
    expect(screen.getByText('SEC-2001')).toBeInTheDocument();
    // Electrical Repair should not be in the filtered list
    expect(screen.queryByText('REQ-1001')).not.toBeInTheDocument();
  });

  test('performs CRUD operations: Create complaint, Allocate work, and Delete', () => {
    let currentRequests = [...mockRequests];
    const setRequests = (updated) => {
      currentRequests = updated;
    };

    const { rerender } = render(
      <Services requests={currentRequests} setRequests={setRequests} />
    );

    // 1. CREATE COMPLAINT
    const raiseBtn = screen.getByRole('button', { name: /\+ Raise Complaint \/ Case Order/i });
    fireEvent.click(raiseBtn);

    expect(screen.getByRole('heading', { name: /\+ Raise Complaint \/ Case Order/i })).toBeInTheDocument();

    const titleInput = screen.getByPlaceholderText(/e\.g\. Master Restroom/i);
    fireEvent.change(titleInput, { target: { value: 'Water Seepage Through Window Lintel' } });

    const descInput = screen.getByPlaceholderText(/Describe problem severity/i);
    fireEvent.change(descInput, { target: { value: 'Water entering the living room during rain' } });

    const residentInput = screen.getByPlaceholderText(/e\.g\. Kavya Sharma/i);
    fireEvent.change(residentInput, { target: { value: 'Kavya Sharma' } });

    const submitBtn = screen.getByRole('button', { name: /Raise Case & Dispatch/i });
    fireEvent.click(submitBtn);

    // Rerender with updated list
    rerender(<Services requests={currentRequests} setRequests={setRequests} />);
    expect(screen.getByText(/Water Seepage Through Window Lintel/i)).toBeInTheDocument();

    // 2. ALLOCATION OF WORK
    const allocateBtns = screen.getAllByRole('button', { name: /^Allocate$/i });
    fireEvent.click(allocateBtns[0]);

    expect(screen.getByRole('heading', { name: /Allocate:/i })).toBeInTheDocument();
    const confirmAllocateBtn = screen.getByRole('button', { name: /Confirm & Dispatch Allocation/i });
    fireEvent.click(confirmAllocateBtn);

    // 3. DELETE COMPLAINT
    const deleteBtns = screen.getAllByTitle(/Delete complaint/i);
    fireEvent.click(deleteBtns[0]);

    expect(screen.getByRole('heading', { name: /Delete Complaint/i })).toBeInTheDocument();
    const confirmDeleteBtn = screen.getByRole('button', { name: /Yes, Delete/i });
    fireEvent.click(confirmDeleteBtn);
  });
});
