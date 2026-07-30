import React, { useState, useEffect } from 'react';
import {
  Search,
  ExternalLink,
  Plus,
  FileText,
  CheckCircle2,
  Copy,
  Globe,
  Tag,
  Trash2,
  X,
  Sparkles,
  ShieldCheck,
  Building2,
  Landmark,
  Layers,
  GraduationCap
} from 'lucide-react';
import FileUpload from '../components/FileUpload';
import Swal from 'sweetalert2';
import { apiAddService, apiGetServicesList, apiDeleteService } from '../services/api';

const DEFAULT_SERVICES = [
  // ================= STATE GOVERNMENT SERVICES =================
  {
    id: 'tnesevai',
    group: 'State',
    name: 'TNeGA e-Sevai Portal',
    category: 'Certificates',
    url: 'https://tnesevai.tn.gov.in/',
    iconColor: 'from-purple-600 to-indigo-600',
    description: 'Tamil Nadu Government e-Sevai online certificate applications and CAN registration.',
    subServices: [
      {
        id: 'tnesevai_income',
        name: 'Income Certificate (வருமான சான்றிதழ்)',
        description: 'Annual family income certificate issued by Revenue Department.',
        govtFee: '₹60',
        serviceCharge: '₹40',
        processingTime: '5-7 Working Days',
        requiredDocs: [
          'Applicant Aadhaar Card',
          'Smart Ration Card Copy',
          'Passport Size Photo',
          'Self-Declaration Form (signed by applicant)',
          'Salary Slip / IT Return / Auditor Certificate (if employed)',
        ],
        steps: [
          'Create CAN registration number if not registered.',
          'Select Income Certificate service on TNeGA portal.',
          'Upload photo, Aadhaar, Ration Card & Income proof.',
          'Pay Govt fee ₹60 and print acknowledgment slip for customer.',
        ],
      },
      {
        id: 'tnesevai_community',
        name: 'Community Certificate (சாதி சான்றிதழ்)',
        description: 'Caste / Community Certificate (BC, MBC, SC, ST, FC).',
        govtFee: '₹60',
        serviceCharge: '₹40',
        processingTime: '7-10 Working Days',
        requiredDocs: [
          'Applicant Aadhaar Card',
          'Smart Ration Card Copy',
          'Passport Size Photo',
          'Parents / Sibling Community Certificate Copy',
          'School Transfer Certificate (TC) Copy',
        ],
        steps: [
          'Enter Applicant CAN number on e-Sevai portal.',
          'Fill family caste details and parent TC references.',
          'Upload documents & photo.',
          'Pay fee and submit for VAO / RI verification.',
        ],
      },
      {
        id: 'tnesevai_nativity',
        name: 'Nativity / Residence Certificate (இருப்பிட சான்றிதழ்)',
        description: 'Proof of residence in Tamil Nadu for education & employment.',
        govtFee: '₹60',
        serviceCharge: '₹40',
        processingTime: '5-7 Working Days',
        requiredDocs: [
          'Applicant Aadhaar Card',
          'Smart Ration Card',
          'Passport Size Photo',
          'Continuous 5 Years School Study Cert OR Property Tax/EB Bill Proof',
        ],
        steps: [
          'Select Nativity Certificate service.',
          'Attach 5-year residency proof document.',
          'Submit application and provide ACK number to customer.',
        ],
      },
      {
        id: 'tnesevai_firstgrad',
        name: 'First Graduate Certificate (முதல் பட்டதாரி சான்றிதழ்)',
        description: 'Tuition fee concession for first university graduate in family.',
        govtFee: '₹60',
        serviceCharge: '₹50',
        processingTime: '7-10 Working Days',
        requiredDocs: [
          'Applicant Aadhaar Card & Passport Photo',
          'Smart Ration Card (showing all family members)',
          '10th & 12th Marksheets / Provisional Cert',
          'Father & Mother TC / School Transfer Certificates',
          'Joint Declaration Form signed by parents',
        ],
        steps: [
          'Verify no other member in family has completed a degree.',
          'Fill joint declaration and upload marksheets & TC proofs.',
          'Submit application on e-Sevai portal.',
        ],
      },
      {
        id: 'tnesevai_legalheir',
        name: 'Legal Heir Certificate (வாரிசு சான்றிதழ்)',
        description: 'Official legal heir declaration following death of family member.',
        govtFee: '₹60',
        serviceCharge: '₹100',
        processingTime: '15-30 Working Days',
        requiredDocs: [
          'Death Certificate of Deceased',
          'Smart Ration Card of Deceased',
          'Aadhaar Cards of all Legal Heirs',
          'Marriage Certificate / Relationship Proof',
          'Applicant Passport Photo',
        ],
        steps: [
          'Enter deceased personal details & date of death.',
          'List all legal heirs with age and relationship.',
          'Upload death cert and heir ID proofs.',
          'Submit for Tahsildar / Revenue inspection.',
        ],
      },
    ],
  },
  {
    id: 'tnpds',
    group: 'State',
    name: 'TN Ration Card (TNPDS)',
    category: 'Welfare',
    url: 'https://tnpds.gov.in/',
    iconColor: 'from-green-600 to-emerald-700',
    description: 'Tamil Nadu Public Distribution System (TNPDS) Smart Card management.',
    subServices: [
      {
        id: 'tnpds_add',
        name: 'Add Family Member (உறுப்பினர் சேர்க்கை)',
        description: 'Add newborn child or newly married spouse to Smart Ration Card.',
        govtFee: 'Free',
        serviceCharge: '₹50',
        processingTime: '10-15 Working Days',
        requiredDocs: [
          'Smart Ration Card Number & Mobile OTP',
          'Birth Certificate (for child) OR Marriage Certificate + Name Deletion Cert (for spouse)',
          'Aadhaar Card of the new member',
        ],
        steps: [
          'Log in with registered smart card mobile number.',
          'Select "Add Member" service.',
          'Fill details and upload birth/marriage cert PDF.',
          'Submit and issue tracking reference number.',
        ],
      },
      {
        id: 'tnpds_remove',
        name: 'Remove Family Member (உறுப்பினர் நீக்கம்)',
        description: 'Remove name due to marriage, separation, or death.',
        govtFee: 'Free',
        serviceCharge: '₹50',
        processingTime: '7-10 Working Days',
        requiredDocs: [
          'Smart Ration Card Number',
          'Death Certificate (for deceased) OR Marriage Cert / Relocation Reason',
          'Aadhaar Card copy of member to remove',
        ],
        steps: [
          'Select Member Removal service.',
          'Upload proof document and submit.',
          'Download deletion certificate after TSO approval.',
        ],
      },
      {
        id: 'tnpds_address',
        name: 'Change Address (முகவரி மாற்றம்)',
        description: 'Transfer smart card to new address or different taluk.',
        govtFee: 'Free',
        serviceCharge: '₹50',
        processingTime: '10-15 Working Days',
        requiredDocs: [
          'Smart Ration Card Number',
          'New Electricity Bill (TNEB) OR Rental Agreement OR Gas Bill',
          'Family Head Aadhaar Card',
        ],
        steps: [
          'Select Address Change service.',
          'Enter new street name, taluk, and shop number.',
          'Upload address proof PDF and submit.',
        ],
      },
    ],
  },
  {
    id: 'patta',
    group: 'State',
    name: 'TN Patta & Chitta Land Records',
    category: 'Land & Revenue',
    url: 'https://eservices.tn.gov.in/eservicesweb/land/patta.html',
    iconColor: 'from-orange-500 to-amber-600',
    description: 'Tamil Nadu Revenue Department official e-Services for land & property.',
    subServices: [
      {
        id: 'patta_view',
        name: 'View Patta / Chitta (பட்டா / சிட்டா பார்க்க)',
        description: 'Download official copy of Patta & Chitta land ownership record.',
        govtFee: 'Free',
        serviceCharge: '₹30',
        processingTime: 'Instant',
        requiredDocs: [
          'District, Taluk & Village Name',
          'Survey Number & Sub-division Number OR Patta Number',
        ],
        steps: [
          'Select District, Taluk, and Village.',
          'Enter Survey No & Sub-division No.',
          'Enter captcha and click Submit.',
          'Print high-resolution Patta / Chitta document for customer.',
        ],
      },
      {
        id: 'patta_aregister',
        name: 'A-Register Extract (அ-பதிவேடு விவரம்)',
        description: 'View village A-Register land classification and tax assessment details.',
        govtFee: 'Free',
        serviceCharge: '₹30',
        processingTime: 'Instant',
        requiredDocs: [
          'District, Taluk & Village Name',
          'Survey Number & Sub-division Number',
        ],
        steps: [
          'Select A-Register Extract service.',
          'Input survey details and captcha.',
          'Download and print A-Register extract.',
        ],
      },
    ],
  },
  {
    id: 'employment',
    group: 'State',
    name: 'Employment Exchange (Tnvelaivaaippu)',
    category: 'Employment',
    url: 'https://tnvelaivaaippu.gov.in/',
    iconColor: 'from-teal-600 to-emerald-600',
    description: 'Tamil Nadu Employment & Training Department registration portal.',
    subServices: [
      {
        id: 'emp_new',
        name: 'New Employment Registration (புதிய பதிவு)',
        description: 'First-time candidate registration for government job seniority.',
        govtFee: 'Free',
        serviceCharge: '₹40',
        processingTime: 'Instant',
        requiredDocs: [
          '10th / 12th / Diploma / Degree Marksheets',
          'School / College Transfer Certificate (TC)',
          'Community Certificate Copy',
          'Applicant Aadhaar Card',
        ],
        steps: [
          'Fill candidate personal details & address.',
          'Add educational qualifications with marks & year passed.',
          'Save application and print Employment Registration Card.',
        ],
      },
      {
        id: 'emp_renewal',
        name: 'Add Qualification / Card Renewal (புதுப்பித்தல்)',
        description: 'Update higher education degrees or renew expired employment registration.',
        govtFee: 'Free',
        serviceCharge: '₹30',
        processingTime: 'Instant',
        requiredDocs: [
          'Employment Registration Number & Password',
          'New Degree / Course Certificate Marksheets',
        ],
        steps: [
          'Log in with candidate credentials.',
          'Add new degree details or click Renewal button.',
          'Print updated employment card.',
        ],
      },
    ],
  },

  // ================= CENTRAL GOVERNMENT SERVICES =================
  {
    id: 'aadhaar',
    group: 'Central',
    name: 'UIDAI Aadhaar Services',
    category: 'Identity',
    url: 'https://myaadhaar.uidai.gov.in/',
    iconColor: 'from-amber-500 to-red-500',
    description: 'Unique Identification Authority of India (UIDAI) citizen services.',
    subServices: [
      {
        id: 'aadhaar_pvc',
        name: 'Order PVC Aadhaar Card (பிளாஸ்டிக் கார்டு)',
        description: 'Order original durable plastic PVC Aadhaar card delivered by speed post.',
        govtFee: '₹50',
        serviceCharge: '₹30',
        processingTime: '5-7 Working Days',
        requiredDocs: [
          '12-digit Aadhaar Number OR 28-digit Enrolment ID',
          'Active Mobile Number for OTP verification',
        ],
        steps: [
          'Go to MyAadhaar portal and select "Order Aadhaar PVC Card".',
          'Enter Aadhaar number and captcha.',
          'Verify with OTP.',
          'Pay ₹50 fee via UPI/Netbanking and give SRN receipt to customer.',
        ],
      },
      {
        id: 'aadhaar_address',
        name: 'Online Address Update (முகவரி மாற்றம்)',
        description: 'Update residence address in Aadhaar using valid document proof.',
        govtFee: '₹50',
        serviceCharge: '₹50',
        processingTime: '3-7 Working Days',
        requiredDocs: [
          'Aadhaar Number & Registered Mobile OTP',
          'Valid Address Proof PDF (Voter ID / Ration Card / Bank Passbook / EB Bill)',
        ],
        steps: [
          'Log in to MyAadhaar with OTP.',
          'Select Address Update and fill new address in Tamil & English.',
          'Upload scanned address proof document PDF.',
          'Pay ₹50 fee and track update status using URN.',
        ],
      },
      {
        id: 'aadhaar_download',
        name: 'E-Aadhaar Download / Check Mobile Link',
        description: 'Instant E-Aadhaar PDF download or verify linked mobile number.',
        govtFee: 'Free',
        serviceCharge: '₹20',
        processingTime: 'Instant',
        requiredDocs: [
          'Aadhaar Number / Virtual ID',
          'Mobile Number (for OTP)',
        ],
        steps: [
          'Select Download Aadhaar.',
          'Enter Aadhaar number & OTP.',
          'Open password-protected PDF (First 4 letters of name UPPERCASE + Birth Year).',
          'Print color copy for customer.',
        ],
      },
    ],
  },
  {
    id: 'pan',
    group: 'Central',
    name: 'PAN Card Services (NSDL / Protean)',
    category: 'Identity',
    url: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    iconColor: 'from-blue-600 to-cyan-500',
    description: 'Income Tax Department PAN card applications & corrections.',
    subServices: [
      {
        id: 'pan_new',
        name: 'New PAN Card Application (புதிய பேன் கார்டு - Form 49A)',
        description: 'Apply for fresh Permanent Account Number (PAN) card for Indian citizens.',
        govtFee: '₹107',
        serviceCharge: '₹50',
        processingTime: '7-12 Working Days',
        requiredDocs: [
          'Aadhaar Card (Name, Gender & DOB must match)',
          '2 Recent Passport Size Photographs',
          'Applicant Signature on white paper with black pen',
          'Mobile Number & Email Address',
        ],
        steps: [
          'Select Application Type: New PAN - Indian Citizen (Form 49A).',
          'Enter applicant details as per Aadhaar.',
          'Upload photo, signature, and Aadhaar PDF.',
          'Pay ₹107 fee and download NSDL acknowledgment slip.',
        ],
      },
      {
        id: 'pan_correction',
        name: 'PAN Correction / Details Update (திருத்தம்)',
        description: 'Correct name, date of birth, photo, or father name on existing PAN card.',
        govtFee: '₹107',
        serviceCharge: '₹60',
        processingTime: '10-15 Working Days',
        requiredDocs: [
          'Existing PAN Card Copy / Number',
          'Aadhaar Card Copy',
          'Supporting Proof for correction (Gazette / Marriage Cert / School Marksheet)',
          'Photo & Signature Scan',
        ],
        steps: [
          'Select Changes or Correction in existing PAN Data.',
          'Tick specific fields to change (Name/DOB/Photo).',
          'Upload proof documents and submit.',
        ],
      },
      {
        id: 'pan_link',
        name: 'Aadhaar - PAN Linking (இணைப்பு)',
        description: 'Mandatory Aadhaar linking with PAN card on Income Tax e-filing portal.',
        govtFee: '₹1,000',
        serviceCharge: '₹50',
        processingTime: '2-4 Working Days',
        requiredDocs: [
          'PAN Card Number',
          'Aadhaar Number',
          'Active Mobile Number for OTP',
        ],
        steps: [
          'Go to Income Tax e-filing portal -> Link Aadhaar.',
          'Enter PAN and Aadhaar number.',
          'Pay fee penalty ₹1000 via e-Pay Tax if unlinked.',
          'Submit link request after payment confirmation.',
        ],
      },
    ],
  },
  {
    id: 'voter',
    group: 'Central',
    name: 'Voter ID Services (ECI NVSP)',
    category: 'Identity',
    url: 'https://voters.eci.gov.in/',
    iconColor: 'from-emerald-600 to-teal-500',
    description: 'Election Commission of India (ECI) voter registration and EPIC portal.',
    subServices: [
      {
        id: 'voter_new',
        name: 'New Voter Registration (Form 6 - புதிய வாக்காளர்)',
        description: 'Enroll new voter who reached 18 years of age.',
        govtFee: 'Free',
        serviceCharge: '₹40',
        processingTime: '15-30 Days',
        requiredDocs: [
          'Applicant Aadhaar Card',
          '1 Passport Size Photograph',
          'Age Proof (10th Marksheet / Birth Certificate)',
          'Address Proof (Ration Card / EB Bill / Bank Book)',
          'Family Member Voter ID (for reference)',
        ],
        steps: [
          'Log in to Voters Portal using mobile OTP.',
          'Select Form 6 (New Voter).',
          'Fill constituency, relative name, and full address.',
          'Upload photo & document proofs. Note down Reference ID.',
        ],
      },
      {
        id: 'voter_correction',
        name: 'Voter ID Correction (Form 8 - திருத்தம் / முகவரி)',
        description: 'Correct name, DOB, photo, or change assembly constituency.',
        govtFee: 'Free',
        serviceCharge: '₹40',
        processingTime: '15-20 Days',
        requiredDocs: [
          'Existing Voter EPIC Number',
          'Aadhaar Card',
          'Proof document for correction (Photo / Address Proof / Marksheet)',
        ],
        steps: [
          'Select Form 8 (Correction of Entries).',
          'Select fields to correct and upload supporting proof.',
          'Submit form and save reference tracking ID.',
        ],
      },
    ],
  },
  {
    id: 'passport',
    group: 'Central',
    name: 'Passport Seva Services',
    category: 'Identity',
    url: 'https://www.passportindia.gov.in/',
    iconColor: 'from-indigo-600 to-blue-800',
    description: 'Ministry of External Affairs Passport application & PCC services.',
    subServices: [
      {
        id: 'pass_fresh',
        name: 'Fresh Passport Application (புதிய பாஸ்போர்ட்)',
        description: 'Apply for 36-page or 60-page new Indian passport.',
        govtFee: '₹1,500',
        serviceCharge: '₹200',
        processingTime: '15-30 Days',
        requiredDocs: [
          'Aadhaar Card (Non-ECR proof)',
          'PAN Card / Voter ID',
          '10th Pass Certificate / Birth Certificate (Date of Birth Proof)',
          'Bank Passbook with photo & branch seal',
        ],
        steps: [
          'Register applicant user account on Passport Seva portal.',
          'Fill Application Form with personal & parent details.',
          'Pay ₹1,500 fee online and select PSK appointment slot.',
          'Print Application Receipt for Passport Seva Kendra visit.',
        ],
      },
      {
        id: 'pass_renew',
        name: 'Passport Renewal / Re-issue (புதுப்பித்தல்)',
        description: 'Renew passport upon expiry or pages exhausted.',
        govtFee: '₹1,500',
        serviceCharge: '₹200',
        processingTime: '10-20 Days',
        requiredDocs: [
          'Old Original Passport Copy (First & Last pages)',
          'Aadhaar Card',
          'Address proof if address changed',
        ],
        steps: [
          'Select Re-issue of Passport.',
          'Provide old passport details and reason for renewal.',
          'Book PSK appointment slot.',
        ],
      },
    ],
  },
  {
    id: 'parivahan',
    group: 'Central',
    name: 'Parivahan Sewa (RTO Services)',
    category: 'Identity',
    url: 'https://parivahan.gov.in/',
    iconColor: 'from-rose-500 to-red-600',
    description: 'Ministry of Road Transport & Highways driving license & vehicle RC portal.',
    subServices: [
      {
        id: 'rto_llr',
        name: 'Learner License (LLR Application - எல்.எல்.ஆர்)',
        description: 'Apply for online Learner License test for 2-Wheeler / 4-Wheeler.',
        govtFee: '₹230',
        serviceCharge: '₹100',
        processingTime: 'Instant - 3 Days',
        requiredDocs: [
          'Aadhaar Card (for online e-KYC test)',
          'Passport Size Photo & Signature Scan',
          'Blood Group Test Report',
        ],
        steps: [
          'Select State (Tamil Nadu) on Sarathi portal.',
          'Apply for Learner License using Aadhaar Authentication.',
          'Upload photo, signature & blood group.',
          'Pay fee ₹230 and complete online stall test.',
        ],
      },
      {
        id: 'rto_dlrenew',
        name: 'Driving License Renewal (டி.எல் புதுப்பித்தல்)',
        description: 'Renew expired Driving License or change address on DL card.',
        govtFee: '₹400',
        serviceCharge: '₹100',
        processingTime: '7-15 Days',
        requiredDocs: [
          'Original Driving License Copy',
          'Aadhaar Card',
          'Form 1A Medical Fitness Certificate (if age > 40 years)',
        ],
        steps: [
          'Select DL Services -> Renewal.',
          'Enter DL Number & DOB.',
          'Upload Form 1A medical cert and pay RTO renewal fee.',
        ],
      },
    ],
  },

  // ================= COMPETITIVE & ENTRANCE EXAM SERVICES =================
  {
    id: 'tnpsc_exam',
    group: 'Exam',
    name: 'TNPSC Recruitment Examinations',
    category: 'Employment',
    url: 'https://www.tnpsc.gov.in/',
    iconColor: 'from-amber-600 to-orange-700',
    description: 'Tamil Nadu Public Service Commission Vacancy Applications & OTR.',
    subServices: [
      {
        id: 'tnpsc_group4',
        name: 'TNPSC Group 4 / VAO Application (குரூப் 4 தேர்வு)',
        description: 'VAO, Junior Assistant, Typist & Bill Collector examination portal.',
        govtFee: '₹100 (Free for SC/ST)',
        serviceCharge: '₹60',
        processingTime: 'Instant',
        requiredDocs: [
          'Applicant Aadhaar Card',
          'Passport Size Photo (White Background with Name & Date printed)',
          'Signature Scan (Black ink)',
          '10th / 12th / Diploma / Degree Marksheets',
          'Community Certificate Copy',
          'TNPSC One Time Registration (OTR) Login ID & Password',
        ],
        steps: [
          'Verify One Time Registration (OTR) validity (5 years).',
          'Log in to TNPSC application portal.',
          'Select Group 4 Notification & fill educational marks.',
          'Upload photo, signature, and pay ₹100 exam fee.',
          'Print application confirmation for customer.',
        ],
      },
      {
        id: 'tnpsc_group2',
        name: 'TNPSC Group 2 & 2A (குரூப் 2 தேர்வு)',
        description: 'Sub Registrar, Municipal Commissioner, Deputy Commercial Tax Officer.',
        govtFee: '₹100',
        serviceCharge: '₹60',
        processingTime: 'Instant',
        requiredDocs: [
          'Degree Provisional / Convocation Certificate',
          '10th & 12th Marksheets (Medium of Instruction Tamil PSTM Proof)',
          'Community Certificate',
          'Aadhaar Card & Photo/Signature',
        ],
        steps: [
          'Select Group 2 / 2A notification link.',
          'Verify degree details and PSTM reservation eligibility.',
          'Submit application and issue acknowledgment slip.',
        ],
      },
      {
        id: 'tnpsc_otr',
        name: 'TNPSC One Time Registration (OTR Renewal / New)',
        description: 'New OTR creation or 5-year OTR renewal on TNPSC portal.',
        govtFee: '₹150',
        serviceCharge: '₹50',
        processingTime: 'Instant',
        requiredDocs: [
          '10th SSLC Register Number & Certificate',
          'Aadhaar Number (Aadhaar OTP verification required)',
          'Passport Size Photo & Signature Scan',
          'Active Mobile Number & Email ID',
        ],
        steps: [
          'Create OTR account using 10th SSLC roll number.',
          'Verify Aadhaar e-KYC with mobile OTP.',
          'Pay ₹150 OTR fee (valid for 5 years).',
        ],
      },
    ],
  },
  {
    id: 'ssc_exam',
    group: 'Exam',
    name: 'SSC Exam Portal (Staff Selection Commission)',
    category: 'Employment',
    url: 'https://ssc.gov.in/',
    iconColor: 'from-blue-600 to-indigo-700',
    description: 'Central Government Staff Selection Commission CGL, CHSL, MTS & GD Constable.',
    subServices: [
      {
        id: 'ssc_cgl_chsl',
        name: 'SSC CGL / CHSL / MTS Exam Application',
        description: 'Combined Graduate Level & Higher Secondary Level Central Govt recruitment.',
        govtFee: '₹100 (Free for Women/SC/ST)',
        serviceCharge: '₹50',
        processingTime: 'Instant',
        requiredDocs: [
          'Applicant Aadhaar Card',
          'Live Webcam Photo Capture (as per new SSC portal rules)',
          'Signature Scan',
          '10th / 12th / Degree Marksheet',
        ],
        steps: [
          'Log in to new SSC portal (ssc.gov.in).',
          'Capture live webcam photo of candidate.',
          'Fill preferred exam centers and qualifications.',
          'Pay ₹100 fee online and print application form.',
        ],
      },
    ],
  },
  {
    id: 'tnusrb_exam',
    group: 'Exam',
    name: 'TN Police Recruitment (TNUSRB)',
    category: 'Employment',
    url: 'https://tnusrb.tn.gov.in/',
    iconColor: 'from-red-600 to-rose-700',
    description: 'Tamil Nadu Uniformed Services Recruitment Board Police Constable & SI.',
    subServices: [
      {
        id: 'tnusrb_pc_si',
        name: 'Police Constable / Sub-Inspector Application (காவலர் தேர்வு)',
        description: 'Grade II Police Constable, Jail Warder, Firemen & Sub-Inspector recruitment.',
        govtFee: '₹250',
        serviceCharge: '₹70',
        processingTime: 'Instant',
        requiredDocs: [
          '10th SSLC Marksheet (Passed Tamil Subject)',
          'Community Certificate',
          'Applicant Aadhaar Card',
          'Passport Photo & Signature Scan',
          'NCC / NSS / Sports Certificate (if claiming extra marks)',
        ],
        steps: [
          'Register candidate on TNUSRB portal.',
          'Upload 10th mark list and community cert.',
          'Pay ₹250 examination fee.',
        ],
      },
    ],
  },
  {
    id: 'trb_exam',
    group: 'Exam',
    name: 'TRB Teacher Recruitment Board (TNTET / PG TRB)',
    category: 'Employment',
    url: 'https://trb.tn.gov.in/',
    iconColor: 'from-purple-600 to-indigo-800',
    description: 'Teacher Eligibility Test (TET) and Assistant Professor recruitment.',
    subServices: [
      {
        id: 'trb_tet',
        name: 'TNTET Teacher Eligibility Test (ஆசிரியர் தகுதித் தேர்வு)',
        description: 'Paper 1 & Paper 2 Teacher Eligibility Test application.',
        govtFee: '₹500 (₹250 for SC/ST)',
        serviceCharge: '₹70',
        processingTime: 'Instant',
        requiredDocs: [
          'D.T.Ed / B.Ed Marksheets & Degree Certificates',
          '10th & 12th Marksheets',
          'Community Certificate',
          'Aadhaar Card & Photo/Signature',
        ],
        steps: [
          'Select TNTET Paper 1 or Paper 2.',
          'Fill B.Ed/D.T.Ed qualification marks.',
          'Pay examination fee and print receipt.',
        ],
      },
    ],
  },

  // ================= PRIVATE & UTILITY SERVICES =================
  {
    id: 'tneb',
    group: 'Private',
    name: 'TNEB Electricity (TANGEDCO)',
    category: 'Utilities',
    url: 'https://www.tnebnet.org/qpay/tab2.xhtml',
    iconColor: 'from-yellow-500 to-amber-600',
    description: 'Tamil Nadu Electricity Board bill payments and service connections.',
    subServices: [
      {
        id: 'tneb_pay',
        name: 'Quick Electricity Bill Payment (கரண்ட் பில் கட்ட)',
        description: 'Pay monthly TNEB current bill instantly and print receipt.',
        govtFee: 'Bill Amount',
        serviceCharge: '₹20',
        processingTime: 'Instant',
        requiredDocs: [
          'Consumer Service Number (e.g. 04-123-456-7890)',
          'Mobile Number',
        ],
        steps: [
          'Enter TNEB Consumer Service Number.',
          'Verify bill amount and due date.',
          'Make payment via UPI / Netbanking.',
          'Print TANGEDCO official payment receipt.',
        ],
      },
      {
        id: 'tneb_newconn',
        name: 'New Service Connection (புதிய இணைப்பு)',
        description: 'Apply for new domestic / commercial electricity connection.',
        govtFee: 'Varies by KW',
        serviceCharge: '₹200',
        processingTime: '7-15 Days',
        requiredDocs: [
          'Property Patta / Sale Deed / Rental Agreement Copy',
          'Applicant Aadhaar Card',
          'Licensed Electrical Contractor Wiring Certificate',
        ],
        steps: [
          'Fill new service application on TANGEDCO portal.',
          'Upload Patta & wiring certificate PDF.',
          'Pay initial estimate fee upon AE inspection.',
        ],
      },
    ],
  },
  {
    id: 'utilities_fastag',
    group: 'Private',
    name: 'FASTag & DTH / Recharges',
    category: 'Utilities',
    url: 'https://www.netc.org.in/',
    iconColor: 'from-cyan-600 to-blue-600',
    description: 'Toll FASTag recharge, Mobile, DTH, and Insurance premium payments.',
    subServices: [
      {
        id: 'fastag_recharge',
        name: 'FASTag Recharge / New Tag Order',
        description: 'Instant FASTag balance top-up for all bank tags (NHAI / SBI / ICICI / Paytm).',
        govtFee: 'Recharge Amount',
        serviceCharge: '₹20',
        processingTime: 'Instant',
        requiredDocs: [
          'Vehicle Registration (RC) Number',
          'Tag Provider Bank Name',
        ],
        steps: [
          'Select FASTag provider bank.',
          'Enter Vehicle RC Number.',
          'Process recharge amount via UPI and print confirmation.',
        ],
      },
      {
        id: 'lic_pay',
        name: 'LIC / Vehicle Insurance Premium Payment',
        description: 'Pay LIC policy premiums and bike/car insurance renewal online.',
        govtFee: 'Premium Amount',
        serviceCharge: '₹30',
        processingTime: 'Instant',
        requiredDocs: [
          'LIC Policy Number / Vehicle RC Copy',
          'Policyholder Date of Birth',
        ],
        steps: [
          'Enter LIC Policy Number & DOB.',
          'Pay premium amount and download official LIC receipt.',
        ],
      },
    ],
  },
];

