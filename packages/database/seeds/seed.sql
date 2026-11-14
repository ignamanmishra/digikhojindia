-- ============================================================
-- DIGIKHOJINDIA PLATFORM - D1 SEED SCRIPT
-- Verified Demonstration Datasets
-- Owner: Naman Mishra
-- ============================================================

-- 1. Tenants
INSERT OR IGNORE INTO tenants (id, name, slug, subdomain, is_active) VALUES
('tenant-dki-main', 'Digikhojindia Corporate HQ', 'digikhojindia', 'app', 1),
('tenant-city-hospital', 'City Care Multi-Speciality Hospital', 'city-hospital', 'cityhospital', 1),
('tenant-apex-diagnostics', 'Apex Diagnostic & Pathology Center', 'apex-diagnostics', 'apex', 1);

-- 2. Tenant Branches
INSERT OR IGNORE INTO tenant_branches (id, tenant_id, name, city, state, country, is_headquarters) VALUES
('branch-dki-hq', 'tenant-dki-main', 'Digikhojindia Main Tech Center', 'Lucknow', 'Uttar Pradesh', 'India', 1),
('branch-city-main', 'tenant-city-hospital', 'City Care Main Hospital Branch', 'Kanpur', 'Uttar Pradesh', 'India', 1),
('branch-apex-central', 'tenant-apex-diagnostics', 'Apex Central Laboratory', 'Varanasi', 'Uttar Pradesh', 'India', 1);

-- 3. Roles
INSERT OR IGNORE INTO roles (id, name, description) VALUES
('role-super-admin', 'super_admin', 'Full platform operational and administrative control'),
('role-admin', 'admin', 'Operations, CRM, AMC, CMS, and Ticket management'),
('role-it-manager', 'it_manager', 'Infrastructure, servers, networking, and technical deployments'),
('role-project-manager', 'project_manager', 'Project planning, milestone monitoring, and team assignment'),
('role-support-executive', 'support_executive', 'Support ticket resolution and customer issue handling'),
('role-developer', 'developer', 'Software development and bug troubleshooting'),
('role-seo-manager', 'seo_manager', 'Search engine optimization, CMS content, and GEO visibility'),
('role-accountant', 'accountant', 'Invoicing, billing records, taxes, and payment tracking'),
('role-customer-admin', 'customer_admin', 'Customer organization administrator'),
('role-customer-employee', 'customer_employee', 'Customer team member with ticket and project view access');

-- 4. Initial Users
-- Password for all test users: 'Password123!'
-- Hash generated via standard PBKDF2-SHA256 (100,000 iterations, salt: 'dki_secure_salt_2026')
-- Hash: pbkdf2:100000:646b695f7365637572655f73616c745f32303236:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
INSERT OR IGNORE INTO users (id, tenant_id, email, password_hash, full_name, phone, role, is_active) VALUES
('usr-naman-mishra', 'tenant-dki-main', 'info@digikhojindia.com', 'pbkdf2:100000:646b695f7365637572655f73616c745f32303236:69a5cf0f0aa5d0d6600c0f4db20a3c7ef28d990ee4ce67f81ef694ba452bb166', 'Naman Mishra', '+91 9876543210', 'super_admin', 1),
('usr-admin-ops', 'tenant-dki-main', 'admin@digikhojindia.com', 'pbkdf2:100000:646b695f7365637572655f73616c745f32303236:69a5cf0f0aa5d0d6600c0f4db20a3c7ef28d990ee4ce67f81ef694ba452bb166', 'Digikhojindia Admin', '+91 9876543211', 'admin', 1),
('usr-support-tech', 'tenant-dki-main', 'support@digikhojindia.com', 'pbkdf2:100000:646b695f7365637572655f73616c745f32303236:69a5cf0f0aa5d0d6600c0f4db20a3c7ef28d990ee4ce67f81ef694ba452bb166', 'Aakash Verma (Support Lead)', '+91 9876543212', 'support_executive', 1),
('usr-customer-citycare', 'tenant-city-hospital', 'admin@cityhospital.com', 'pbkdf2:100000:646b695f7365637572655f73616c745f32303236:69a5cf0f0aa5d0d6600c0f4db20a3c7ef28d990ee4ce67f81ef694ba452bb166', 'Dr. Ramesh Sharma (Director)', '+91 9876543220', 'customer_admin', 1),
('usr-customer-apex', 'tenant-apex-diagnostics', 'manager@apexdiagnostics.com', 'pbkdf2:100000:646b695f7365637572655f73616c745f32303236:69a5cf0f0aa5d0d6600c0f4db20a3c7ef28d990ee4ce67f81ef694ba452bb166', 'Pooja Tiwari (Lab Incharge)', '+91 9876543221', 'customer_admin', 1);

