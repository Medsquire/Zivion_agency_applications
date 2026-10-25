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
    technician: 'Suresh Babu, Mahesh Reddy',
    technicianId: 'TECH-001',
    assignedDate: '2026-10-11',
    targetDate: '2026-10-23',
    priority: 'High',
    status: 'In Progress',
    description: 'Frequent tripping of 32A MCB in master bedroom and sparking switchboard.',
    assignedTechnicians: [
      {
        soId: 'SO-041-01',
        technicianId: 'TECH-001',
        name: 'Suresh Babu',
        skill: 'Electrical & AC',
        mobile: '+91 98765 00001',
        role: 'Primary Specialist (Lead)',
        status: 'In Progress',
        assignedDate: '2026-10-11',
        targetDate: '2026-10-23',
        instructions: 'Test lead line isolation',
      },
      {
        soId: 'SO-041-02',
        technicianId: 'TECH-002',
        name: 'Mahesh Reddy',
        skill: 'Plumbing & Civil',
        mobile: '+91 98765 00002',
        role: 'Co-Specialist / Assistant',
        status: 'In Progress',
        assignedDate: '2026-10-11',
        targetDate: '2026-10-23',
        instructions: 'Assist with conduit inspection',
      },
    ],
    audio: {
      hasAudio: true,
      title: 'Resident Voice Note: Sparking Switchboard',
      duration: '0:35',
      durationSeconds: 35,
      sender: 'Kavya Sharma',
      sampleType: 'voice',
    },
    auditTrail: [
      { id: 1, action: 'Case Order Created', detail: 'Resident registered case', actor: 'Kavya Sharma', timestamp: 'Oct 22 10:00 AM', type: 'case' },
      { id: 2, action: 'Audio Note Attached', detail: 'Resident attached voice note', actor: 'Kavya Sharma', timestamp: 'Oct 22 10:05 AM', type: 'audio' },
      { id: 3, action: 'Work Order Dispatched', detail: 'Dispatched to 2 Technicians (SO-041-01, SO-041-02)', actor: 'Agency Central', timestamp: 'Oct 22 10:15 AM', type: 'dispatch' },
    ],
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

    expect(screen.getByRole('heading', { level: 1, name: /Services /i })).toBeInTheDocument();

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
    // Open edit modal for the first request, then trigger Allocate
    const editBtns = screen.getAllByTitle(/Edit complaint/i);
    fireEvent.click(editBtns[0]);

    const allocateInEdit = screen.getByRole('button', { name: /^Allocate$/i });
    fireEvent.click(allocateInEdit);

    expect(screen.getByRole('heading', { name: /Allocate:/i })).toBeInTheDocument();
    const confirmAllocateBtn = screen.getByRole('button', { name: /Confirm & Dispatch Allocation/i });
    fireEvent.click(confirmAllocateBtn);

    // 3. DELETE COMPLAINT
    // Open edit modal for the first request, then trigger Delete
    const editBtnsAfter = screen.getAllByTitle(/Edit complaint/i);
    fireEvent.click(editBtnsAfter[0]);

    const deleteInEdit = screen.getByRole('button', { name: /^Delete$/i });
    fireEvent.click(deleteInEdit);

    expect(screen.getByRole('heading', { name: /Delete Complaint/i })).toBeInTheDocument();
    const confirmDeleteBtn = screen.getByRole('button', { name: /Yes, Delete/i });
    fireEvent.click(confirmDeleteBtn);
  });

  test('supports Multi-Technician Allocation (SO-1, SO-2, SO-3) and displays SO badges', () => {
    let currentRequests = [...mockRequests];
    const setRequests = (updated) => {
      currentRequests = updated;
    };

    render(<Services requests={currentRequests} setRequests={setRequests} />);

    // Open allocation for SEC-2001 or REQ-1001 via edit modal
    const editBtns = screen.getAllByTitle(/Edit complaint/i);
    fireEvent.click(editBtns[0]);

    const allocateInEdit = screen.getByRole('button', { name: /^Allocate$/i });
    fireEvent.click(allocateInEdit);

    // Check technician count selector (1, 2, 3 buttons)
    const twoTechBtn = screen.getByRole('button', { name: /2 Technicians/i });
    expect(twoTechBtn).toBeInTheDocument();
    fireEvent.click(twoTechBtn);

    // Should now display fields for SO-1 and SO-2
    expect(screen.getByText(/Technician 1 · Primary Specialist/i)).toBeInTheDocument();
    expect(screen.getByText(/Technician 2 · Co-Specialist/i)).toBeInTheDocument();

    // Confirm dispatch
    const confirmBtn = screen.getByRole('button', { name: /Confirm & Dispatch Allocation/i });
    fireEvent.click(confirmBtn);

    // Updated request should have 2 technicians assigned
    expect(currentRequests[0].assignedTechnicians.length).toBe(2);
  });

  test('renders audio voice notes and dossier modal with workflow and audit trail', () => {
    render(<Services requests={mockRequests} />);

    // Open Dossier Modal by clicking on the clickable Request ID cell
    const dossierCell = screen.getAllByTitle(/View complaint & work order dossier/i)[0];
    fireEvent.click(dossierCell);

    // Verify audio player is rendered inside the Dossier Modal
    expect(screen.getAllByRole('button', { name: /Play audio/i }).length).toBeGreaterThan(0);

    // Header checks
    expect(screen.getByText(/Work Order & Complaint Dossier/i)).toBeInTheDocument();

    // Tabs exist
    const audioTab = screen.getByRole('button', { name: /Voice & Audio/i });
    const auditTab = screen.getByRole('button', { name: /Audit Trail/i });
    expect(audioTab).toBeInTheDocument();
    expect(auditTab).toBeInTheDocument();

    // Switch to Audit Trail tab
    fireEvent.click(auditTab);
    expect(screen.getAllByText(/Case Order Created/i).length).toBeGreaterThan(0);
  });

  test('comprehensive Edit Modal displays all details: Inbound from R/RWA, location, d&t, images, materials checklist, multi-tech allocation, and stage workflow', () => {
    let currentRequests = [...mockRequests];
    const setRequests = (updated) => {
      currentRequests = updated;
    };

    render(<Services requests={currentRequests} setRequests={setRequests} />);

    // Click Edit on the first request
    const editBtns = screen.getAllByTitle(/Edit complaint/i);
    fireEvent.click(editBtns[0]);

    // Header check
    expect(screen.getByText(/CASE ORDER & WORK ORDER DISPATCH WORKFLOW/i)).toBeInTheDocument();

    // 1. From R/RWA checks
    expect(screen.getAllByText(/1\. From Resident \/ RWA/i).length).toBeGreaterThan(0);
    expect(screen.getByDisplayValue('Kavya Sharma')).toBeInTheDocument();

    // 2. Where, Location, Date & Time (d & t)
    expect(screen.getByText(/Where, Location, Date & Time \(d & t\)/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Surya Enclave')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A-101')).toBeInTheDocument();
    expect(screen.getByDisplayValue('High')).toBeInTheDocument();

    // 3. Images & Media
    expect(screen.getByText(/3\. Images & Inspection Media/i)).toBeInTheDocument();

    // 4. Our Part: Materials Requisition
    expect(screen.getByText(/1\. Required Materials & Spare Parts Checklist/i)).toBeInTheDocument();
    const materialInput = screen.getByPlaceholderText(/Material \/ Part name\.\.\./i);
    fireEvent.change(materialInput, { target: { value: 'Insulated Screwdriver Set 1000V' } });
    const addMatBtn = screen.getByRole('button', { name: /\+ Add$/i });
    fireEvent.click(addMatBtn);
    expect(screen.getByText('Insulated Screwdriver Set 1000V')).toBeInTheDocument();

    // 5. Our Part: Multi-Technician Assignment (1, 2, 3 Techs)
    expect(screen.getByText(/2\. How Many Technicians to Assign\?/i)).toBeInTheDocument();
    const threeTechBtn = screen.getByRole('button', { name: /3 Technicians/i });
    fireEvent.click(threeTechBtn);
    expect(screen.getByText(/SO-3 · Support & Safety/i)).toBeInTheDocument();

    // 6. Stage Pipeline & Submit
    const inProgressStageBtn = screen.getAllByRole('button', { name: /● In Progress/i })[0];
    fireEvent.click(inProgressStageBtn);

    const saveBtn = screen.getByRole('button', { name: /Save Changes & Dispatch/i });
    fireEvent.click(saveBtn);

    // Verify modal closed and request was updated
    expect(screen.queryByText(/CASE ORDER & WORK ORDER DISPATCH WORKFLOW/i)).not.toBeInTheDocument();
  });
});
