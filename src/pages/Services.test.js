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
    priority: 'Urgent',
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
    priority: 'Normal',
    status: 'Pending',
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
    expect(screen.getAllByText('Pending').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Assigned').length).toBeGreaterThan(0);
    expect(screen.getAllByText('In Progress').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Hold').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Resolved').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Closed/i).length).toBeGreaterThan(0);

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

  test('streamlined Edit Modal displays clean UI without subtitles: Inbound complaint details are read-only (non-editable), agent adds technicians dynamically with Add button, adds materials, and sets stage', () => {
    let currentRequests = [...mockRequests];
    const setRequests = (updated) => {
      currentRequests = updated;
    };

    render(<Services requests={currentRequests} setRequests={setRequests} />);

    // Click Edit on the first request
    const editBtns = screen.getAllByTitle(/Edit complaint/i);
    fireEvent.click(editBtns[0]);

    // Simple Clean Header without subtitles
    expect(screen.getByText(/REQ-1001 · Electrical Repair/i)).toBeInTheDocument();

    // 1. Inbound Complaint (Read-only / Non-editable) checks
    expect(screen.getByText('Inbound Complaint')).toBeInTheDocument();
    expect(screen.getByText('Read-Only')).toBeInTheDocument();
    expect(screen.getAllByText('Kavya Sharma').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Surya Enclave/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Flat A-101/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Urgent Priority/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Inspection Photos/i)).toBeInTheDocument();

    // 2. Materials Requisition
    expect(screen.getByText(/Materials & Spare Parts/i)).toBeInTheDocument();
    const materialInput = screen.getByPlaceholderText(/Material \/ Part name\.\.\./i);
    fireEvent.change(materialInput, { target: { value: 'Insulated Screwdriver Set 1000V' } });
    const addMatBtn = screen.getByRole('button', { name: /\+ Add$/i });
    fireEvent.click(addMatBtn);
    expect(screen.getByText('Insulated Screwdriver Set 1000V')).toBeInTheDocument();

    // 3. Multi-Technician Assignment with Dynamic "+ Add Technician" button
    expect(screen.getByRole('button', { name: /Add Technician/i })).toBeInTheDocument();
    const addTechBtn = screen.getByRole('button', { name: /Add Technician/i });
    fireEvent.click(addTechBtn);
    expect(screen.getByText(/Technician 3/i)).toBeInTheDocument();

    // 4. Stage Transition & Submit
    const setAssignedBtn = screen.queryByRole('button', { name: /✓ Set to Assigned/i });
    if (setAssignedBtn) {
      fireEvent.click(setAssignedBtn);
    }

    const saveBtn = screen.getByRole('button', { name: /Save Changes & Dispatch/i });
    fireEvent.click(saveBtn);

    // Verify modal closed
    expect(screen.queryByText('Agency Assignment & Dispatch')).not.toBeInTheDocument();
  });

  test('Service Task column has small image photo icon and clicking it opens Inspection Media popup', () => {
    render(<Services requests={mockRequests} />);
    const photoBtns = screen.getAllByTitle(/Click to view Issue & Inspection Photos popup/i);
    expect(photoBtns.length).toBeGreaterThan(0);
    fireEvent.click(photoBtns[0]);
    expect(screen.getByText(/Inspection Media: Issue & IN \/ OUT Verification/i)).toBeInTheDocument();
  });

  test('filters requests apartment-wise and tower-wise with dynamic counts and reset functionality', () => {
    const multiApartmentRequests = [
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
        tower: 'Tower A',
        flatNo: 'A-101',
        technician: 'Suresh Babu',
        priority: 'Urgent',
        status: 'In Progress',
      },
      {
        id: 'REQ-1002',
        caseOrderId: 'CASE-2026-042',
        caseTitle: 'Balcony Pipeline Drainage Clog',
        workOrderId: 'WO-042-A',
        workOrderTitle: 'Hydro-jet clearing and trap replace',
        category: 'Technicians',
        service: 'Plumbing',
        resident: 'Priya Sharma',
        apartment: 'Golden Orbit',
        tower: 'Tower C',
        flatNo: 'C-305',
        technician: 'Mahesh Reddy',
        priority: 'Normal',
        status: 'Assigned',
      },
      {
        id: 'REQ-1003',
        caseOrderId: 'CASE-2026-039',
        caseTitle: 'Tower B Outdoor Inverter AC Service',
        workOrderId: 'WO-039-B',
        workOrderTitle: 'Compressor check and refrigerant recharge',
        category: 'Technicians',
        service: 'AC Maintenance',
        resident: 'Arjun Reddy',
        apartment: 'Sunrise Heights',
        tower: 'Tower B',
        flatNo: 'B-202',
        technician: 'Suresh Babu',
        priority: 'Normal',
        status: 'Resolved',
      },
      {
        id: 'REQ-1005',
        caseOrderId: 'CASE-2026-045',
        caseTitle: 'Tower B Ground Booster Pump Pressure Drop',
        workOrderId: 'WO-045-A',
        workOrderTitle: 'Impeller assembly & pressure sensor test',
        category: 'Technicians',
        service: 'Plumbing',
        resident: 'Ravi Kumar',
        apartment: 'Surya Enclave',
        tower: 'Tower B',
        flatNo: 'B-102',
        technician: 'Unassigned',
        priority: 'Urgent',
        status: 'Pending',
      },
    ];

    render(<Services requests={multiApartmentRequests} />);

    // 1. Initial State: All 4 requests visible
    expect(screen.getByText('REQ-1001')).toBeInTheDocument();
    expect(screen.getByText('REQ-1002')).toBeInTheDocument();
    expect(screen.getByText('REQ-1003')).toBeInTheDocument();
    expect(screen.getByText('REQ-1005')).toBeInTheDocument();
    expect(screen.getByText('4 of 4 cases')).toBeInTheDocument();

    // 2. Filter Apartment to "Surya Enclave"
    const aptSelect = screen.getByLabelText(/Filter by Apartment/i);
    fireEvent.change(aptSelect, { target: { value: 'Surya Enclave' } });

    // REQ-1001 & REQ-1005 should be visible, REQ-1002 and REQ-1003 should NOT
    expect(screen.getByText('REQ-1001')).toBeInTheDocument();
    expect(screen.getByText('REQ-1005')).toBeInTheDocument();
    expect(screen.queryByText('REQ-1002')).not.toBeInTheDocument();
    expect(screen.queryByText('REQ-1003')).not.toBeInTheDocument();
    expect(screen.getByText('2 of 4 cases')).toBeInTheDocument();

    // 3. Further Filter Tower to "Tower B"
    const towerSelect = screen.getByLabelText(/Filter by Tower/i);
    fireEvent.change(towerSelect, { target: { value: 'Tower B' } });

    // Only REQ-1005 should be visible (Surya Enclave + Tower B)
    expect(screen.getByText('REQ-1005')).toBeInTheDocument();
    expect(screen.queryByText('REQ-1001')).not.toBeInTheDocument();
    expect(screen.getByText('1 of 4 cases')).toBeInTheDocument();

    // 4. Click Reset button to clear all filters
    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    expect(resetBtn).toBeInTheDocument();
    fireEvent.click(resetBtn);

    // After reset, all 4 requests should be visible again
    expect(screen.getByText('REQ-1001')).toBeInTheDocument();
    expect(screen.getByText('REQ-1002')).toBeInTheDocument();
    expect(screen.getByText('REQ-1003')).toBeInTheDocument();
    expect(screen.getByText('REQ-1005')).toBeInTheDocument();
    expect(screen.getByText('4 of 4 cases')).toBeInTheDocument();
  });
});