-- 5. Software Products (All tagged as sample/demo until verified)
INSERT OR IGNORE INTO software_products (id, name, slug, category, short_description, full_description, features, technologies, screenshots, demo_video_url, is_public, is_sample) VALUES
('prod-hmis', 'Hospital Management System (HMIS)', 'hospital-management-system', 'HMIS', 'Complete paperless hospital automation with OPD, IPD, Billing, Pharmacy, and EHR.', 'An enterprise-grade hospital information management system designed for multi-specialty hospitals, medical colleges, and clinics. Features comprehensive doctor scheduling, bed management, billing with Ayushman Bharat/TPA integration, laboratory interfacing, and digital prescriptions.', '["OPD & IPD Management", "Integrated Billing & TPA Support", "Doctor & Bed Scheduling", "Pharmacy Inventory Control", "Electronic Health Records (EHR)"]', '["Cloudflare Workers", "React", "D1 SQLite", "Tailwind CSS"]', '["/assets/portfolio/hmis-1.png", "/assets/portfolio/hmis-2.png"]', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 1, 1),
('prod-ceo-dash', 'Director / CEO Dashboard', 'director-ceo-dashboard', 'Executive', 'Real-time financial, operational, and clinical KPIs for healthcare and enterprise executives.', 'A high-level business intelligence cockpit designed for managing directors, trustees, and C-suite executives to monitor collection trends, bed occupancy, doctor performance, and pending receivables in real time.', '["Executive Collection Trends", "Bed Occupancy Heatmaps", "Departmental Profitability", "Pending Dues & TPA Receivables"]', '["React", "Chart.js", "Cloudflare Workers", "Tailwind CSS"]', '["/assets/portfolio/ceo-1.png"]', NULL, 1, 1),
('prod-asset-portal', 'Asset Management Portal', 'asset-management-portal', 'Assets', 'End-to-end IT, medical equipment, and fixed asset tracking with QR-code maintenance.', 'Enterprise fixed-asset tracker with automated breakdown ticketing, preventive maintenance scheduling, warranty alerts, and vendor AMC monitoring.', '["QR-Code Asset Tagging", "Breakdown Ticketing", "Preventive Maintenance Scheduling", "Vendor Warranty & AMC Tracking"]', '["TypeScript", "Cloudflare D1", "React"]', '["/assets/portfolio/assets-1.png"]', NULL, 1, 1),
('prod-crm', 'CRM and Lead Management', 'crm-lead-management', 'CRM', 'Omnichannel lead capture, pipeline stages, automated follow-ups, and sales tracking.', 'Automate customer relationships, track incoming web enquiries, manage multi-stage sales pipelines, and schedule automated WhatsApp and SMS follow-ups.', '["Multi-stage Pipeline", "Enquiry Auto-capture", "WhatsApp & Call Reminders", "Conversion Analytics"]', '["Cloudflare Workers", "Hono", "React", "Tailwind CSS"]', '["/assets/portfolio/crm-1.png"]', NULL, 1, 1),
('prod-lis', 'Laboratory Management and LIS Integration', 'lis-integration', 'LIS', 'Bi-directional medical equipment interfacing, barcode printing, and instant PDF reports.', 'A specialized laboratory information system supporting bi-directional ASTM and HL7 interfacing with automated hematology, biochemistry, and immunoassay analyzers.', '["Bi-directional Analyzer Interfacing", "Barcode Label Printing", "Automated Normal Ranges & Alerts", "WhatsApp & SMS Report Dispatch"]', '["Node.js", "Cloudflare Workers", "HL7/ASTM Interfacing"]', '["/assets/portfolio/lis-1.png"]', NULL, 1, 1),
('prod-radiology', 'Radiology Management & PACS', 'radiology-management', 'Radiology', 'DICOM viewer link, radiology reporting templates, and technician workflows.', 'Streamline X-Ray, CT-Scan, MRI, and Ultrasound workflows with structured radiologist reporting templates and instant digital delivery.', '["Structured Reporting Templates", "DICOM Image Link Integration", "Modality Worklist Support", "Instant Digital Radiologist Sign-off"]', '["React", "Web DICOM", "Cloudflare R2"]', '["/assets/portfolio/radiology-1.png"]', NULL, 1, 1),
('prod-ivf', 'IVF Management Module', 'ivf-management', 'IVF', 'Complete clinical embryology, stimulation protocol, and donor tracking.', 'Dedicated fertility clinic solution managing ovarian stimulation protocols, egg retrieval, fertilization records, embryo grading, and cryopreservation tracking.', '["Stimulation Protocols", "Embryology & Cryo Log", "Consent & Legal Documentation", "Outcome Analytics"]', '["React", "Cloudflare D1", "Tailwind CSS"]', '["/assets/portfolio/ivf-1.png"]', NULL, 1, 1),
('prod-ot', 'Operation Theatre (OT) Management', 'ot-management', 'OT', 'Surgical scheduling, anaesthesia records, PAC clearances, and implant logging.', 'Optimize theatre utilization, surgeon timetables, pre-anaesthetic evaluation checklists, intra-operative vitals monitoring, and implant consumption tracking.', '["Interactive OT Slot Scheduler", "Pre-Anaesthetic Check (PAC)", "Intra-Operative Nursing Notes", "Surgical Implant Ledger"]', '["React", "Cloudflare Workers"]', '["/assets/portfolio/ot-1.png"]', NULL, 1, 1),
('prod-nursing', 'Nursing Management Module', 'nursing-management', 'Nursing', 'Nurse station dashboard, e-MAR medication charts, intake-output, and vitals recording.', 'Eliminate paper charts with digital TPR vitals charts, e-MAR medication administration, shift handover notes, and doctor order execution logs.', '["e-MAR Medication Administration", "Intake-Output Charting", "TPR Graphical Vitals", "Shift Handover Notes"]', '["React", "Tailwind CSS"]', '["/assets/portfolio/nursing-1.png"]', NULL, 1, 1),
('prod-salon', 'Cosmetic and Salon Management', 'cosmetic-salon-management', 'Salon', 'Appointment scheduling, service packages, stylist commission, and client loyalty.', 'Designed for aesthetic dermatology clinics, cosmetic centres, and premium salons with dynamic service bookings, loyalty points, and stylist commissions.', '["Online Appointment Booking", "Service Packages & Memberships", "Stylist Commission Ledger", "Customer Loyalty Points"]', '["React", "Cloudflare Workers"]', '["/assets/portfolio/salon-1.png"]', NULL, 1, 1),
('prod-coupons', 'Coupon and Voucher Management', 'coupon-voucher-management', 'Coupons', 'Dynamic promo codes, redemption tracking, multi-channel campaigns, and POS validation.', 'Generate single-use or multi-use discount vouchers, gift cards, and seasonal promotion campaigns with fraud-prevention validation.', '["Dynamic Promo Code Generator", "Single-use & Multi-use Rules", "POS Barcode Scanner Validation", "Redemption Analytics"]', '["Cloudflare Workers", "D1"]', '["/assets/portfolio/coupons-1.png"]', NULL, 1, 1),
('prod-automation', 'Business Automation Systems', 'business-automation-systems', 'Automation', 'Workflow triggers, automated notifications, lead ingestion, and process automation.', 'Custom workflow automation connecting websites, lead funnels, billing notifications, and customer communication channels.', '["Custom Workflow Triggers", "Webhook Ingestion Engine", "Multi-step Pipeline Automation", "Real-time Event Logging"]', '["Cloudflare Workers", "Hono", "TypeScript"]', '["/assets/portfolio/automation-1.png"]', NULL, 1, 1),
('prod-comms', 'WhatsApp, SMS and IVR Automation', 'whatsapp-sms-ivr-automation', 'Communication', 'Meta Cloud API WhatsApp templates, bulk promotional SMS, and IVR call routing.', 'Unified communication infrastructure enabling automated transactional messages, OTP verification, interactive WhatsApp chatbot menus, and smart IVR call distribution.', '["WhatsApp Business Cloud API", "DLT-Registered SMS Gateway", "Interactive IVR Call Routing", "Automated Reminders & Feedback"]', '["Meta Cloud API", "Cloudflare Workers", "Twilio / Fast2SMS"]', '["/assets/portfolio/comms-1.png"]', NULL, 1, 1),
('prod-mis', 'MIS and Reporting Dashboard', 'mis-reporting-dashboard', 'BI', 'Automated business intelligence, multi-branch consolidation, and scheduled PDF/Excel reports.', 'Centralized business intelligence suite providing automated daily revenue summaries, operational performance metrics, and scheduled executive email digests.', '["Multi-branch Financial Consolidation", "Scheduled Automated Email Digests", "One-click CSV & PDF Export", "Interactive Drilldown Charts"]', '["React", "Chart.js", "D1 SQL Engine"]', '["/assets/portfolio/mis-1.png"]', NULL, 1, 1),
('prod-custom', 'Custom Enterprise Software', 'custom-enterprise-software', 'Custom', 'Tailored web applications, internal operational portals, and cloud-native backends.', 'Turnkey bespoke software engineered specifically for your organizational requirements using robust Cloudflare-native cloud architecture.', '["Bespoke System Architecture", "Strict Role-based Access", "Complete Cloudflare D1/R2 Stack", "Dedicated SLA & Lifetime Free AMC"]', '["Cloudflare Workers", "React", "D1", "R2", "TypeScript"]', '["/assets/portfolio/custom-1.png"]', NULL, 1, 1);

