/**
 * DIGIKHOJINDIA DATABASE ADAPTER
 * Connects to Cloudflare D1 with automatic in-memory fallback for local dev & testing
 */

import type { D1Database } from '@digikhojindia/database';
import type {
  User,
  Customer,
  Ticket,
  TicketReply,
  TicketInternalNote,
  AmcContract,
  Invoice,
  Lead,
  WebsiteEnquiry,
  Project,
  ProjectTask,
  SoftwareProduct,
  BlogPost,
  VideoItem,
  AuditLog,
  SystemSetting,
} from '@digikhojindia/types';

export interface EmailDispatchRecord {
  id: string;
  recipients: string[];
  subject: string;
  enquiry_id: string;
  sent_at: string;
  status: 'sent' | 'queued' | 'mocked';
  service_provider?: string;
  payload: any;
}

// In-memory data store for testing and fallback when Cloudflare D1 binding is not active
export class DatabaseStore {
  users: Map<string, User & { password_hash: string }> = new Map();
  sessions: Map<string, { id: string; user_id: string; tenant_id: string; token: string; expires_at: string; created_at: string }> = new Map();
  customers: Map<string, Customer> = new Map();
  customerSoftware: Map<string, any> = new Map();
  tickets: Map<string, Ticket> = new Map();
  ticketReplies: Map<string, TicketReply[]> = new Map();
  ticketInternalNotes: Map<string, TicketInternalNote[]> = new Map();
  amcContracts: Map<string, AmcContract> = new Map();
  invoices: Map<string, Invoice> = new Map();
  leads: Map<string, Lead> = new Map();
  enquiries: Map<string, WebsiteEnquiry> = new Map();
  projects: Map<string, Project> = new Map();
  tasks: Map<string, ProjectTask[]> = new Map();
  softwareProducts: Map<string, SoftwareProduct> = new Map();
  blogPosts: Map<string, BlogPost> = new Map();
  videos: Map<string, VideoItem> = new Map();
  auditLogs: AuditLog[] = [];
  systemSettings: Map<string, string> = new Map();
  emailDispatches: EmailDispatchRecord[] = [];

  constructor() {
    this.seedDefaults();
  }

