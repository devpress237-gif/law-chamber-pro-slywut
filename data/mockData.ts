
import { Case, User, Hearing, Document, Team, CourtName, LegalSection, UserRole } from '../types';

export const courtNames: CourtName[] = [
  'Civil Court',
  'Session Court',
  'Family Court',
  'Magistrate',
  'Tehsildar',
  'High Court',
  'Supreme Court',
  'NAB/FIA',
  'Police Station (FIR stage)',
];

export const legalSections: LegalSection[] = [
  'PPC',
  'CrPC',
  'CPC',
  'Family Laws',
  'Rent',
  'NAB',
  'FIA',
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Advocate Muhammad Ali Khan',
    email: 'ali.khan@lawfirm.pk',
    role: 'senior_lawyer',
    cnic: '42101-1234567-1',
    mobile: '+92-300-1234567',
    address: 'Lahore High Court Bar Association, Lahore',
    teamId: 'team1',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Advocate Sarah Ahmed',
    email: 'sarah.ahmed@lawfirm.pk',
    role: 'junior_lawyer',
    cnic: '42101-2345678-2',
    mobile: '+92-301-2345678',
    address: 'Karachi Bar Association, Karachi',
    teamId: 'team1',
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'Muhammad Hassan',
    email: 'hassan@lawfirm.pk',
    role: 'clerk',
    cnic: '42101-3456789-3',
    mobile: '+92-302-3456789',
    address: 'Islamabad Bar Association, Islamabad',
    teamId: 'team1',
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date('2024-01-05'),
  },
];

export const mockTeams: Team[] = [
  {
    id: 'team1',
    name: 'Corporate Law Team',
    seniorLawyerId: '1',
    members: ['1', '2', '3'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

export const mockCases: Case[] = [
  {
    id: 'case1',
    caseNumber: 'CIV/2024/001',
    courtName: 'High Court',
    parties: {
      plaintiffs: [
        {
          id: 'p1',
          name: 'ABC Corporation Ltd.',
          cnic: '42101-1111111-1',
          mobile: '+92-300-1111111',
          email: 'legal@abc.com',
          address: 'Main Boulevard, Gulberg, Lahore',
        },
      ],
      defendants: [
        {
          id: 'd1',
          name: 'XYZ Industries',
          cnic: '42101-2222222-2',
          mobile: '+92-301-2222222',
          email: 'info@xyz.com',
          address: 'Industrial Area, Karachi',
        },
      ],
    },
    opponentLawyers: ['Advocate Tariq Mahmood', 'Advocate Fatima Sheikh'],
    legalSections: ['CPC', 'Family Laws'],
    hearings: [
      {
        id: 'h1',
        hearingNumber: 1,
        date: new Date('2024-01-20'),
        courtOrderType: 'Evidence',
        notes: 'First hearing scheduled for evidence presentation',
        assignedLawyerId: '1',
        previousComments: 'Case filed successfully',
        nextSteps: 'Prepare evidence documents',
        caseId: 'case1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
    ],
    documents: [
      {
        id: 'doc1',
        name: 'Initial Petition.pdf',
        type: 'Petition',
        uri: 'file://documents/petition1.pdf',
        size: 1024000,
        mimeType: 'application/pdf',
        caseId: 'case1',
        uploadedBy: '1',
        uploadedAt: new Date('2024-01-15'),
        tags: ['petition', 'initial'],
      },
    ],
    assignedLawyerId: '1',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdBy: '1',
    teamId: 'team1',
  },
  {
    id: 'case2',
    caseNumber: 'CRM/2024/002',
    courtName: 'Session Court',
    parties: {
      plaintiffs: [
        {
          id: 'p2',
          name: 'State vs Accused',
          address: 'Government Prosecutor Office',
        },
      ],
      defendants: [
        {
          id: 'd2',
          name: 'Ahmad Ali',
          cnic: '42101-3333333-3',
          mobile: '+92-302-3333333',
          address: 'Model Town, Lahore',
        },
      ],
    },
    opponentLawyers: ['Public Prosecutor'],
    legalSections: ['PPC', 'CrPC'],
    hearings: [
      {
        id: 'h2',
        hearingNumber: 1,
        date: new Date('2024-01-22'),
        courtOrderType: 'Arguments',
        notes: 'Defense arguments to be presented',
        assignedLawyerId: '2',
        previousComments: 'Bail application filed',
        nextSteps: 'Prepare defense arguments',
        caseId: 'case2',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
      },
    ],
    documents: [],
    assignedLawyerId: '2',
    status: 'active',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    createdBy: '2',
    teamId: 'team1',
  },
];

export const todayHearings = mockCases.flatMap(c => 
  c.hearings.filter(h => {
    const today = new Date();
    const hearingDate = new Date(h.date);
    return hearingDate.toDateString() === today.toDateString();
  })
);

export const tomorrowHearings = mockCases.flatMap(c => 
  c.hearings.filter(h => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const hearingDate = new Date(h.date);
    return hearingDate.toDateString() === tomorrow.toDateString();
  })
);