-- 6. Customers
INSERT OR IGNORE INTO customers (id, tenant_id, organization_name, contact_person, email, phone, type, address, city, state, pincode, gstin, assigned_support_user_id, is_active, notes) VALUES
('DKI-100001', 'tenant-city-hospital', 'City Care Multi-Speciality Hospital', 'Dr. Ramesh Sharma', 'admin@cityhospital.com', '+91 9876543220', 'hospital', '14 Civil Lines, Medical Enclave', 'Kanpur', 'Uttar Pradesh', '208001', '09AABCU9603R1ZM', 'usr-support-tech', 1, '120-bed multi-speciality hospital running HMIS and Director Dashboard.'),
('DKI-100002', 'tenant-apex-diagnostics', 'Apex Diagnostic & Pathology Center', 'Pooja Tiwari', 'manager@apexdiagnostics.com', '+91 9876543221', 'clinic', 'Plot 45, Lanka Road', 'Varanasi', 'Uttar Pradesh', '221005', '09AABCT1234R1ZP', 'usr-support-tech', 1, 'High-volume diagnostic centre running LIS analyzer interfacing.'),
('DKI-100003', 'tenant-dki-main', 'Metro Medico Healthcare Clinic', 'Vikram Seth', 'info@metromedico.in', '+91 9876543222', 'clinic', 'Sector 18, Indira Nagar', 'Lucknow', 'Uttar Pradesh', '226016', '09AABCM5678R1ZX', 'usr-support-tech', 1, 'OPD clinic using Clinic Management and WhatsApp Reminders.');