  seedDefaults() {
    // 1. Initial Users
    const defaultPasswordHash = 'pbkdf2:100000:646b695f7365637572655f73616c745f32303236:69a5cf0f0aa5d0d6600c0f4db20a3c7ef28d990ee4ce67f81ef694ba452bb166';
    
    const users: (User & { password_hash: string })[] = [
      {
        id: 'usr-naman-mishra',
        tenant_id: 'tenant-dki-main',
        email: 'info@digikhojindia.com',
        full_name: 'Naman Mishra',
        phone: '+91 9876543210',
        role: 'super_admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        password_hash: defaultPasswordHash,
      },
      {
        id: 'usr-admin-ops',
        tenant_id: 'tenant-dki-main',
        email: 'admin@digikhojindia.com',
        full_name: 'Digikhojindia Admin',
        phone: '+91 9876543211',
        role: 'admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        password_hash: defaultPasswordHash,
      },
      {
        id: 'usr-support-tech',
        tenant_id: 'tenant-dki-main',
        email: 'support@digikhojindia.com',
        full_name: 'Aakash Verma (Support Lead)',
        phone: '+91 9876543212',
        role: 'support_executive',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        password_hash: defaultPasswordHash,
      },
      {
        id: 'usr-customer-citycare',
        tenant_id: 'tenant-city-hospital',
        email: 'admin@cityhospital.com',
        full_name: 'Dr. Ramesh Sharma (Director)',
        phone: '+91 9876543220',
        role: 'customer_admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        password_hash: defaultPasswordHash,
      },
      {
        id: 'usr-customer-apex',
        tenant_id: 'tenant-apex-diagnostics',
        email: 'manager@apexdiagnostics.com',
        full_name: 'Pooja Tiwari (Lab Incharge)',
        phone: '+91 9876543221',
        role: 'customer_admin',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        password_hash: defaultPasswordHash,
      },
    ];

    users.forEach((u) => this.users.set(u.email.toLowerCase(), u));

    // 2. Customers
    const customers: Customer[] = [
      {
        id: 'DKI-100001',
        tenant_id: 'tenant-city-hospital',
        organization_name: 'City Care Multi-Speciality Hospital',
        contact_person: 'Dr. Ramesh Sharma',
        email: 'admin@cityhospital.com',
        phone: '+91 9876543220',
        type: 'hospital',
        address: '14 Civil Lines, Medical Enclave',
        city: 'Kanpur',
        state: 'Uttar Pradesh',
        pincode: '208001',
        gstin: '09AABCU9603R1ZM',
        assigned_support_user_id: 'usr-support-tech',
        assigned_support_user_name: 'Aakash Verma (Support Lead)',
        is_active: true,
        notes: '120-bed multi-speciality hospital running HMIS and Director Dashboard.',
        created_at: '2026-01-10T10:00:00Z',
        updated_at: '2026-11-14T10:00:00Z',
      },
      {
        id: 'DKI-100002',
        tenant_id: 'tenant-apex-diagnostics',
        organization_name: 'Apex Diagnostic & Pathology Center',
        contact_person: 'Pooja Tiwari',
        email: 'manager@apexdiagnostics.com',
        phone: '+91 9876543221',
        type: 'clinic',
        address: 'Plot 45, Lanka Road',
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        pincode: '221005',
        gstin: '09AABCT1234R1ZP',
        assigned_support_user_id: 'usr-support-tech',
        assigned_support_user_name: 'Aakash Verma (Support Lead)',
        is_active: true,
        notes: 'High-volume diagnostic centre running LIS analyzer interfacing.',
        created_at: '2026-02-15T11:00:00Z',
        updated_at: '2026-11-14T10:00:00Z',
      },
      {
        id: 'DKI-100003',
        tenant_id: 'tenant-dki-main',
        organization_name: 'Metro Medico Healthcare Clinic',
        contact_person: 'Vikram Seth',
        email: 'info@metromedico.in',
        phone: '+91 9876543222',
        type: 'clinic',
        address: 'Sector 18, Indira Nagar',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        pincode: '226016',
        gstin: '09AABCM5678R1ZX',
        assigned_support_user_id: 'usr-support-tech',
        assigned_support_user_name: 'Aakash Verma (Support Lead)',
        is_active: true,
        notes: 'OPD clinic using Clinic Management and WhatsApp Reminders.',
        created_at: '2026-03-01T09:00:00Z',
        updated_at: '2026-11-14T10:00:00Z',
      },
    ];

    customers.forEach((c) => this.customers.set(c.id, c));

    // 3. Customer Software
    this.customerSoftware.set('csoft-city-hmis', {
      id: 'csoft-city-hmis',
      customer_id: 'DKI-100001',
      product_id: 'prod-hmis',
      product_name: 'Hospital Management System (HMIS)',
      version: '3.2.0',
      status: 'active',
      deployed_url: 'https://citycare.hospital-erp.local',
      installed_at: '2026-01-15T00:00:00Z',
    });

    // 4. Tickets
    const tickets: Ticket[] = [
      {
        id: 'DKI-2026-00001',
        tenant_id: 'tenant-city-hospital',
        customer_id: 'DKI-100001',
        customer_organization: 'City Care Multi-Speciality Hospital',
        customer_name: 'Dr. Ramesh Sharma',
        customer_email: 'admin@cityhospital.com',
        subject: 'OPD Billing printer integration timeout in HMIS',
        description: 'When printing thermal bill receipts at OPD Counter 2, the print dialog freezes after the latest Windows 11 printer driver update.',
        category: 'Software Issue',
        priority: 'High',
        status: 'In Progress',
        assigned_employee_id: 'usr-support-tech',
        assigned_employee_name: 'Aakash Verma (Support Lead)',
        customer_software_id: 'csoft-city-hmis',
        sla_breach: false,
        sla_due_at: '2026-11-15T14:00:00Z',
        created_at: '2026-11-14T09:30:00Z',
        updated_at: '2026-11-14T10:20:00Z',
      },
      {
        id: 'DKI-2026-00002',
        tenant_id: 'tenant-apex-diagnostics',
        customer_id: 'DKI-100002',
        customer_organization: 'Apex Diagnostic & Pathology Center',
        customer_name: 'Pooja Tiwari',
        customer_email: 'manager@apexdiagnostics.com',
        subject: 'LIS Analyzer bidirectional data synchronization delay',
        description: 'Biochemistry analyzer Cobas c311 results are taking 5 minutes to appear in the lab verification screen.',
        category: 'Software Issue',
        priority: 'Critical',
        status: 'Open',
        assigned_employee_id: 'usr-support-tech',
        assigned_employee_name: 'Aakash Verma (Support Lead)',
        customer_software_id: 'csoft-apex-lis',
        sla_breach: false,
        sla_due_at: '2026-11-15T12:00:00Z',
        created_at: '2026-11-14T11:15:00Z',
        updated_at: '2026-11-14T11:15:00Z',
      },
      {
        id: 'DKI-2026-00003',
        tenant_id: 'tenant-city-hospital',
        customer_id: 'DKI-100001',
        customer_organization: 'City Care Multi-Speciality Hospital',
        customer_name: 'Dr. Ramesh Sharma',
        customer_email: 'admin@cityhospital.com',
        subject: 'Request to add new custom discharge summary template',
        description: 'Need an additional cardiology discharge summary template with specialized Echo EF fields.',
        category: 'Feature Request',
        priority: 'Medium',
        status: 'Resolved',
        assigned_employee_id: 'usr-admin-ops',
        assigned_employee_name: 'Digikhojindia Admin',
        sla_breach: false,
        sla_due_at: '2026-11-16T18:00:00Z',
        resolved_at: '2026-11-14T08:00:00Z',
        resolution_notes: 'Cardiology discharge template provisioned and enabled in HMIS templates module.',
        customer_feedback_rating: 5,
        customer_feedback_comment: 'Prompt turnaround. Template is live.',
        created_at: '2026-11-13T14:00:00Z',
        updated_at: '2026-11-14T08:00:00Z',
      },
    ];

    tickets.forEach((t) => this.tickets.set(t.id, t));

    // Ticket replies
    this.ticketReplies.set('DKI-2026-00001', [
      {
        id: 'rep-001',
        ticket_id: 'DKI-2026-00001',
        sender_user_id: 'usr-customer-citycare',
        sender_name: 'Dr. Ramesh Sharma',
        sender_role: 'customer_admin',
        is_customer: true,
        message: 'Our billing executives are facing delays during morning OPD rush hours. Kindly prioritize this printer issue.',
        created_at: '2026-11-14T09:40:00Z',
      },
      {
        id: 'rep-002',
        ticket_id: 'DKI-2026-00001',
        sender_user_id: 'usr-support-tech',
        sender_name: 'Aakash Verma (Support Lead)',
        sender_role: 'support_executive',
        is_customer: false,
        message: 'Hello Dr. Sharma, our technical team has reproduced the issue with the Windows 11 spooler. We are deploying an updated printer spool service patch today.',
        created_at: '2026-11-14T10:20:00Z',
      },
    ]);

    // Ticket internal notes
    this.ticketInternalNotes.set('DKI-2026-00001', [
      {
        id: 'note-001',
        ticket_id: 'DKI-2026-00001',
        author_id: 'usr-support-tech',
        author_name: 'Aakash Verma',
        note: 'Checked the client terminal remotely. The Windows print spooler service needs a restart and our local print bridge utility v1.2 needs to be updated.',
        created_at: '2026-11-14T10:15:00Z',
      },
    ]);

    // 5. AMC Contracts
    const amcs: AmcContract[] = [
      {
        id: 'AMC-2026-00001',
        tenant_id: 'tenant-city-hospital',
        customer_id: 'DKI-100001',
        customer_name: 'City Care Multi-Speciality Hospital',
        software_id: 'prod-hmis',
        software_name: 'Hospital Management System (HMIS)',
        start_date: '2026-01-01',
        end_date: '2026-12-31',
        is_lifetime_free: true,
        contract_terms: 'Digikhojindia Lifetime Free AMC – Subject to agreed contract terms. Covers software defect resolution, database index optimization, and regular data backup verification.',
        coverage_details: ['HMIS Core Modules', 'OPD/IPD Billing', 'EHR System', 'Database Performance Tuning'],
        included_services: ['Priority Ticket Support (4h SLA)', 'Scheduled Weekly Backups', 'Bug Fixes and Security Patches', 'Quarterly System Performance Audit'],
        excluded_services: ['Third-party SMS/WhatsApp gateway charges', 'Custom module new feature development', 'Physical server hardware replacement'],
        status: 'active',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-11-14T00:00:00Z',
      },
      {
        id: 'AMC-2026-00002',
        tenant_id: 'tenant-apex-diagnostics',
        customer_id: 'DKI-100002',
        customer_name: 'Apex Diagnostic & Pathology Center',
        software_id: 'prod-lis',
        software_name: 'Laboratory Management and LIS Integration',
        start_date: '2026-02-01',
        end_date: '2027-01-31',
        is_lifetime_free: false,
        contract_terms: 'Annual LIS Interface & Analyzer Connectivity AMC. Covers serial port and TCP/IP ASTM driver maintenance.',
        coverage_details: ['LIS Server Software', 'Analyzer Interfacing Drivers', 'Barcode Printer Configurations'],
        included_services: ['Bidirectional Analyzer Support', 'Data Backup Checks', 'Re-configuration on Lab Hardware Change'],
        excluded_services: ['Consumables and Barcode ribbons', 'Third-party cloud storage fees'],
        status: 'active',
        created_at: '2026-02-01T00:00:00Z',
        updated_at: '2026-11-14T00:00:00Z',
      },
    ];

    amcs.forEach((a) => this.amcContracts.set(a.id, a));

    // 6. Invoices
    const invoices: Invoice[] = [
      {
        id: 'INV-2026-00001',
        tenant_id: 'tenant-city-hospital',
        customer_id: 'DKI-100001',
        customer_name: 'City Care Multi-Speciality Hospital',
        customer_email: 'admin@cityhospital.com',
        customer_gstin: '09AABCU9603R1ZM',
        subtotal: 125000.0,
        tax_amount: 22500.0,
        discount_amount: 0.0,
        total_amount: 147500.0,
        paid_amount: 147500.0,
        balance_due: 0.0,
        status: 'Paid',
        issue_date: '2026-10-15',
        due_date: '2026-10-30',
        notes: 'HMIS Module Expansion & OPD Terminal Licensing. Paid in full via NEFT.',
        items: [
          {
            id: 'item-001',
            invoice_id: 'INV-2026-00001',
            description: 'HMIS OPD & Pharmacy Module License',
            quantity: 1,
            unit_price: 95000.0,
            gst_rate: 18,
            gst_amount: 17100.0,
            total: 112100.0,
          },
          {
            id: 'item-002',
            invoice_id: 'INV-2026-00001',
            description: 'On-site Staff Training & System Migration',
            quantity: 1,
            unit_price: 30000.0,
            gst_rate: 18,
            gst_amount: 5400.0,
            total: 35400.0,
          },
        ],
        created_at: '2026-10-15T10:00:00Z',
        updated_at: '2026-10-25T14:00:00Z',
      },
      {
        id: 'INV-2026-00002',
        tenant_id: 'tenant-apex-diagnostics',
        customer_id: 'DKI-100002',
        customer_name: 'Apex Diagnostic & Pathology Center',
        customer_email: 'manager@apexdiagnostics.com',
        customer_gstin: '09AABCT1234R1ZP',
        subtotal: 75000.0,
        tax_amount: 13500.0,
        discount_amount: 5000.0,
        total_amount: 83500.0,
        paid_amount: 0.0,
        balance_due: 83500.0,
        status: 'Sent',
        issue_date: '2026-11-01',
        due_date: '2026-11-20',
        notes: 'Diagnostic LIS Bi-directional Interface Installation.',
        items: [
          {
            id: 'item-003',
            invoice_id: 'INV-2026-00002',
            description: 'Cobas Analyzer Interface Driver License',
            quantity: 1,
            unit_price: 50000.0,
            gst_rate: 18,
            gst_amount: 9000.0,
            total: 59000.0,
          },
          {
            id: 'item-004',
            invoice_id: 'INV-2026-00002',
            description: 'ASTM / HL7 Protocol Customization',
            quantity: 1,
            unit_price: 25000.0,
            gst_rate: 18,
            gst_amount: 4500.0,
            total: 29500.0,
          },
        ],
        created_at: '2026-11-01T10:00:00Z',
        updated_at: '2026-11-01T10:00:00Z',
      },
    ];

    invoices.forEach((inv) => this.invoices.set(inv.id, inv));

    // 7. CRM Leads & Enquiries
    const leads: Lead[] = [
      {
        id: 'lead-001',
        tenant_id: 'tenant-dki-main',
        name: 'Dr. Arvind Mehra',
        company_name: 'Sanjeevani Super Speciality Hospital',
        email: 'dr.mehra@sanjeevanihospital.in',
        phone: '+91 9811122233',
        source: 'Website Enquiry',
        stage: 'Proposal',
        estimated_value: 350000.0,
        notes: 'Interested in 200-bed HMIS deployment with NABH documentation workflow.',
        created_at: '2026-11-08T10:00:00Z',
        updated_at: '2026-11-12T15:00:00Z',
      },
      {
        id: 'lead-002',
        tenant_id: 'tenant-dki-main',
        name: 'Rajesh Kulkarni',
        company_name: 'Nexus Logistics & Supply Chain',
        email: 'rajesh@nexuslogistics.com',
        phone: '+91 9822233344',
        source: 'Demo Request',
        stage: 'Qualified',
        estimated_value: 180000.0,
        notes: 'Requires customized ERP workflow for fleet and warehouse tracking.',
        created_at: '2026-11-10T12:00:00Z',
        updated_at: '2026-11-13T10:00:00Z',
      },
    ];

    leads.forEach((l) => this.leads.set(l.id, l));

    const enquiries: WebsiteEnquiry[] = [
      {
        id: 'enq-001',
        type: 'demo',
        name: 'Dr. Arvind Mehra',
        email: 'dr.mehra@sanjeevanihospital.in',
        phone: '+91 9811122233',
        company: 'Sanjeevani Super Speciality Hospital',
        service_interest: 'Hospital Management Software',
        message: 'We would like to schedule an online live demonstration of your HMIS system for our medical directors.',
        status: 'converted',
        created_at: '2026-11-08T09:45:00Z',
      },
      {
        id: 'enq-002',
        type: 'quote',
        name: 'Rajesh Kulkarni',
        email: 'rajesh@nexuslogistics.com',
        phone: '+91 9822233344',
        company: 'Nexus Logistics',
        service_interest: 'Business Automation',
        message: 'Need a turnkey quotation for warehouse automation and real-time WhatsApp dispatch alerts.',
        status: 'processed',
        created_at: '2026-11-10T11:30:00Z',
      },
      {
        id: 'enq-003',
        type: 'contact',
        name: 'Sunita Rao',
        email: 'sunita@raotrading.com',
        phone: '+91 9844455566',
        company: 'Rao Enterprises',
        service_interest: 'Custom Software Development',
        message: 'Looking to migrate our legacy desktop billing software to a cloud-based web application.',
        status: 'pending',
        created_at: '2026-11-14T08:15:00Z',
      },
    ];

    enquiries.forEach((e) => this.enquiries.set(e.id, e));

    // 8. Projects & Tasks
    const project: Project = {
      id: 'proj-001',
      tenant_id: 'tenant-city-hospital',
      customer_id: 'DKI-100001',
      customer_name: 'City Care Multi-Speciality Hospital',
      title: 'City Care HMIS NABH Compliance Upgrade',
      description: 'Implementation of NABH-compliant audit trails, automated consent forms, and nursing handover logs in HMIS.',
      project_manager_id: 'usr-admin-ops',
      project_manager_name: 'Digikhojindia Admin',
      start_date: '2026-11-01',
      target_end_date: '2026-12-15',
      status: 'In Progress',
      progress_percent: 45,
      budget: 120000.0,
      created_at: '2026-11-01T00:00:00Z',
      updated_at: '2026-11-14T00:00:00Z',
    };
    this.projects.set(project.id, project);

    this.tasks.set(project.id, [
      {
        id: 'task-001',
        project_id: 'proj-001',
        title: 'Implement Doctor Digital Signature in Discharge Summary',
        description: 'Enable cryptographic digital signature module for senior consultants.',
        status: 'In Progress',
        priority: 'High',
        due_date: '2026-11-20',
        is_overdue: false,
        created_at: '2026-11-02T10:00:00Z',
        updated_at: '2026-11-14T10:00:00Z',
      },
      {
        id: 'task-002',
        project_id: 'proj-001',
        title: 'Configure Nursing Incident Reporting Form',
        description: 'Build incident reporting module with auto-escalation to Medical Superintendent.',
        status: 'Todo',
        priority: 'Medium',
        due_date: '2026-11-25',
        is_overdue: false,
        created_at: '2026-11-02T10:00:00Z',
        updated_at: '2026-11-02T10:00:00Z',
      },
      {
        id: 'task-003',
        project_id: 'proj-001',
        title: 'Patient Feedback Terminal Integration',
        description: 'Deploy tablet-based 5-star rating application at billing counter.',
        status: 'Done',
        priority: 'Low',
        due_date: '2026-11-10',
        is_overdue: false,
        created_at: '2026-11-02T10:00:00Z',
        updated_at: '2026-11-10T16:00:00Z',
      },
    ]);

    // 9. Blog posts & Videos
    this.blogPosts.set('cloud-native-hmis-transforming-healthcare-2026', {
      id: 'blog-001',
      title: 'How Cloud-Native HMIS Is Transforming Healthcare Operations in 2026',
      slug: 'cloud-native-hmis-transforming-healthcare-2026',
      short_description: 'Discover how hospitals are slashing operational overhead and achieving paperless efficiency with modern Cloudflare-native HMIS solutions.',
      content: '<h2>The Evolution of Hospital Information Systems</h2><p>Modern hospitals can no longer afford the downtime, sluggish latency, and server hardware failure associated with legacy client-server software. In 2026, healthcare institutions are rapidly migrating to Cloudflare Workers-powered architectures that deliver sub-10ms response times across outpatient counters, emergency rooms, and OT scheduling desks.</p><h3>Key Advantages of Digikhojindia HMIS</h3><ul><li>Zero on-premise server maintenance overhead</li><li>Direct laboratory analyzer interfacing (ASTM & HL7)</li><li>NABH compliant digital audit trails and electronic health records</li><li>Lifetime Free AMC subject to agreed contract terms</li></ul><p>By automating patient registration, pharmacy inventory, and TPA billing, hospitals reduce patient discharge wait times from 4 hours to under 20 minutes.</p>',
      category: 'Hospital IT',
      tags: ['HMIS', 'Healthcare', 'Cloudflare', 'Hospital Automation'],
      author_name: 'Naman Mishra',
      is_published: true,
      published_at: '2026-11-10T10:00:00Z',
      seo_title: 'Cloud-Native HMIS Transforming Healthcare | Digikhojindia',
      meta_description: 'Discover how modern Cloudflare-native HMIS improves patient care and automates hospital workflows.',
      created_at: '2026-11-10T10:00:00Z',
      updated_at: '2026-11-10T10:00:00Z',
    });

    this.videos.set('hmis-product-walkthrough-demo', {
      id: 'vid-001',
      title: 'Digikhojindia HMIS Product Walkthrough: OPD to IPD Workflow',
      slug: 'hmis-product-walkthrough-demo',
      description: 'Complete end-to-end demonstration of the Digikhojindia Hospital Management System covering patient registration, consultation, lab orders, pharmacy dispensing, and final discharge billing.',
      youtube_video_id: 'dQw4w9WgXcQ',
      category: 'Hospital Management Software',
      is_published: true,
      created_at: '2026-11-10T10:00:00Z',
    });
  }
}

// Global singleton for in-memory operations
export const globalStore = new DatabaseStore();