const MAIN_GROUPS = ['All', 'State', 'Central', 'Exam', 'Private'];
const CATEGORIES = ['All', 'Certificates', 'Identity', 'Land & Revenue', 'Welfare', 'Utilities', 'Employment', 'Exam'];

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('row'); // 'row' or 'grid'
  
  // Selected Main Service & Active Sub-Service for Modal
  const [selectedService, setSelectedService] = useState(null);
  const [activeSubServiceIndex, setActiveSubServiceIndex] = useState(0);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Form state for creating custom service
  const [customForm, setCustomForm] = useState({
    group: 'State',
    name: '',
    category: 'Certificates',
    url: '',
    description: '',
    subName: '',
    subDescription: '',
    govtFee: 'Free',
    serviceCharge: '₹30',
    processingTime: '1-3 Days',
    requiredDocsStr: '',
    stepsStr: '',
  });

  useEffect(() => {
    // Load custom services from Google Sheets with localStorage fallback
    const loadServicesFromSheets = async () => {
      const savedCustom = localStorage.getItem('subi_custom_services_v2');
      let localCustom = [];
      if (savedCustom) {
        try { localCustom = JSON.parse(savedCustom); } catch (e) { localCustom = []; }
      }

      setServices([...DEFAULT_SERVICES, ...localCustom]);

      // Fetch latest custom services from Google Sheets tab
      try {
        const sheetCustom = await apiGetServicesList();
        if (Array.isArray(sheetCustom) && sheetCustom.length > 0) {
          // Merge custom services (prefer Google Sheets data)
          const mergedCustom = [...sheetCustom];
          localCustom.forEach((lc) => {
            if (!mergedCustom.some((sc) => sc.id === lc.id)) {
              mergedCustom.push(lc);
            }
          });
          saveCustomServicesToStorage(mergedCustom);
          setServices([...DEFAULT_SERVICES, ...mergedCustom]);
        }
      } catch (err) {
        console.warn('Google Sheets custom services fetch fallback to local:', err);
      }
    };

    loadServicesFromSheets();
  }, []);

  const saveCustomServicesToStorage = (updatedCustomList) => {
    localStorage.setItem('subi_custom_services_v2', JSON.stringify(updatedCustomList));
  };

  const handleAddCustomService = async (e) => {
    e.preventDefault();
    if (!customForm.name || !customForm.url || !customForm.subName) {
      Swal.fire('Required Fields', 'Please enter Main Service Name, Sub-Service Name, and Website URL', 'warning');
      return;
    }

    const docsArray = customForm.requiredDocsStr
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const stepsArray = customForm.stepsStr
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newService = {
      id: 'custom_' + Date.now(),
      group: customForm.group,
      name: customForm.name,
      category: customForm.category,
      url: customForm.url.startsWith('http') ? customForm.url : `https://${customForm.url}`,
      iconColor: 'from-purple-600 to-pink-600',
      description: customForm.description || 'Custom shop online service portal.',
      isCustom: true,
      subServices: [
        {
          id: 'sub_custom_' + Date.now(),
          name: customForm.subName,
          description: customForm.subDescription || 'Sub service details.',
          govtFee: customForm.govtFee || 'Free',
          serviceCharge: customForm.serviceCharge || '₹30',
          processingTime: customForm.processingTime || '1-3 Days',
          requiredDocs: docsArray.length > 0 ? docsArray : ['Aadhaar Card', 'Ration Card'],
          steps: stepsArray.length > 0 ? stepsArray : ['Open portal', 'Fill details', 'Submit application'],
        },
      ],
    };

    const savedCustom = JSON.parse(localStorage.getItem('subi_custom_services_v2') || '[]');
    const newCustomList = [newService, ...savedCustom];
    saveCustomServicesToStorage(newCustomList);
    setServices([...DEFAULT_SERVICES, ...newCustomList]);

    // Async sync to Google Sheets
    apiAddService(newService).catch((err) =>
      console.warn('Google Sheets service save warning:', err)
    );

    setShowAddModal(false);
    setCustomForm({
      group: 'State',
      name: '',
      category: 'Certificates',
      url: '',
      description: '',
      subName: '',
      subDescription: '',
      govtFee: 'Free',
      serviceCharge: '₹30',
      processingTime: '1-3 Days',
      requiredDocsStr: '',
      stepsStr: '',
    });

    Swal.fire({
      icon: 'success',
      title: 'Service Added & Synced!',
      text: `${newService.name} - ${customForm.subName} saved to Google Sheet & App.`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
    });
  };

  const handleDeleteCustomService = (serviceId) => {
    Swal.fire({
      title: 'Delete Service Shortcut?',
      text: 'Are you sure you want to remove this custom service?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#ef4444',
    }).then((result) => {
      if (result.isConfirmed) {
        const savedCustom = JSON.parse(localStorage.getItem('subi_custom_services_v2') || '[]');
        const updatedCustom = savedCustom.filter((s) => s.id !== serviceId);
        saveCustomServicesToStorage(updatedCustom);
        setServices([...DEFAULT_SERVICES, ...updatedCustom]);
        
        // Delete from Google Sheets
        apiDeleteService(serviceId).catch((err) =>
          console.warn('Google Sheets service delete warning:', err)
        );

        if (selectedService?.id === serviceId) {
          setSelectedService(null);
        }
        Swal.fire('Deleted!', 'Service shortcut removed from Google Sheet.', 'success');
      }
    });
  };

  const copySingleDocumentText = (docName) => {
    navigator.clipboard.writeText(docName);
    Swal.fire({
      icon: 'success',
      title: 'Text Copied!',
      text: `"${docName}" copied to clipboard.`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const copyAllDocumentsOnly = (subService) => {
    const text = `📋 *${subService.name} - Required Documents Checklist:*\n\n` +
      subService.requiredDocs.map((doc, i) => `${i + 1}. ${doc}`).join('\n');

    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: 'success',
      title: 'All Documents List Copied!',
      text: `${subService.requiredDocs.length} required documents copied to clipboard!`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const copySubServiceChecklist = (mainServiceName, subService) => {
    const text = `📋 *${mainServiceName}*\n🔹 *${subService.name}*\n\n` +
      `*Required Documents Checklist:*\n` +
      subService.requiredDocs.map((doc, i) => `${i + 1}. ${doc}`).join('\n') +
      `\n\n📌 *Govt Fee:* ${subService.govtFee} | *Service Charge:* ${subService.serviceCharge}` +
      `\n⏱️ *Processing Time:* ${subService.processingTime}` +
      `\n\n-- SUBI Online Service --`;

    navigator.clipboard.writeText(text);
    Swal.fire({
      icon: 'success',
      title: 'Checklist Copied!',
      text: 'Document list copied! Ready to paste on WhatsApp for customer.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
    });
  };

  const filteredServices = services
    .filter((srv) => {
      const matchesGroup = selectedGroup === 'All' || srv.group === selectedGroup;
      const matchesCategory = selectedCategory === 'All' || srv.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      
      const matchesSearch =
        srv.name.toLowerCase().includes(q) ||
        srv.description.toLowerCase().includes(q) ||
        srv.subServices.some(
          (sub) =>
            sub.name.toLowerCase().includes(q) ||
            sub.description.toLowerCase().includes(q) ||
            sub.requiredDocs.some((d) => d.toLowerCase().includes(q))
        );

      return matchesGroup && matchesCategory && matchesSearch;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // Separate services into governance tier groups
  const stateServices = filteredServices.filter((s) => s.group === 'State');
  const centralServices = filteredServices.filter((s) => s.group === 'Central');
  const examServices = filteredServices.filter((s) => s.group === 'Exam');
  const privateServices = filteredServices.filter((s) => s.group === 'Private');

  const renderCard = (srv) => {
    const isState = srv.group === 'State';
    const isCentral = srv.group === 'Central';
    const isExam = srv.group === 'Exam';
    const isSelected = selectedService?.id === srv.id;

    const cardHoverBorder = isState
      ? 'hover:border-emerald-500/80'
      : isCentral
      ? 'hover:border-blue-500/80'
      : isExam
      ? 'hover:border-amber-500/80'
      : 'hover:border-purple-500/80';

    const groupBadgeStyle = isState
      ? 'bg-emerald-50/90 text-emerald-800 border-emerald-200'
      : isCentral
      ? 'bg-blue-50/90 text-blue-800 border-blue-200'
      : isExam
      ? 'bg-amber-50/90 text-amber-800 border-amber-200'
      : 'bg-purple-50/90 text-purple-800 border-purple-200';

    const portalBtnStyle = isState
      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/30'
      : isCentral
      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/30'
      : isExam
      ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-amber-600/30'
      : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 shadow-purple-600/30';

    // ROW VIEW
    if (viewMode === 'row') {
      return (
        <div
          key={srv.id}
          onClick={() => {
            setSelectedService(srv);
            setActiveSubServiceIndex(0);
            setUploadedFiles([]);
          }}
          className={`group relative bg-white/95 backdrop-blur-md border rounded-2xl p-4 cursor-pointer card-3d ${
            isSelected
              ? 'border-emerald-500 ring-2 ring-emerald-500/30 card-3d-selected'
              : 'border-slate-200/90'
          } ${cardHoverBorder} flex flex-col md:flex-row md:items-center justify-between gap-4`}
        >
          {/* Left: Icon + Details */}
          <div className="flex items-start md:items-center gap-3.5 flex-1 min-w-0">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                srv.iconColor || 'from-emerald-600 to-teal-700'
              } flex items-center justify-center text-white font-black text-xl icon-3d-box shrink-0 group-hover:scale-110 transition-transform duration-300`}
            >
              {srv.name.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase border ${groupBadgeStyle}`}
                >
                  {isState ? '🏛️ State Govt' : isCentral ? '🇮🇳 Central Govt' : isExam ? '🎓 Exam Portal' : '⚡ Private'}
                </span>

                <span className="text-[10px] font-extrabold text-slate-500 px-2 py-0.5 rounded-md bg-slate-100/90 border border-slate-200/60">
                  {srv.category}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-sm md:text-base leading-snug group-hover:text-emerald-600 transition-colors truncate">
                {srv.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 font-medium line-clamp-1">
                {srv.description}
              </p>
            </div>
          </div>

          {/* Middle: Sub-Services Pills */}
          <div className="hidden lg:flex items-center gap-1 flex-wrap max-w-xs shrink-0">
            {srv.subServices.slice(0, 3).map((sub, idx) => (
              <span
                key={idx}
                className="inline-flex items-center text-[10px] font-semibold bg-slate-100/90 text-slate-700 px-2 py-1 rounded-md border border-slate-200/70"
              >
                {sub.name.split('(')[0]}
              </span>
            ))}
            {srv.subServices.length > 3 && (
              <span className="inline-flex items-center text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-200/60">
                +{srv.subServices.length - 3}
              </span>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100" onClick={(e) => e.stopPropagation()}>
            {srv.isCustom && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCustomService(srv.id);
                }}
                className="text-slate-400 hover:text-red-600 p-2 rounded-xl transition-all"
                title="Delete Custom Service"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {
                setSelectedService(srv);
                setActiveSubServiceIndex(0);
                setUploadedFiles([]);
              }}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-all active:scale-95 shadow-xs whitespace-nowrap"
            >
              <span>Subs ({srv.subServices.length})</span>
            </button>

            <a
              href={srv.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-white font-extrabold text-xs shadow-md transition-all active:scale-95 whitespace-nowrap ${portalBtnStyle}`}
            >
              <span>Launch Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      );
    }

    // GRID VIEW
    return (
      <div
        key={srv.id}
        onClick={() => {
          setSelectedService(srv);
          setActiveSubServiceIndex(0);
          setUploadedFiles([]);
        }}
        className={`group relative bg-white/95 backdrop-blur-md border rounded-3xl p-5 cursor-pointer card-3d ${
          isSelected
            ? 'border-emerald-500 ring-2 ring-emerald-500/30 card-3d-selected'
            : 'border-slate-200/90'
        } ${cardHoverBorder} flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase border ${groupBadgeStyle}`}
            >
              {isState ? '🏛️ State Govt' : isCentral ? '🇮🇳 Central Govt' : isExam ? '🎓 Exam Portal' : '⚡ Private'}
            </span>

            <span className="text-[10px] font-extrabold text-slate-500 px-2 py-0.5 rounded-md bg-slate-100/90 border border-slate-200/60">
              {srv.category}
            </span>

            {srv.isCustom && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCustomService(srv.id);
                }}
                className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition-all"
                title="Delete Custom Service"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-start gap-3 mb-3">
            <div
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                srv.iconColor || 'from-emerald-600 to-teal-700'
              } flex items-center justify-center text-white font-black text-xl icon-3d-box shrink-0 group-hover:scale-110 transition-transform duration-300`}
            >
              {srv.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                {srv.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 font-medium">
                {srv.description}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Sub-Services ({srv.subServices.length})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {srv.subServices.slice(0, 3).map((sub, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-[10px] font-semibold bg-slate-100/90 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/70"
                >
                  {sub.name.split('(')[0]}
                </span>
              ))}
              {srv.subServices.length > 3 && (
                <span className="inline-flex items-center text-[10px] font-extrabold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md border border-emerald-200/60">
                  +{srv.subServices.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => {
              setSelectedService(srv);
              setActiveSubServiceIndex(0);
              setUploadedFiles([]);
            }}
            className="w-full flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-all active:scale-95 shadow-xs"
          >
            <span>Subs ({srv.subServices.length})</span>
          </button>

          <a
            href={srv.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-white font-extrabold text-xs shadow-md transition-all active:scale-95 ${portalBtnStyle}`}
          >
            <span>Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    );
  };

  const renderSection = (title, icon, badgeColor, list) => {
    if (list.length === 0) return null;
    const IconComp = icon;

    return (
      <div className="space-y-3 mb-6">
        {/* Split Section Title Banner */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-300/80">
          <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm md:text-base">
            <IconComp className="w-5 h-5 text-emerald-600" />
            <span>{title}</span>
          </div>
          <span className={`text-[11px] font-extrabold px-3 py-0.5 rounded-full border ${badgeColor}`}>
            {list.length} {list.length === 1 ? 'Service' : 'Services'}
          </span>
        </div>

        {/* Services List / Grid */}
        <div
          className={
            viewMode === 'grid'
              ? 'perspective-1000 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'perspective-1000 flex flex-col gap-3'
          }
        >
          {list.map((srv) => renderCard(srv))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 ambient-bg p-4 sm:p-6 rounded-3xl border border-slate-200/60 shadow-xs">
      {/* Main Governance Group Tabs (State, Central, Exam, Private) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setSelectedGroup('All')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
            selectedGroup === 'All'
              ? 'bg-slate-900 text-white shadow-md scale-102'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4 text-slate-400" />
          <span>All Services</span>
        </button>

        <button
          onClick={() => setSelectedGroup('State')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
            selectedGroup === 'State'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 scale-102'
              : 'text-slate-700 hover:bg-emerald-50/60'
          }`}
        >
          <Landmark className="w-4 h-4 text-amber-300" />
          <span>State Govt</span>
        </button>

        <button
          onClick={() => setSelectedGroup('Central')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
            selectedGroup === 'Central'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 scale-102'
              : 'text-slate-700 hover:bg-blue-50/60'
          }`}
        >
          <Building2 className="w-4 h-4 text-cyan-300" />
          <span>Central Govt</span>
        </button>

        <button
          onClick={() => setSelectedGroup('Exam')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
            selectedGroup === 'Exam'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30 scale-102'
              : 'text-slate-700 hover:bg-amber-50/60'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-yellow-300" />
          <span>Exams (தேர்வு)</span>
        </button>

        <button
          onClick={() => setSelectedGroup('Private')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
            selectedGroup === 'Private'
              ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-600/30 scale-102'
              : 'text-slate-700 hover:bg-purple-50/60'
          }`}
        >
          <Globe className="w-4 h-4 text-pink-300" />
          <span>Private & Utilities</span>
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search main service, sub-service (e.g. TNPSC, Income, Aadhaar, Ration, Exam), or document..."
            className="w-full pl-11 pr-4 py-3 bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills & View Mode Switcher */}
        <div className="flex items-center gap-3 justify-between md:justify-end overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-md scale-102'
                    : 'bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View Mode Switcher (Row vs Grid) */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl shrink-0 border border-slate-300/80">
            <button
              onClick={() => setViewMode('row')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'row'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
              title="Row List View (வரிசை வடிவம்)"
            >
              Row View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-white/60'
              }`}
              title="Grid Box View (கட்டம்)"
            >
              Grid View
            </button>
          </div>
        </div>
      </div>

      {/* Split Governance Service Sections */}
      {renderSection(
        '🏛️ State Government Services (மாநில அரசு சேவைகள்)',
        Landmark,
        'bg-emerald-50 text-emerald-800 border-emerald-200',
        stateServices
      )}

      {renderSection(
        '🇮🇳 Central Government Services (மத்திய அரசு சேவைகள்)',
        Building2,
        'bg-blue-50 text-blue-800 border-blue-200',
        centralServices
      )}

      {renderSection(
        '🎓 Competitive & Entrance Exams (போட்டித் தேர்வுகள்)',
        GraduationCap,
        'bg-amber-50 text-amber-800 border-amber-200',
        examServices
      )}

      {renderSection(
        '⚡ Private & Utility Services (தனியார் மற்றும் இதர சேவைகள்)',
        Globe,
        'bg-purple-50 text-purple-800 border-purple-200',
        privateServices
      )}

      {filteredServices.length === 0 && (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl p-8">
          <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Services Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try switching governance group (State/Central/Exam/Private) or clearing search filter.
          </p>
        </div>
      )}

      {/* Bottom Section: Add Custom Service Banner / Card */}
      <div className="mt-8 bg-gradient-to-r from-slate-900 via-slate-800 to-green-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-bold mb-2">
            <Plus className="w-3.5 h-3.5" /> Custom Shop Service Launcher
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Need to Add a New Custom Service Shortcut?
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Create your own shop service shortcuts (State, Central, Exam, or Private). Add custom portal links, required document lists, and fees.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg shadow-green-600/30 active:scale-95 transition-all text-xs sm:text-sm shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Custom Service</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* MAIN SERVICE & SUB-SERVICES INTERACTIVE MODAL                */}
      {/* ============================================================ */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200 my-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white relative">
              <button
                onClick={() => setSelectedService(null)}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-green-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{selectedService.group} Portal • {selectedService.category}</span>
              </div>

              <h2 className="text-xl font-extrabold text-white pr-8">
                {selectedService.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
                {selectedService.description}
              </p>

              {/* Official Launch Button */}
              <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400">
                  Select a Sub-Service below to view required documents & pricing:
                </span>
                <a
                  href={selectedService.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md transition-all shrink-0"
                >
                  <span>Launch Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Sub-Services Tabs Row */}
            <div className="bg-slate-100 p-3 border-b border-slate-200 overflow-x-auto flex gap-2 scrollbar-none">
              {selectedService.subServices.map((sub, idx) => (
                <button
                  key={sub.id || idx}
                  onClick={() => setActiveSubServiceIndex(idx)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                    activeSubServiceIndex === idx
                      ? 'bg-green-600 text-white shadow-md shadow-green-600/30'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{sub.name}</span>
                </button>
              ))}
            </div>

            {/* Active Sub-Service Body */}
            {selectedService.subServices[activeSubServiceIndex] && (
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Active Sub-Service Overview & Pricing Cards */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">
                        {selectedService.subServices[activeSubServiceIndex].name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {selectedService.subServices[activeSubServiceIndex].description}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        copySubServiceChecklist(
                          selectedService.name,
                          selectedService.subServices[activeSubServiceIndex]
                        )
                      }
                      className="flex items-center gap-1.5 text-green-800 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 self-start sm:self-auto"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Checklist</span>
                    </button>
                  </div>

                  {/* Fee Breakdown Pills */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/80 text-center">
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Govt Fee</span>
                      <span className="text-xs font-extrabold text-green-600">
                        {selectedService.subServices[activeSubServiceIndex].govtFee}
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Service Charge</span>
                      <span className="text-xs font-extrabold text-amber-600">
                        {selectedService.subServices[activeSubServiceIndex].serviceCharge}
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Processing Time</span>
                      <span className="text-xs font-extrabold text-sky-600">
                        {selectedService.subServices[activeSubServiceIndex].processingTime}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Required Documents List */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200/90">
                    <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Required Documents Checklist ({selectedService.subServices[activeSubServiceIndex].requiredDocs.length})</span>
                    </h4>

                    <button
                      type="button"
                      onClick={() => copyAllDocumentsOnly(selectedService.subServices[activeSubServiceIndex])}
                      className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-sm active:scale-95 transition-all shrink-0"
                      title="Copy all document names as a bulleted list"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All Documents List</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {selectedService.subServices[activeSubServiceIndex].requiredDocs.map((doc, idx) => (
                      <div
                        key={idx}
                        onClick={() => copySingleDocumentText(doc)}
                        className="group/doc flex items-center justify-between gap-2.5 text-xs text-slate-700 bg-white hover:bg-emerald-50/60 p-3 rounded-xl border border-slate-200 hover:border-emerald-400/80 cursor-pointer transition-all shadow-2xs"
                        title="Click to copy text"
                      >
                        <div className="flex items-start gap-2.5 min-w-0 pr-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-semibold text-slate-800 group-hover/doc:text-emerald-900 transition-colors">{doc}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copySingleDocumentText(doc);
                          }}
                          className="flex items-center gap-1 text-[11px] font-extrabold text-slate-500 hover:text-emerald-700 hover:bg-emerald-100/80 px-2.5 py-1 rounded-lg transition-all shrink-0 border border-slate-200/60 hover:border-emerald-300"
                          title="Copy document text"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Steps Guide */}
                {selectedService.subServices[activeSubServiceIndex].steps && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Step-by-step Guide</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedService.subServices[activeSubServiceIndex].steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="font-medium">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer Document Uploader */}
                <div className="pt-2">
                  <FileUpload files={uploadedFiles} setFiles={setUploadedFiles} />
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 font-medium">
                {uploadedFiles.length > 0
                  ? `${uploadedFiles.length} file(s) attached`
                  : 'Ready to process customer service'}
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ADD CUSTOM SERVICE MODAL                                     */}
      {/* ============================================================ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200 my-8">
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-400" />
                <span>Add Custom Main & Sub-Service</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomService} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Governance Group *
                  </label>
                  <select
                    value={customForm.group}
                    onChange={(e) => setCustomForm({ ...customForm, group: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none bg-white"
                  >
                    <option value="State">State Govt (மாநில)</option>
                    <option value="Central">Central Govt (மத்திய)</option>
                    <option value="Exam">Competitive Exams (தேர்வுகள்)</option>
                    <option value="Private">Private & Utilities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={customForm.category}
                    onChange={(e) => setCustomForm({ ...customForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none bg-white"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Main Portal / Service Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TNPSC Portal / TRB Exam / EPFO"
                  value={customForm.name}
                  onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Website URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.gov.in"
                  value={customForm.url}
                  onChange={(e) => setCustomForm({ ...customForm, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200">
                <div className="text-xs font-extrabold text-green-700 uppercase tracking-wider mb-3">
                  Sub-Service Details
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Sub-Service Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Group 4 / VAO Application / TET Exam"
                      value={customForm.subName}
                      onChange={(e) => setCustomForm({ ...customForm, subName: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Govt Fee
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹100 or Free"
                        value={customForm.govtFee}
                        onChange={(e) => setCustomForm({ ...customForm, govtFee: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Service Charge
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹60"
                        value={customForm.serviceCharge}
                        onChange={(e) => setCustomForm({ ...customForm, serviceCharge: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Required Documents (1 per line)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="10th Marksheet&#10;Community Certificate&#10;Passport Photo & Signature"
                      value={customForm.requiredDocsStr}
                      onChange={(e) => setCustomForm({ ...customForm, requiredDocsStr: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow-md shadow-green-600/20 transition-all"
                >
                  Save Service Shortcut
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