-- 7. Customer Software Deployments
INSERT OR IGNORE INTO customer_software (id, customer_id, product_id, product_name, version, status, deployed_url) VALUES
('csoft-city-hmis', 'DKI-100001', 'prod-hmis', 'Hospital Management System (HMIS)', '3.2.0', 'active', 'https://citycare.hospital-erp.local'),
('csoft-city-ceo', 'DKI-100001', 'prod-ceo-dash', 'Director / CEO Dashboard', '1.4.0', 'active', 'https://director.citycare.hospital-erp.local'),
('csoft-apex-lis', 'DKI-100002', 'prod-lis', 'Laboratory Management and LIS Integration', '2.1.0', 'active', 'https://lis.apexdiagnostics.local');

-- 8. AMC Contracts
INSERT OR IGNORE INTO amc_contracts (id, tenant_id, customer_id, software_id, start_date, end_date, is_lifetime_free, contract_terms, coverage_details, included_services, excluded_services, status) VALUES
('AMC-2026-00001', 'tenant-city-hospital', 'DKI-100001', 'prod-hmis', '2026-01-01', '2026-12-31', 1, 'Digikhojindia Lifetime Free AMC - Subject to agreed contract terms. Covers software defect resolution, database index optimization, and regular data backup verification.', '["HMIS Core Modules", "OPD/IPD Billing", "EHR System", "Database Performance Tuning"]', '["Priority Ticket Support (4h SLA)", "Scheduled Weekly Backups", "Bug Fixes and Security Patches", "Quarterly System Performance Audit"]', '["Third-party SMS/WhatsApp gateway charges", "Custom module new feature development", "Physical server hardware replacement"]', 'active'),
('AMC-2026-00002', 'tenant-apex-diagnostics', 'DKI-100002', 'prod-lis', '2026-02-01', '2027-01-31', 0, 'Annual LIS Interface & Analyzer Connectivity AMC. Covers serial port and TCP/IP ASTM driver maintenance.', '["LIS Server Software", "Analyzer Interfacing Drivers", "Barcode Printer Configurations"]', '["Bidirectional Analyzer Support", "Data Backup Checks", "Re-configuration on Lab Hardware Change"]', '["Consumables and Barcode ribbons", "Third-party cloud storage fees"]', 'active');

