import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Technicians from './Technicians';

const mockTechnicians = [
  {
    id: 'TECH-001',
    name: 'Suresh Babu',
    skill: 'Electrical & AC',
    mobile: '9876500001',
    status: 'Assigned',
    apartment: 'Surya Enclave',
    role: 'Primary Specialist (Lead)',
  },
  {
    id: 'TECH-002',
    name: 'Mahesh Reddy',
    skill: 'Plumbing & Civil',
    mobile: '9876500002',
    status: 'Available',
    apartment: 'All Communities',
    role: 'Field Specialist',
  },
];

const mockRequests = [
  {
    id: 'REQ-1001',
    workOrderId: 'WO-041-A',
    service: 'Electrical Repair',
    apartment: 'Surya Enclave',
    flatNo: 'A-101',
    assignedTechnicians: [
      {
        soId: 'SO-041-01',
        technicianId: 'TECH-001',
        name: 'Suresh Babu',
        role: 'Primary Specialist (Lead)',
        status: 'In Progress',
      },
    ],
  },
];

describe('Technicians CRUD Operations & Management', () => {
  test('renders technician directory, summary cards, and filter controls', () => {
    render(<Technicians technicians={mockTechnicians} requests={mockRequests} />);

    expect(screen.getByRole('heading', { level: 1, name: /Technicians/i })).toBeInTheDocument();
    expect(screen.getByText('Total Technicians')).toBeInTheDocument();
    expect(screen.getByText('Available Specialists')).toBeInTheDocument();
    expect(screen.getByText('Assigned on Work')).toBeInTheDocument();
    expect(screen.getByText('Dispatched SOs (so1/so2/so3)')).toBeInTheDocument();

    // Table rows
    expect(screen.getByText('Suresh Babu')).toBeInTheDocument();
    expect(screen.getByText('Mahesh Reddy')).toBeInTheDocument();

    // Service order badge for Suresh Babu
    expect(screen.getByText('SO-041-01')).toBeInTheDocument();
  });

  test('performs CREATE operation: Adds a new technician via modal', () => {
    let currentList = [...mockTechnicians];
    const setTechnicians = (newList) => {
      currentList = newList;
    };

    const { rerender } = render(
      <Technicians technicians={currentList} setTechnicians={setTechnicians} />
    );

    // Open Add Modal
    const addBtn = screen.getByRole('button', { name: /\+ Add Technician/i });
    fireEvent.click(addBtn);

    expect(screen.getByRole('heading', { name: /\+ Add Technician \/ Specialist/i })).toBeInTheDocument();

    // Fill form
    const nameInput = screen.getByPlaceholderText(/e\.g\. Ramesh Verma/i);
    fireEvent.change(nameInput, { target: { value: 'Ramesh Verma' } });

    const phoneInput = screen.getByPlaceholderText(/e\.g\. 9876500004/i);
    fireEvent.change(phoneInput, { target: { value: '9876500004' } });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Save & Onboard Specialist/i });
    fireEvent.click(submitBtn);

    // Verify callback was called
    expect(currentList.length).toBe(3);
    expect(currentList[0].name).toBe('Ramesh Verma');

    // Rerender and assert
    rerender(<Technicians technicians={currentList} setTechnicians={setTechnicians} />);
    expect(screen.getByText('Ramesh Verma')).toBeInTheDocument();
  });

  test('performs READ operation: Views specialist profile & dossier modal', () => {
    render(<Technicians technicians={mockTechnicians} requests={mockRequests} />);

    // Click View profile button for Suresh Babu
    const viewBtns = screen.getAllByTitle(/View Specialist Profile/i);
    fireEvent.click(viewBtns[0]);

    // Modal should show dossier header and assigned SO
    expect(screen.getByText(/TECHNICIAN DOSSIER/i)).toBeInTheDocument();
    expect(screen.getAllByText('Suresh Babu').length).toBeGreaterThan(0);
    expect(screen.getAllByText('9876500001').length).toBeGreaterThan(0);
  });

  test('performs UPDATE operation: Edits specialist details', () => {
    let currentList = [...mockTechnicians];
    const setTechnicians = (newList) => {
      currentList = newList;
    };

    const { rerender } = render(
      <Technicians technicians={currentList} setTechnicians={setTechnicians} />
    );

    // Click Edit button on Mahesh Reddy
    const editBtns = screen.getAllByTitle(/Edit Specialist/i);
    fireEvent.click(editBtns[1]);

    expect(screen.getByRole('heading', { name: /Edit: Mahesh Reddy/i })).toBeInTheDocument();

    // Change mobile number
    const phoneInput = screen.getByDisplayValue('9876500002');
    fireEvent.change(phoneInput, { target: { value: '9876599999' } });

    // Submit edit
    const updateBtn = screen.getByRole('button', { name: /Update Specialist/i });
    fireEvent.click(updateBtn);

    // Verify callback updated the item
    expect(currentList[1].mobile).toBe('9876599999');

    rerender(<Technicians technicians={currentList} setTechnicians={setTechnicians} />);
    expect(screen.getByText('9876599999')).toBeInTheDocument();
  });

  test('performs DELETE operation: Removes specialist via confirmation modal', () => {
    let currentList = [...mockTechnicians];
    const setTechnicians = (newList) => {
      currentList = newList;
    };

    const { rerender } = render(
      <Technicians technicians={currentList} setTechnicians={setTechnicians} />
    );

    // Click Delete button on Mahesh Reddy
    const deleteBtns = screen.getAllByTitle(/Delete Specialist/i);
    fireEvent.click(deleteBtns[1]);

    expect(screen.getByRole('heading', { name: /Delete Specialist/i })).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to remove specialist/i)).toBeInTheDocument();

    // Confirm Delete
    const confirmBtn = screen.getByRole('button', { name: /Yes, Remove Specialist/i });
    fireEvent.click(confirmBtn);

    // Verify removed
    expect(currentList.length).toBe(1);
    expect(currentList.some((t) => t.name === 'Mahesh Reddy')).toBe(false);

    rerender(<Technicians technicians={currentList} setTechnicians={setTechnicians} />);
    expect(screen.queryByText('Mahesh Reddy')).not.toBeInTheDocument();
  });

  test('supports search query and status filter pills', () => {
    render(<Technicians technicians={mockTechnicians} requests={mockRequests} />);

    // Filter by Assigned
    const assignedPill = screen.getByRole('button', { name: /Assigned/i });
    fireEvent.click(assignedPill);

    expect(screen.getByText('Suresh Babu')).toBeInTheDocument();
    expect(screen.queryByText('Mahesh Reddy')).not.toBeInTheDocument();

    // Switch back to All
    const allPill = screen.getByRole('button', { name: /All 2/i });
    fireEvent.click(allPill);

    expect(screen.getByText('Mahesh Reddy')).toBeInTheDocument();

    // Search for "Suresh"
    const searchInput = screen.getByPlaceholderText(/Search by name, ID/i);
    fireEvent.change(searchInput, { target: { value: 'Suresh' } });

    expect(screen.getByText('Suresh Babu')).toBeInTheDocument();
    expect(screen.queryByText('Mahesh Reddy')).not.toBeInTheDocument();
  });
});
