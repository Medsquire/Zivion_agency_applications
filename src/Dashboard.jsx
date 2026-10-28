
import React, { useState } from 'react';
import './Dashboard.css';

import Sidebar from './components/Sidebar';
import DashboardHome from './pages/DashboardHome';
import Properties, { apartmentNames } from './pages/Properties';
import Services from './pages/Services';
import Technicians from './pages/Technicians';
import Reports from './pages/Reports';
import ProfileAvatar from './components/ProfileAvatar';
import ThemeToggle from './components/ThemeToggle';
import { getSidebarIcon } from './components/AppIcons';
import { UserProvider, useUser } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';

function DashboardContent({ onLogout }) {
    const { user, updateUser, uploadPhoto } = useUser();
    const [activePage, setActivePage] = useState('Dashboard');
    const [agencyAssignments, setAgencyAssignments] = useState({});
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileFormData, setProfileFormData] = useState({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        agencyName: user.agencyName,
        photoUrl: user.photoUrl || '',
    });

    const [requests, setRequests] = useState([
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
            technician: 'Suresh Babu, Kiran Rao',
            technicianId: 'TECH-001',
            assignedDate: '2026-10-11',
            targetDate: '2026-10-23',
            priority: 'Urgent',
            status: 'In Progress',
            holdReason: '',
            description: 'Frequent tripping of 32A MCB in master bedroom and sparking switchboard.',
            issueImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
            inImage: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=800&q=80',
            outImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
            inTime: '2026-10-11 10:25 AM',
            outTime: '2026-10-11 01:40 PM',
            inNotes: 'Technician Suresh Babu checked in at site. Switchboard isolated and voltage reading verified at 230V.',
            outNotes: 'Rewiring complete with 32A MCB breaker replaced and verified under full 16A load test.',
            assignedTechnicians: [
                {
                    soId: 'SO-041-01',
                    technicianId: 'TECH-001',
                    name: 'Suresh Babu',
                    skill: 'Electrical & AC',
                    mobile: '+91 98765 00001',
                    role: 'Lead Electrician',
                    assignedDate: '2026-10-11',
                    targetDate: '2026-10-23',
                    status: 'In Progress',
                    instructions: 'Isolate 32A MCB, check phase voltage, rewire switchboard.',
                },
                {
                    soId: 'SO-041-02',
                    technicianId: 'TECH-003',
                    name: 'Kiran Rao',
                    skill: 'Civil Maintenance',
                    mobile: '+91 98765 00003',
                    role: 'Assistant / Wall Chasing',
                    assignedDate: '2026-10-11',
                    targetDate: '2026-10-23',
                    status: 'In Progress',
                    instructions: 'Open conduit cavity and patch wall plaster.',
                },
            ],
            audio: {
                hasAudio: true,
                title: 'Resident Voice Note: Switchboard buzzing & spark sound in bedroom',
                duration: '0:42',
                durationSeconds: 42,
                sender: 'Kavya Sharma (Resident)',
                recordedAt: '2026-10-11 10:14 AM',
                sampleType: 'sparking-noise',
            },
            auditTrail: [
                { id: 1, action: 'Case Order Created', detail: 'Resident raised CASE-2026-041 via Bee Resident App', actor: 'Kavya Sharma', timestamp: '2026-10-11 09:15 AM', type: 'case' },
                { id: 2, action: 'Audio Note Attached', detail: 'Audio memo (0:42) recorded by resident attached to case', actor: 'Kavya Sharma', timestamp: '2026-10-11 09:16 AM', type: 'audio' },
                { id: 3, action: 'Work Order Generated', detail: 'Agency generated Work Order WO-041-A', actor: 'Lalitha (Agency)', timestamp: '2026-10-11 09:45 AM', type: 'wo' },
                { id: 4, action: 'SO-01 Assigned', detail: 'Service Order SO-041-01 assigned to Suresh Babu (Lead Electrician)', actor: 'Agency Dispatcher', timestamp: '2026-10-11 10:00 AM', type: 'dispatch' },
                { id: 5, action: 'SO-02 Assigned', detail: 'Service Order SO-041-02 assigned to Kiran Rao (Civil Assistant)', actor: 'Agency Dispatcher', timestamp: '2026-10-11 10:05 AM', type: 'dispatch' },
                { id: 6, action: 'Stage: In Progress', detail: 'Technicians checked in at site, work commenced', actor: 'Suresh Babu', timestamp: '2026-10-11 10:30 AM', type: 'status' },
            ],
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
            flatNo: 'C-305',
            technician: 'Mahesh Reddy, Kiran Rao, Suresh Babu',
            technicianId: 'TECH-002',
            assignedDate: '2026-10-10',
            targetDate: '2026-10-22',
            priority: 'Normal',
            status: 'Assigned',
            holdReason: '',
            description: 'Balcony drain overflowing during rain, water backing up into living area.',
            issueImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
            inImage: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80',
            outImage: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80',
            inTime: '2026-10-10 03:20 PM',
            outTime: '2026-10-10 05:15 PM',
            inNotes: 'Mahesh Reddy checked in. Heavy debris found choking 75mm drain neck.',
            outNotes: 'Hydro-jet clearing executed. New heavy-duty SS-304 jali fitted with silicone seal.',
            assignedTechnicians: [
                {
                    soId: 'SO-042-01',
                    technicianId: 'TECH-002',
                    name: 'Mahesh Reddy',
                    skill: 'Plumbing & Civil',
                    mobile: '+91 98765 00002',
                    role: 'Lead Plumber',
                    assignedDate: '2026-10-10',
                    targetDate: '2026-10-22',
                    status: 'Assigned',
                    instructions: 'Hydro-jet drain trap and clear sediment build-up.',
                },
                {
                    soId: 'SO-042-02',
                    technicianId: 'TECH-003',
                    name: 'Kiran Rao',
                    skill: 'Civil Maintenance',
                    mobile: '+91 98765 00003',
                    role: 'Civil Specialist',
                    assignedDate: '2026-10-10',
                    targetDate: '2026-10-22',
                    status: 'Assigned',
                    instructions: 'Reseal balcony perimeter tiles and floor drain rim.',
                },
                {
                    soId: 'SO-042-03',
                    technicianId: 'TECH-001',
                    name: 'Suresh Babu',
                    skill: 'Electrical & AC',
                    mobile: '+91 98765 00001',
                    role: 'Safety & Sump Check',
                    assignedDate: '2026-10-10',
                    targetDate: '2026-10-22',
                    status: 'Assigned',
                    instructions: 'Ensure rainwater run-off is away from electrical duct.',
                },
            ],
            audio: {
                hasAudio: true,
                title: 'Resident Voice Note: Water bubbling & overflow during heavy rain',
                duration: '0:36',
                durationSeconds: 36,
                sender: 'Priya Sharma (Resident)',
                recordedAt: '2026-10-10 03:22 PM',
                sampleType: 'voice',
            },
            auditTrail: [
                { id: 1, action: 'Case Order Created', detail: 'Resident raised CASE-2026-042 for balcony drain', actor: 'Priya Sharma', timestamp: '2026-10-10 02:40 PM', type: 'case' },
                { id: 2, action: 'Audio Note Attached', detail: 'Resident recorded 36s audio note of balcony overflow', actor: 'Priya Sharma', timestamp: '2026-10-10 02:42 PM', type: 'audio' },
                { id: 3, action: 'Work Order Generated', detail: 'Agency created Work Order WO-042-A', actor: 'Lalitha (Agency)', timestamp: '2026-10-10 03:00 PM', type: 'wo' },
                { id: 4, action: 'SO-01 Assigned', detail: 'SO-042-01 assigned to Mahesh Reddy (Lead Plumber)', actor: 'Agency Dispatcher', timestamp: '2026-10-10 03:15 PM', type: 'dispatch' },
                { id: 5, action: 'SO-02 Assigned', detail: 'SO-042-02 assigned to Kiran Rao (Civil Specialist)', actor: 'Agency Dispatcher', timestamp: '2026-10-10 03:18 PM', type: 'dispatch' },
                { id: 6, action: 'SO-03 Assigned', detail: 'SO-042-03 assigned to Suresh Babu (Safety Inspector)', actor: 'Agency Dispatcher', timestamp: '2026-10-10 03:20 PM', type: 'dispatch' },
            ],
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
            flatNo: 'B-202',
            technician: 'Suresh Babu',
            technicianId: 'TECH-001',
            assignedDate: '2026-10-09',
            targetDate: '2026-10-11',
            priority: 'Normal',
            status: 'Resolved',
            holdReason: '',
            description: 'AC blowing lukewarm air; refrigerant coil cleaned and topped up.',
            issueImage: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80',
            inImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80',
            outImage: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
            inTime: '2026-10-09 11:15 AM',
            outTime: '2026-10-11 02:00 PM',
            inNotes: 'Suresh Babu arrived at Tower B terrace. Found R32 refrigerant pressure low at 60 PSI.',
            outNotes: 'Condenser fins washed, R32 topped up to 125 PSI, temperature drop verified at 18°C.',
            assignedTechnicians: [
                {
                    soId: 'SO-039-01',
                    technicianId: 'TECH-001',
                    name: 'Suresh Babu',
                    skill: 'Electrical & AC',
                    mobile: '+91 98765 00001',
                    role: 'Lead HVAC Specialist',
                    assignedDate: '2026-10-09',
                    targetDate: '2026-10-11',
                    status: 'Resolved',
                    instructions: 'Clean compressor fins and recharge R32 gas.',
                },
            ],
            audio: {
                hasAudio: true,
                title: 'Resident Voice Note: AC making whistling noise and blowing lukewarm air',
                duration: '0:25',
                durationSeconds: 25,
                sender: 'Arjun Reddy (Resident)',
                recordedAt: '2026-10-09 11:15 AM',
                sampleType: 'voice',
            },
            auditTrail: [
                { id: 1, action: 'Case Order Created', detail: 'Resident raised CASE-2026-039 for AC servicing', actor: 'Arjun Reddy', timestamp: '2026-10-09 10:30 AM', type: 'case' },
                { id: 2, action: 'Audio Note Attached', detail: 'Audio memo (0:25) attached by resident', actor: 'Arjun Reddy', timestamp: '2026-10-09 10:32 AM', type: 'audio' },
                { id: 3, action: 'Work Order Generated', detail: 'Agency generated Work Order WO-039-B', actor: 'Lalitha (Agency)', timestamp: '2026-10-09 10:45 AM', type: 'wo' },
                { id: 4, action: 'SO-01 Assigned', detail: 'SO-039-01 assigned to Suresh Babu (HVAC Specialist)', actor: 'Agency Dispatcher', timestamp: '2026-10-09 11:00 AM', type: 'dispatch' },
                { id: 5, action: 'Resolved', detail: 'AC serviced, temperature tested at 18°C, signed off', actor: 'Suresh Babu', timestamp: '2026-10-11 02:00 PM', type: 'status' },
            ],
        },
        {
            id: 'REQ-1004',
            caseOrderId: 'CASE-2026-044',
            caseTitle: 'Exterior Parapet Seepage Inspection',
            workOrderId: 'WO-044-A',
            workOrderTitle: 'Rope-access crack injection & waterproof coat',
            category: 'Technicians',
            service: 'Civil Maintenance',
            resident: 'Sneha Rao',
            apartment: 'SKYLINE HOMES',
            flatNo: 'A-204',
            technician: 'Kiran Rao, Mahesh Reddy',
            technicianId: 'TECH-003',
            assignedDate: '2026-10-11',
            targetDate: '2026-10-24',
            priority: 'Urgent',
            status: 'Hold',
            holdReason: 'Awaiting high-grade elastomer polymer sealant supply from regional depot.',
            description: 'Water seepage entering through external lintel corner during monsoon downpours.',
            issueImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
            inImage: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
            outImage: null,
            inTime: '2026-10-11 09:40 AM',
            outTime: null,
            inNotes: 'Kiran Rao & Mahesh Reddy checked in. Identified 1.8mm structural crack along facade groove.',
            outNotes: 'Currently on hold awaiting elastomer polymer delivery from supplier.',
            assignedTechnicians: [
                {
                    soId: 'SO-044-01',
                    technicianId: 'TECH-003',
                    name: 'Kiran Rao',
                    skill: 'Civil Maintenance',
                    mobile: '+91 98765 00003',
                    role: 'Lead Mason',
                    assignedDate: '2026-10-11',
                    targetDate: '2026-10-24',
                    status: 'Hold',
                    instructions: 'Rope access inspection of external hairline crack.',
                },
                {
                    soId: 'SO-044-02',
                    technicianId: 'TECH-002',
                    name: 'Mahesh Reddy',
                    skill: 'Plumbing & Civil',
                    mobile: '+91 98765 00002',
                    role: 'Waterproofing Specialist',
                    assignedDate: '2026-10-11',
                    targetDate: '2026-10-24',
                    status: 'Hold',
                    instructions: 'Apply polyurethane coat once materials arrive.',
                },
            ],
            audio: {
                hasAudio: true,
                title: 'Resident Voice Note: Dripping water behind bedroom wall during storm',
                duration: '0:55',
                durationSeconds: 55,
                sender: 'Sneha Rao (Resident)',
                recordedAt: '2026-10-11 08:45 AM',
                sampleType: 'voice',
            },
            auditTrail: [
                { id: 1, action: 'Case Order Created', detail: 'Resident raised CASE-2026-044 for exterior wall seepage', actor: 'Sneha Rao', timestamp: '2026-10-11 08:00 AM', type: 'case' },
                { id: 2, action: 'Audio Note Attached', detail: 'Resident voice memo (0:55) attached', actor: 'Sneha Rao', timestamp: '2026-10-11 08:05 AM', type: 'audio' },
                { id: 3, action: 'Work Order Generated', detail: 'Agency created Work Order WO-044-A', actor: 'Lalitha (Agency)', timestamp: '2026-10-11 09:00 AM', type: 'wo' },
                { id: 4, action: 'SO-01 Assigned', detail: 'SO-044-01 assigned to Kiran Rao (Lead Mason)', actor: 'Agency Dispatcher', timestamp: '2026-10-11 09:30 AM', type: 'dispatch' },
                { id: 5, action: 'SO-02 Assigned', detail: 'SO-044-02 assigned to Mahesh Reddy (Waterproofing)', actor: 'Agency Dispatcher', timestamp: '2026-10-11 09:35 AM', type: 'dispatch' },
                { id: 6, action: 'Hold', detail: 'Placed on hold awaiting elastomer polymer supply', actor: 'Kiran Rao', timestamp: '2026-10-12 11:20 AM', type: 'status' },
            ],
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
            flatNo: 'B-102',
            technician: 'Unassigned',
            technicianId: '',
            assignedDate: '2026-10-22',
            targetDate: '2026-10-25',
            priority: 'Urgent',
            status: 'Pending',
            holdReason: '',
            description: 'Water pressure in upper floors dropping below 1.5 bar; requires urgent allocation.',
            issueImage: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80',
            inImage: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
            outImage: null,
            inTime: '2026-10-22 09:15 AM',
            outTime: null,
            inNotes: 'Facility manager logged initial inspection. High pump vibration with pressure drop to 1.2 bar.',
            outNotes: 'Awaiting plumbing contractor dispatch.',
            assignedTechnicians: [],
            audio: {
                hasAudio: true,
                title: 'Facility Manager Voice Memo: Booster pump high vibration & pressure drop alert',
                duration: '0:34',
                durationSeconds: 34,
                sender: 'Ravi Kumar (Facility Manager)',
                recordedAt: '2026-10-22 09:10 AM',
                sampleType: 'voice',
            },
            auditTrail: [
                { id: 1, action: 'Case Order Created', detail: 'Facility raised CASE-2026-045 for booster pump fault', actor: 'Ravi Kumar', timestamp: '2026-10-22 09:00 AM', type: 'case' },
                { id: 2, action: 'Audio Note Attached', detail: 'Facility manager voice memo (0:34) attached to complaint', actor: 'Ravi Kumar', timestamp: '2026-10-22 09:05 AM', type: 'audio' },
                { id: 3, action: 'Work Order Generated', detail: 'Agency created Work Order WO-045-A (Awaiting allocation)', actor: 'Lalitha (Agency)', timestamp: '2026-10-22 09:20 AM', type: 'wo' },
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
            holdReason: '',
            description: 'Delivery truck carrying modular sofa arriving at 11:00 AM; requires gate pass and service lift wall padding.',
            issueImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
            inImage: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80',
            outImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
            inTime: '2026-10-22 11:00 AM',
            outTime: '2026-10-22 12:15 PM',
            inNotes: 'Gate 2 security verified vehicle permit and resident identity.',
            outNotes: 'Lift wall padding installed, sofa safely delivered to Flat A-101.',
            assignedTechnicians: [
                {
                    soId: 'SO-SEC-01',
                    technicianId: 'SEC-001',
                    name: 'Security Desk',
                    skill: 'Gate & Visitor Approvals',
                    mobile: '+91 98765 00010',
                    role: 'Gate 2 Supervisor',
                    assignedDate: '2026-10-22',
                    targetDate: '2026-10-23',
                    status: 'Pending',
                    instructions: 'Inspect vehicle pass and issue padded lift access.',
                },
            ],
            audio: {
                hasAudio: true,
                title: 'Resident Voice Note: Delivery timing and heavy furniture details',
                duration: '0:22',
                durationSeconds: 22,
                sender: 'Kavya Sharma (Resident)',
                recordedAt: '2026-10-22 08:30 AM',
                sampleType: 'voice',
            },
            auditTrail: [
                { id: 1, action: 'Permission Request Filed', detail: 'Resident raised CASE-SEC-012 for heavy furniture lift pass', actor: 'Kavya Sharma', timestamp: '2026-10-22 08:15 AM', type: 'case' },
                { id: 2, action: 'Audio Memo Attached', detail: 'Resident attached 22s delivery instructions', actor: 'Kavya Sharma', timestamp: '2026-10-22 08:18 AM', type: 'audio' },
                { id: 3, action: 'Work Order Generated', detail: 'Agency created Security Work Order WO-SEC-01', actor: 'Agency Admin', timestamp: '2026-10-22 08:45 AM', type: 'wo' },
            ],
        },
        {
            id: 'SEC-2002',
            caseOrderId: 'CASE-SEC-014',
            caseTitle: 'Interior Carpentry Contractor Multi-Day Gate Pass',
            workOrderId: 'WO-SEC-02',
            workOrderTitle: 'Contractor ID verification & noisy work permit',
            category: 'Security',
            service: 'Approval Request',
            securityPassType: 'Approval Request',
            resident: 'Vikram Malhotra',
            apartment: 'SKYLINE HOMES',
            flatNo: '1-402',
            technician: 'Security Desk',
            technicianId: 'SEC-001',
            assignedDate: '2026-10-18',
            targetDate: '2026-10-28',
            priority: 'Normal',
            status: 'In Progress',
            holdReason: '',
            description: '4 interior carpenters given biometric gate access; working hours capped 09:30 - 17:30 as per RWA rules.',
            assignedTechnicians: [
                {
                    soId: 'SO-SEC-02',
                    technicianId: 'SEC-001',
                    name: 'Security Desk',
                    skill: 'Gate & Visitor Approvals',
                    mobile: '+91 98765 00010',
                    role: 'Main Gate Access Controller',
                    assignedDate: '2026-10-18',
                    targetDate: '2026-10-28',
                    status: 'In Progress',
                    instructions: 'Enforce daily biometric log and sound level monitoring.',
                },
            ],
            auditTrail: [
                { id: 1, action: 'Contractor Approval Raised', detail: 'Resident filed CASE-SEC-014 for carpentry pass', actor: 'Vikram Malhotra', timestamp: '2026-10-18 09:00 AM', type: 'case' },
                { id: 2, action: 'Work Order Generated', detail: 'Agency dispatched WO-SEC-02', actor: 'Agency Dispatcher', timestamp: '2026-10-18 09:30 AM', type: 'wo' },
            ],
        },
        {
            id: 'SEC-2003',
            caseOrderId: 'CASE-SEC-015',
            caseTitle: 'Visitor Overnight Vehicle Parking Authorization',
            workOrderId: 'WO-SEC-03',
            workOrderTitle: 'Visitor parking bay allocation & barcode pass',
            category: 'Security',
            service: 'Permission Request',
            securityPassType: 'Permission Request',
            resident: 'Arjun Reddy',
            apartment: 'Sunrise Heights',
            flatNo: 'B-202',
            technician: 'Security Desk',
            technicianId: 'SEC-001',
            assignedDate: '2026-10-15',
            targetDate: '2026-10-16',
            priority: 'Normal',
            status: 'Closed',
            holdReason: '',
            description: 'Guest vehicle TS-09-EA-4412 approved for overnight parking in Visitor Bay V-12.',
            assignedTechnicians: [
                {
                    soId: 'SO-SEC-03',
                    technicianId: 'SEC-001',
                    name: 'Security Desk',
                    skill: 'Gate & Visitor Approvals',
                    mobile: '+91 98765 00010',
                    role: 'Visitor Bay Officer',
                    assignedDate: '2026-10-15',
                    targetDate: '2026-10-16',
                    status: 'Closed',
                    instructions: 'Scan barcode and park in V-12 slot.',
                },
            ],
            auditTrail: [
                { id: 1, action: 'Parking Request', detail: 'CASE-SEC-015 raised for visitor bay V-12', actor: 'Arjun Reddy', timestamp: '2026-10-15 05:00 PM', type: 'case' },
                { id: 2, action: 'Closed by RWA/Resident', detail: 'Resident Arjun Reddy verified parking completed and closed gate record', actor: 'Arjun Reddy (Resident)', timestamp: '2026-10-16 10:00 AM', type: 'status' },
            ],
        },
        {
            id: 'DAY-3001',
            caseOrderId: 'CASE-DAY-008',
            caseTitle: 'Community Organic Waste Segregation & Green Bin Ops',
            workOrderId: 'WO-DAY-01',
            workOrderTitle: 'Door-to-door wet waste collection & composter feed',
            category: 'Daily Works',
            service: 'Waste & Garbage Collection',
            dailyWorkFrequency: 'Daily',
            resident: 'Community Association',
            apartment: 'Surya Enclave',
            flatNo: 'Towers A, B, C',
            technician: 'Daily Works Crew',
            technicianId: 'DAY-001',
            assignedDate: '2026-10-22',
            targetDate: '2026-10-22',
            priority: 'Normal',
            status: 'In Progress',
            holdReason: '',
            description: 'Daily morning wet and dry segregated collection across all 144 residential flats.',
            assignedTechnicians: [
                {
                    soId: 'SO-DAY-01',
                    technicianId: 'DAY-001',
                    name: 'Daily Works Crew',
                    skill: 'Sanitation & Housekeeping',
                    mobile: '+91 98765 00020',
                    role: 'Sanitation Lead',
                    assignedDate: '2026-10-22',
                    targetDate: '2026-10-22',
                    status: 'In Progress',
                    instructions: 'Wet waste collection from Towers A, B, C to organic composter.',
                },
            ],
            auditTrail: [
                { id: 1, action: 'Daily Schedule Initiated', detail: 'Routine daily work order WO-DAY-01 triggered', actor: 'Bee Scheduler', timestamp: '2026-10-22 06:00 AM', type: 'wo' },
            ],
        },
        {
            id: 'DAY-3002',
            caseOrderId: 'CASE-DAY-009',
            caseTitle: 'Central Clubhouse Sanitization & Pool Chlorination',
            workOrderId: 'WO-DAY-02',
            workOrderTitle: 'Pool pH balancing, gym equipment sanitization',
            category: 'Daily Works',
            service: 'Daily Housekeeping',
            dailyWorkFrequency: 'Daily',
            resident: 'Clubhouse In-Charge',
            apartment: 'Golden Orbit',
            flatNo: 'Clubhouse Facility',
            technician: 'Daily Works Crew',
            technicianId: 'DAY-001',
            assignedDate: '2026-10-21',
            targetDate: '2026-10-21',
            priority: 'Normal',
            status: 'Resolved',
            holdReason: '',
            description: 'Swimming pool backwash completed; chlorine levels verified at 2.0 ppm; gym wiped with disinfectant.',
            assignedTechnicians: [
                {
                    soId: 'SO-DAY-02',
                    technicianId: 'DAY-001',
                    name: 'Daily Works Crew',
                    skill: 'Sanitation & Housekeeping',
                    mobile: '+91 98765 00020',
                    role: 'Clubhouse Caretaker',
                    assignedDate: '2026-10-21',
                    targetDate: '2026-10-21',
                    status: 'Resolved',
                    instructions: 'Pool backwash and chlorine check.',
                },
            ],
            auditTrail: [
                { id: 1, action: 'Daily Work Done', detail: 'Pool pH 7.4, chlorine 2.0ppm verified', actor: 'Daily Works Crew', timestamp: '2026-10-21 11:30 AM', type: 'status' },
            ],
        },
        {
            id: 'DAY-3003',
            caseOrderId: 'CASE-DAY-010',
            caseTitle: 'Overhead Tank Water Inflow & Municipal Pipeline Check',
            workOrderId: 'WO-DAY-03',
            workOrderTitle: 'Main sump inflow meter check & tanker logs',
            category: 'Daily Works',
            service: 'Water Supply Operations',
            dailyWorkFrequency: 'Daily',
            resident: 'Facility Office',
            apartment: 'SKYLINE HOMES',
            flatNo: 'Sump & Pump House',
            technician: 'Daily Works Crew',
            technicianId: 'DAY-001',
            assignedDate: '2026-10-22',
            targetDate: '2026-10-22',
            priority: 'Urgent',
            status: 'In Progress',
            holdReason: '',
            description: 'Water tanker inflow received (40,000L); overhead tank transfer 65% completed.',
            assignedTechnicians: [
                {
                    soId: 'SO-DAY-03',
                    technicianId: 'DAY-001',
                    name: 'Daily Works Crew',
                    skill: 'Sanitation & Housekeeping',
                    mobile: '+91 98765 00020',
                    role: 'Pump Operator',
                    assignedDate: '2026-10-22',
                    targetDate: '2026-10-22',
                    status: 'In Progress',
                    instructions: 'Monitor main sump levels and pump transfer to overhead tank.',
                },
            ],
            auditTrail: [
                { id: 1, action: 'Water Inflow Logged', detail: '40,000L municipal tanker received', actor: 'Daily Works Crew', timestamp: '2026-10-22 07:00 AM', type: 'status' },
            ],
        },
    ]);

    const [technicians, setTechnicians] = useState([
        {
            id: 'TECH-001',
            name: 'Suresh Babu',
            skill: 'Electrical & AC',
            mobile: '9876500001',
            status: 'Assigned',
        },
        {
            id: 'TECH-002',
            name: 'Mahesh Reddy',
            skill: 'Plumbing & Civil',
            mobile: '9876500002',
            status: 'Assigned',
        },
        {
            id: 'TECH-003',
            name: 'Kiran Rao',
            skill: 'Civil Maintenance',
            mobile: '9876500003',
            status: 'Available',
        },
        {
            id: 'SEC-001',
            name: 'Security Desk',
            skill: 'Gate & Visitor Control',
            mobile: '9876500010',
            status: 'Available',
        },
        {
            id: 'DAY-001',
            name: 'Daily Works Crew',
            skill: 'Housekeeping & Sanitation',
            mobile: '9876500020',
            status: 'Available',
        },
    ]);

    const [payments] = useState([
        {
            id: 'PAY-1001',
            resident: 'Ravi Kumar',
            service: 'Electrical Repair',
            amount: 1500,
            status: 'Pending',
        },
        {
            id: 'PAY-1002',
            resident: 'Priya Sharma',
            service: 'Plumbing',
            amount: 800,
            status: 'Paid',
        },
        {
            id: 'PAY-1003',
            resident: 'Arjun Reddy',
            service: 'AC Maintenance',
            amount: 2000,
            status: 'Paid',
        },
    ]);

    const updateRequestField = (id, field, value) => {
        setRequests((previous) =>
            previous.map((request) =>
                request.id === id
                    ? { ...request, [field]: value }
                    : request
            )
        );
    };

    const updateRequestStatus = (id, status) => {
        updateRequestField(id, 'status', status);
    };

    const handleOpenEditModal = () => {
        setProfileFormData({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            agencyName: user.agencyName,
            photoUrl: user.photoUrl || '',
        });
        setIsEditModalOpen(true);
    };

    const handleSaveProfile = async (event) => {
        event.preventDefault();
        await updateUser({
            fullName: profileFormData.fullName,
            email: profileFormData.email,
            phone: profileFormData.phone,
            role: profileFormData.role,
            agencyName: profileFormData.agencyName,
            photoUrl: profileFormData.photoUrl,
        });
        setIsEditModalOpen(false);
    };

    const navigate = (page) => {
        setIsMobileNavOpen(false);
        if (page === 'Logout') {
            localStorage.removeItem('isLoggedIn');
            if (onLogout) {
                onLogout();
            } else {
                window.location.href = '/login';
            }
            return;
        }

        setActivePage(page);
    };

    const renderPage = () => {
        switch (activePage) {
            case 'Services':
                return (
                    <Services
                        requests={requests}
                        setRequests={setRequests}
                        technicians={technicians}
                        updateRequestField={updateRequestField}
                        updateRequestStatus={updateRequestStatus}
                    />
                );

            case 'Communities':
                return (
                    <Properties
                        key="communities-view"
                        initialStep={1}
                        agencyAssignments={agencyAssignments}
                        onAgencyAssignmentsChange={setAgencyAssignments}
                    />
                );


            case 'Technicians':
                return <Technicians technicians={technicians} setTechnicians={setTechnicians} requests={requests} />;


            case 'Reports':
                return (
                    <Reports
                        requests={requests}
                        technicians={technicians}
                        payments={payments}
                    />
                );

            case 'Dashboard':
            default:
                return (
                    <DashboardHome
                        requests={requests}
                        technicians={technicians}
                        payments={payments}
                        apartments={apartmentNames}
                        agencyAssignments={agencyAssignments}
                        onNavigate={navigate}
                    />
                );
        }
    };

    return (
        <div className="app-layout">
            <Sidebar
                activePage={activePage}
                onNavigate={navigate}
                isOpen={isMobileNavOpen}
                onClose={() => setIsMobileNavOpen(false)}
            />

            <main className="main-area">
                <header className="topbar">
                    <div className="topbar-left">
                        <button
                            type="button"
                            className="mobile-nav-toggle-btn"
                            onClick={() => setIsMobileNavOpen(true)}
                            aria-label="Open navigation menu"
                            aria-expanded={isMobileNavOpen}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>

                        <div className="topbar-title">
                            <span className="topbar-brand-label">BEE</span>
                            <span className="topbar-divider">/</span>
                            <span className="topbar-page-icon">{getSidebarIcon(activePage, { size: 16 })}</span>
                            <strong className="topbar-active-page">{activePage}</strong>
                        </div>
                    </div>

                    <div className="admin-profile-wrapper">
                        <ThemeToggle />
                        <button
                            type="button"
                            className="admin-profile-chip admin-profile-chip-slim"
                            onClick={handleOpenEditModal}
                            title={`${user.fullName} (${user.email}) · Edit Profile`}
                            aria-label={`Edit profile for ${user.fullName}`}
                        >
                            <ProfileAvatar
                                size="header"
                                user={user}
                                onSavePhoto={uploadPhoto}
                            />
                        </button>
                    </div>
                </header>

                {renderPage()}
            </main>

            {/* Edit Administrator Profile Modal */}
            {isEditModalOpen && (
                <div
                    className="request-modal-overlay"
                    onClick={() => setIsEditModalOpen(false)}
                >
                    <section
                        className="request-modal profile-edit-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="profile-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="request-modal-header">
                            <div>
                                <h2 id="profile-modal-title">Edit Administrator Profile</h2>
                            </div>
                            <button
                                type="button"
                                className="request-modal-close"
                                aria-label="Close profile modal"
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSaveProfile}>
                            <div className="profile-modal-body">
                                <div className="profile-avatar-preview-card">
                                    <ProfileAvatar
                                        size="modal"
                                        user={{
                                            fullName: profileFormData.fullName,
                                            photoUrl: profileFormData.photoUrl !== undefined ? profileFormData.photoUrl : user.photoUrl,
                                        }}
                                        onSavePhoto={async (newPhotoUrl) => {
                                            setProfileFormData((prev) => ({
                                                ...prev,
                                                photoUrl: newPhotoUrl,
                                            }));
                                            await uploadPhoto(newPhotoUrl);
                                        }}
                                    />
                                    <div className="preview-details">
                                        <h4>{profileFormData.fullName}</h4>
                                        <p>{profileFormData.role} · {profileFormData.agencyName}</p>
                                    </div>
                                </div>

                                <div className="profile-form-grid">
                                    <div className="profile-form-field">
                                        <label htmlFor="admin-full-name">Full Name</label>
                                        <input
                                            id="admin-full-name"
                                            type="text"
                                            className="profile-input"
                                            value={profileFormData.fullName}
                                            onChange={(e) =>
                                                setProfileFormData({
                                                    ...profileFormData,
                                                    fullName: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="profile-form-field">
                                        <label htmlFor="admin-email">Email Address</label>
                                        <input
                                            id="admin-email"
                                            type="email"
                                            className="profile-input"
                                            value={profileFormData.email}
                                            onChange={(e) =>
                                                setProfileFormData({
                                                    ...profileFormData,
                                                    email: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="profile-form-field">
                                        <label htmlFor="admin-phone">Phone Number</label>
                                        <input
                                            id="admin-phone"
                                            type="tel"
                                            className="profile-input"
                                            value={profileFormData.phone}
                                            onChange={(e) =>
                                                setProfileFormData({
                                                    ...profileFormData,
                                                    phone: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="profile-form-field">
                                        <label htmlFor="admin-role">Role</label>
                                        <input
                                            id="admin-role"
                                            type="text"
                                            className="profile-input"
                                            value={profileFormData.role}
                                            onChange={(e) =>
                                                setProfileFormData({
                                                    ...profileFormData,
                                                    role: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="profile-form-field profile-form-field-full">
                                        <label htmlFor="admin-agency-name">Agency Name</label>
                                        <input
                                            id="admin-agency-name"
                                            type="text"
                                            className="profile-input"
                                            value={profileFormData.agencyName}
                                            onChange={(e) =>
                                                setProfileFormData({
                                                    ...profileFormData,
                                                    agencyName: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="request-modal-footer">
                                <button
                                    type="button"
                                    id="cancel-profile-btn"
                                    className="secondary-button"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    id="save-profile-btn"
                                    className="primary-button"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}

        </div>
    );
}

function Dashboard(props) {
    return (
        <ThemeProvider>
            <UserProvider>
                <DashboardContent {...props} />
            </UserProvider>
        </ThemeProvider>
    );
}

export default Dashboard;