-- 9. Support Tickets
INSERT OR IGNORE INTO tickets (id, tenant_id, customer_id, customer_software_id, subject, description, category, priority, status, assigned_employee_id, sla_breach, sla_due_at, created_at) VALUES
('DKI-2026-00001', 'tenant-city-hospital', 'DKI-100001', 'csoft-city-hmis', 'OPD Billing printer integration timeout in HMIS', 'When printing thermal bill receipts at OPD Counter 2, the print dialog freezes after the latest Windows 11 printer driver update.', 'Software Issue', 'High', 'In Progress', 'usr-support-tech', 0, '2026-11-15 14:00:00', '2026-11-14 09:30:00'),
('DKI-2026-00002', 'tenant-apex-diagnostics', 'DKI-100002', 'csoft-apex-lis', 'LIS Analyzer bidirectional data synchronization delay', 'Biochemistry analyzer Cobas c311 results are taking 5 minutes to appear in the lab verification screen.', 'Software Issue', 'Critical', 'Open', 'usr-support-tech', 0, '2026-11-15 12:00:00', '2026-11-14 11:15:00'),
('DKI-2026-00003', 'tenant-city-hospital', 'DKI-100001', 'csoft-city-hmis', 'Request to add new custom discharge summary template', 'Need an additional cardiology discharge summary template with specialized Echo EF fields.', 'Feature Request', 'Medium', 'Resolved', 'usr-admin-ops', 0, '2026-11-16 18:00:00', '2026-11-13 14:00:00');

-- 10. Ticket Replies & Internal Notes
INSERT OR IGNORE INTO ticket_replies (id, ticket_id, sender_user_id, sender_name, sender_role, is_customer, message, created_at) VALUES
('rep-001', 'DKI-2026-00001', 'usr-customer-citycare', 'Dr. Ramesh Sharma', 'customer_admin', 1, 'Our billing executives are facing delays during morning OPD rush hours. Kindly prioritize this printer issue.', '2026-11-14 09:40:00'),
('rep-002', 'DKI-2026-00001', 'usr-support-tech', 'Aakash Verma (Support Lead)', 'support_executive', 0, 'Hello Dr. Sharma, our technical team has reproduced the issue with the Windows 11 spooler. We are deploying an updated printer spool service patch today.', '2026-11-14 10:20:00');

INSERT OR IGNORE INTO ticket_internal_notes (id, ticket_id, author_id, author_name, note, created_at) VALUES
('note-001', 'DKI-2026-00001', 'usr-support-tech', 'Aakash Verma', 'Checked the client terminal remotely. The Windows print spooler service needs a restart and our local print bridge utility v1.2 needs to be updated.', '2026-11-14 10:15:00');

-- 11. Invoices
INSERT OR IGNORE INTO invoices (id, tenant_id, customer_id, subtotal, tax_amount, discount_amount, total_amount, paid_amount, balance_due, status, issue_date, due_date, notes) VALUES
('INV-2026-00001', 'tenant-city-hospital', 'DKI-100001', 125000.00, 22500.00, 0.00, 147500.00, 147500.00, 0.00, 'Paid', '2026-10-15', '2026-10-30', 'HMIS Module Expansion & OPD Terminal Licensing. Paid in full via NEFT.'),
('INV-2026-00002', 'tenant-apex-diagnostics', 'DKI-100002', 75000.00, 13500.00, 5000.00, 83500.00, 0.00, 83500.00, 'Sent', '2026-11-01', '2026-11-20', 'Diagnostic LIS Bi-directional Interface Installation.');

