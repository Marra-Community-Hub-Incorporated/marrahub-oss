// Volunteer Agreement terms, transcribed from the official
// "Marra Community Hub Incorporated Volunteer Agreement" PDF (public/).
// Keep this in sync with the source PDF if the document is revised, and bump
// `agreementVersion` in config.ts when you do.

export const agreementIntro =
  'This Volunteer Agreement (“Agreement”) is made between Marra Community Hub Incorporated ' +
  '(ABN/ACNC-registered charity, of Caulfield South VIC 3162) (“Marra Community Hub Incorporated”, ' +
  '“the Organisation”) and the volunteer named below (“the Volunteer”). It sets out the basis on which ' +
  'the Volunteer offers their services to the Organisation. This Agreement is not a contract of employment ' +
  'and is not legally binding; it is a statement of mutual intention and expectation made in good faith.';

export interface AgreementTerm {
  n: number;
  title: string;
  body: string;
}

export const agreementTerms: AgreementTerm[] = [
  {
    n: 1,
    title: 'Role and Nature of Engagement',
    body:
      'The Volunteer agrees to provide services to Marra Community Hub Incorporated on a voluntary, unpaid basis. ' +
      'The Volunteer is not an employee, contractor or agent of the Organisation, and nothing in this Agreement ' +
      'creates an employment relationship or entitlement to wages, leave or other employment benefits. Either party ' +
      'may end the arrangement at any time.',
  },
  {
    n: 2,
    title: 'Duties and Expectations',
    body:
      'The Volunteer agrees to carry out agreed tasks to the best of their ability, to act in the best interests of ' +
      'Marra Community Hub Incorporated and the community it serves, to follow reasonable directions from the ' +
      'Organisation, and to give reasonable notice if unable to attend or continue.',
  },
  {
    n: 3,
    title: 'Code of Conduct',
    body:
      'The Volunteer agrees to treat all people with respect and without discrimination, harassment or bullying; to ' +
      'act honestly, safely and lawfully; to represent Marra Community Hub Incorporated appropriately; and to avoid ' +
      'conduct that could damage the Organisation’s reputation or standing as a registered charity.',
  },
  {
    n: 4,
    title: 'Working with Children',
    body:
      'Where the Volunteer’s role involves contact with children or young people, the Volunteer must hold a current ' +
      'Victorian Working with Children Check (WWCC) and provide it to the Organisation before commencing such ' +
      'activities. The Volunteer agrees to comply with the Organisation’s child-safe practices and the Victorian ' +
      'Child Safe Standards at all times.',
  },
  {
    n: 5,
    title: 'Confidentiality and Privacy',
    body:
      'In the course of volunteering the Volunteer may access confidential information, including personal data of ' +
      'community members, donors, staff and other volunteers; financial, operational and administrative records; ' +
      'internal communications; and any information held in the Organisation’s systems. The Volunteer agrees to keep ' +
      'all such information strictly confidential during and after their involvement; to access and use it only as ' +
      'required to perform their role; not to copy, remove, disclose or retain it without authorisation; and to handle ' +
      'all personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles. ' +
      'Confidential information remains the property of Marra Community Hub Incorporated and must be returned or ' +
      'destroyed on request.',
  },
  {
    n: 6,
    title: 'Systems, Accounts and Security',
    body:
      'The Volunteer may be granted access to the Organisation’s systems and accounts, including but not limited to ' +
      'Microsoft 365 (email, files and administration), GitHub repositories, the website and hosting, and event and ' +
      'workshop tools. The Volunteer agrees to: use these systems only for authorised Organisation purposes; comply ' +
      'with all security requirements, including strong passwords and multi-factor authentication; not share, transfer ' +
      'or allow others to use their accounts or credentials; not install unauthorised software or expose systems to ' +
      'undue risk; promptly report any suspected security incident, breach or lost device; and immediately return, and ' +
      'cease using, all access, credentials, data and Organisation property when their role ends or on request. ' +
      'Administrative or elevated access must be used strictly within the scope authorised by the Organisation.',
  },
  {
    n: 7,
    title: 'Intellectual Property',
    body:
      'The Volunteer agrees that all intellectual property created by the Volunteer in the course of their ' +
      'volunteering for Marra Community Hub Incorporated — including software code, repositories, designs, written and ' +
      'workshop content, artwork, documentation and other materials — is owned by Marra Community Hub Incorporated. ' +
      'The Volunteer assigns all such rights to the Organisation and agrees to do anything reasonably necessary to ' +
      'give effect to this. Where the Organisation elects to release such work under an open-source or open licence, ' +
      'the Volunteer consents to that release.',
  },
  {
    n: 8,
    title: 'Events, Workshops and Public Activities',
    body:
      'When delivering or assisting at workshops, events or other public activities, the Volunteer agrees to follow ' +
      'the Organisation’s instructions and safety requirements, to respect the privacy and consent of participants ' +
      '(including in relation to photography and recordings), and to act appropriately when representing Marra ' +
      'Community Hub Incorporated in public.',
  },
  {
    n: 9,
    title: 'Volunteer Warranties and Fitness for Role',
    body:
      'The Volunteer warrants that they are medically and physically fit to perform the duties of their role; that ' +
      'they will disclose to the Organisation any medical condition, injury, allergy or other matter that may affect ' +
      'their ability to volunteer safely or that the Organisation should reasonably be aware of; that they hold any ' +
      'qualifications, checks or rights (including the right to volunteer or work in Australia) that their role ' +
      'requires; and that the information they have provided is true and complete. The Volunteer agrees to keep the ' +
      'Organisation informed if any of these matters change.',
  },
  {
    n: 10,
    title: 'Acknowledgement of Risk',
    body:
      'The Volunteer acknowledges that volunteering, including attendance at workshops, events and other activities, ' +
      'may involve inherent risks, and that they participate voluntarily and of their own choice. The Volunteer ' +
      'agrees to take reasonable care for their own health and safety, to follow all safety directions, and to ask ' +
      'if they are unsure about any task.',
  },
  {
    n: 11,
    title: 'Health, Safety and Insurance',
    body:
      'Marra Community Hub Incorporated will take reasonable steps to provide a safe environment and inform the ' +
      'Volunteer of relevant risks. The Volunteer agrees to follow all health and safety directions, to report ' +
      'hazards, incidents and injuries promptly, and to take reasonable care for their own safety and that of others. ' +
      'The Organisation holds public liability insurance covering its authorised activities. This insurance applies ' +
      'only to activities authorised by and carried out on behalf of the Organisation, and does not extend to acts ' +
      'outside the Volunteer’s authorised role.',
  },
  {
    n: 12,
    title: 'Incident and Injury Reporting',
    body:
      'The Volunteer agrees to report to the Organisation, as soon as reasonably practicable, any injury, illness, ' +
      'accident, near-miss, hazard, property damage, data or security incident, or other matter of concern arising ' +
      'in connection with their volunteering. Prompt reporting allows the Organisation to respond appropriately and ' +
      'is a condition of this Agreement.',
  },
  {
    n: 13,
    title: 'Conflict of Interest',
    body:
      'The Volunteer agrees to disclose to the Organisation any actual, potential or perceived conflict of interest — ' +
      'including any personal, financial or other interest that could compromise, or appear to compromise, their role ' +
      'or the interests of Marra Community Hub Incorporated — as soon as they become aware of it, and to follow any ' +
      'reasonable direction the Organisation gives to manage it.',
  },
  {
    n: 14,
    title: 'Public Comment and Social Media',
    body:
      'The Volunteer agrees not to speak to the media, make public statements, or post on social media on behalf of, ' +
      'or in the name of, Marra Community Hub Incorporated without prior authorisation, and not to use the ' +
      'Organisation’s name, logo, accounts or materials except as authorised for their role. Any personal social ' +
      'media use must not imply they are speaking for the Organisation.',
  },
  {
    n: 15,
    title: 'Use of Volunteer’s Image',
    body:
      'The Volunteer consents to Marra Community Hub Incorporated taking photographs, video or audio that may include ' +
      'the Volunteer during authorised activities, and to the Organisation using these for promotional, reporting, ' +
      'grant-acquittal and community purposes. The Volunteer may withdraw this consent in writing at any time, after ' +
      'which the Organisation will not make new use of such material.',
  },
  {
    n: 16,
    title: 'Limitation of Liability',
    body:
      'To the maximum extent permitted by law, Marra Community Hub Incorporated is not responsible or liable for any ' +
      'loss, damage, injury, claim or liability arising from: (a) the Volunteer’s own acts, omissions, negligence or ' +
      'personal loss; or (b) any act or omission of the Volunteer that is outside, or in breach of, their authorised ' +
      'duties or this Agreement, or that is unlawful. The Volunteer is responsible for their own conduct and agrees ' +
      'not to hold the Organisation responsible for matters of the kind described above. Nothing in this clause ' +
      'excludes any liability that cannot be excluded by law.',
  },
  {
    n: 17,
    title: 'Indemnity',
    body:
      'To the extent permitted by law, the Volunteer indemnifies Marra Community Hub Incorporated against any loss, ' +
      'damage, cost, expense or claim suffered or incurred by the Organisation that arises from the Volunteer’s ' +
      'unlawful conduct, wilful misconduct, gross negligence, or material breach of this Agreement. This clause does ' +
      'not apply to acts or omissions done honestly and reasonably within the proper scope of the Volunteer’s ' +
      'authorised duties.',
  },
  {
    n: 18,
    title: 'Reimbursement of Expenses',
    body:
      'Marra Community Hub Incorporated may reimburse reasonable out-of-pocket expenses that are agreed and ' +
      'authorised in advance, on production of receipts. The Volunteer is not otherwise entitled to any payment.',
  },
  {
    n: 19,
    title: 'Ending the Arrangement',
    body:
      'This is a voluntary arrangement that may be ended by either party at any time, with or without notice. On ' +
      'ending, the Volunteer agrees to return any Organisation property, materials and access credentials, and ' +
      'confidentiality, intellectual property, security and indemnity obligations continue.',
  },
  {
    n: 20,
    title: 'Variation and Updates',
    body:
      'Marra Community Hub Incorporated may update or amend this Agreement from time to time, for example to reflect ' +
      'changes in its operations, systems, policies or legal requirements. The Organisation will notify the Volunteer ' +
      'in writing (including by email) of any updated version, which will apply from the date of notice without ' +
      'requiring the Volunteer to sign again. If the Volunteer does not accept a change, they may raise it with the ' +
      'Organisation or choose to end their volunteering. Continuing to volunteer after notice is taken as acceptance ' +
      'of the updated Agreement.',
  },
  {
    n: 21,
    title: 'Governing Law',
    body:
      'This Agreement is governed by the laws of the State of Victoria, Australia, and the parties submit to the ' +
      'jurisdiction of the courts of that State.',
  },
];

// Path to the official blank PDF in /public, for the "read the full agreement" link.
export const agreementPdfPath = '/Marra_Hub_Volunteer_Agreement.pdf';