INSERT OR IGNORE INTO invoice_items (id, invoice_id, description, quantity, unit_price, gst_rate, gst_amount, total) VALUES
('item-001', 'INV-2026-00001', 'HMIS OPD & Pharmacy Module License', 1, 95000.00, 18, 17100.00, 112100.00),
('item-002', 'INV-2026-00001', 'On-site Staff Training & System Migration', 1, 30000.00, 18, 5400.00, 35400.00),
('item-003', 'INV-2026-00002', 'Cobas Analyzer Interface Driver License', 1, 50000.00, 18, 9000.00, 59000.00),
('item-004', 'INV-2026-00002', 'ASTM / HL7 Protocol Customization', 1, 25000.00, 18, 4500.00, 29500.00);

-- 12. CRM Leads & Enquiries
INSERT OR IGNORE INTO leads (id, tenant_id, name, company_name, email, phone, source, stage, estimated_value, notes) VALUES
('lead-001', 'tenant-dki-main', 'Dr. Arvind Mehra', 'Sanjeevani Super Speciality Hospital', 'dr.mehra@sanjeevanihospital.in', '+91 9811122233', 'Website Enquiry', 'Proposal', 350000.00, 'Interested in 200-bed HMIS deployment with NABH documentation workflow.'),
('lead-002', 'tenant-dki-main', 'Rajesh Kulkarni', 'Nexus Logistics & Supply Chain', 'rajesh@nexuslogistics.com', '+91 9822233344', 'Demo Request', 'Qualified', 180000.00, 'Requires customized ERP workflow for fleet and warehouse tracking.'),
('lead-003', 'tenant-dki-main', 'Dr. Priya Nambiar', 'Aura Cosmetic Dermatology Clinic', 'priya@auraclinic.co', '+91 9833344455', 'Quote Request', 'New', 95000.00, 'Requested quote for Cosmetic & Salon Clinic Management System.');

INSERT OR IGNORE INTO enquiries (id, type, name, email, phone, company, service_interest, message, status) VALUES
('enq-001', 'demo', 'Dr. Arvind Mehra', 'dr.mehra@sanjeevanihospital.in', '+91 9811122233', 'Sanjeevani Super Speciality Hospital', 'Hospital Management Software', 'We would like to schedule an online live demonstration of your HMIS system for our medical directors.', 'converted'),
('enq-002', 'quote', 'Rajesh Kulkarni', 'rajesh@nexuslogistics.com', '+91 9822233344', 'Nexus Logistics', 'Business Automation', 'Need a turnkey quotation for warehouse automation and real-time WhatsApp dispatch alerts.', 'processed'),
('enq-003', 'contact', 'Sunita Rao', 'sunita@raotrading.com', '+91 9844455566', 'Rao Enterprises', 'Custom Software Development', 'Looking to migrate our legacy desktop billing software to a cloud-based web application.', 'pending');

-- 13. Projects & Tasks
INSERT OR IGNORE INTO projects (id, tenant_id, customer_id, title, description, project_manager_id, start_date, target_end_date, status, progress_percent, budget) VALUES
('proj-001', 'tenant-city-hospital', 'DKI-100001', 'City Care HMIS NABH Compliance Upgrade', 'Implementation of NABH-compliant audit trails, automated consent forms, and nursing handover logs in HMIS.', 'usr-admin-ops', '2026-11-01', '2026-12-15', 'In Progress', 45, 120000.00);

INSERT OR IGNORE INTO tasks (id, project_id, title, description, status, priority, due_date) VALUES
('task-001', 'proj-001', 'Implement Doctor Digital Signature in Discharge Summary', 'Enable cryptographic digital signature module for senior consultants.', 'In Progress', 'High', '2026-11-20'),
('task-002', 'proj-001', 'Configure Nursing Incident Reporting Form', 'Build incident reporting module with auto-escalation to Medical Superintendent.', 'Todo', 'Medium', '2026-11-25'),
('task-003', 'proj-001', 'Patient Feedback Terminal Integration', 'Deploy tablet-based 5-star rating application at billing counter.', 'Done', 'Low', '2026-11-10');

-- 14. CMS Blog Posts & Tech News
INSERT OR IGNORE INTO blog_posts (id, title, slug, short_description, content, category, author_name, is_published, published_at, seo_title, meta_description) VALUES
('blog-001', 'How Cloud-Native HMIS Is Transforming Healthcare Operations in 2026', 'cloud-native-hmis-transforming-healthcare-2026', 'Discover how hospitals are slashing operational overhead and achieving paperless efficiency with modern Cloudflare-native HMIS solutions.', '<h2>The Evolution of Hospital Information Systems</h2><p>Modern hospitals can no longer afford the downtime, sluggish latency, and server hardware failure associated with legacy client-server software. In 2026, healthcare institutions are rapidly migrating to Cloudflare Workers-powered architectures that deliver sub-10ms response times across outpatient counters, emergency rooms, and OT scheduling desks.</p><h3>Key Advantages of Digikhojindia HMIS</h3><ul><li>Zero on-premise server maintenance overhead</li><li>Direct laboratory analyzer interfacing (ASTM & HL7)</li><li>NABH compliant digital audit trails and electronic health records</li><li>Lifetime Free AMC subject to agreed contract terms</li></ul><p>By automating patient registration, pharmacy inventory, and TPA billing, hospitals reduce patient discharge wait times from 4 hours to under 20 minutes.</p>', 'Hospital IT', 'Naman Mishra', 1, '2026-11-10 10:00:00', 'Cloud-Native HMIS Transforming Healthcare | Digikhojindia', 'Discover how modern Cloudflare-native HMIS improves patient care and automates hospital workflows.'),
('blog-002', 'Why Business Automation Is the Single Biggest Competitive Edge', 'business-automation-competitive-edge', 'Explore why automating repetitive data entry, WhatsApp follow-ups, and invoicing yields a 10x return on investment for growing businesses.', '<h2>Stop Doing Manually What Machines Can Do Instantly</h2><p>In every business, hundreds of hours are lost each month to repetitive tasks: manually creating invoices, calling leads that came through website forms 48 hours late, and answering the same customer support questions over and over.</p><p>At Digikhojindia, our motto is simple: <strong>"We Don''t Just Build Software. We Automate Your Entire Business."</strong> When a new enquiry arrives on your website, our automation pipeline instantly generates a CRM lead, pings your sales executive on WhatsApp, and sends a personalized company deck to the prospect within 30 seconds.</p>', 'Automation', 'Naman Mishra', 1, '2026-11-12 11:30:00', 'Business Automation as a Competitive Edge | Digikhojindia', 'Learn how Digikhojindia automates lead capture, CRM pipelines, and customer communications for explosive growth.');

-- 15. Videos
INSERT OR IGNORE INTO videos (id, title, slug, description, youtube_video_id, category, is_published) VALUES
('vid-001', 'Digikhojindia HMIS Product Walkthrough: OPD to IPD Workflow', 'hmis-product-walkthrough-demo', 'Complete end-to-end demonstration of the Digikhojindia Hospital Management System covering patient registration, consultation, lab orders, pharmacy dispensing, and final discharge billing.', 'dQw4w9WgXcQ', 'Hospital Management Software', 1),
('vid-002', 'WhatsApp Cloud API Business Automation Tutorial', 'whatsapp-cloud-api-automation-tutorial', 'Step-by-step tutorial on integrating WhatsApp Business Cloud API with CRM pipelines for instant lead auto-response.', 'dQw4w9WgXcQ', 'Tutorials', 1);

-- 16. System Settings
INSERT OR IGNORE INTO system_settings (key, value, description) VALUES
('platform_name', 'Digikhojindia', 'Official platform display name'),
('owner_name', 'Naman Mishra', 'Company Owner and Founder'),
('support_email', 'info@digikhojindia.com', 'Official primary support and contact email'),
('tagline', 'We Don''t Just Build Software. We Automate Your Entire Business.', 'Official brand proposition'),
('footer_copyright', '© Digikhojindia. All Rights Reserved. Owned by Naman Mishra.', 'Mandatory global footer copyright'),
('amc_marketing_clause', 'Lifetime Free AMC – Subject to agreed contract terms.', 'Official AMC policy marketing statement');

