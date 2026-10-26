// Everything the site says lives here. Edit this file to update the portfolio.

export const profile = {
  name: 'ABDULLAH',
  handle: 'abdullah.sec',
  tagline: ['Cybersecurity student', 'Security automation', 'Secure AI agents'],
  location: 'Toronto, ON',
  school: 'Seneca Polytechnic',
  email: 'abdullahsiddique365@gmail.com',
  github: 'https://github.com/Abdullah-365',
  linkedin: 'https://www.linkedin.com/in/abdullah3650/',
  seeking: 'Cybersecurity, SOC or IT infrastructure co-op and part-time roles',
  about: [
    "I'm a fifth-semester Cybersecurity student at Seneca Polytechnic. I like taking systems apart to see how they break, then rebuilding them so they don't.",
    "I've migrated flat networks into VLAN security zones, traced persistence through memory dumps and registry hives, and locked down identities in Microsoft Entra ID. On the support desk at Seneca ITS I keep classrooms running. In applied research I built LLM-powered Python pipelines.",
    "Right now I'm building AI agents, and the harness controls that keep them from going rogue.",
  ],
  stats: [
    { value: '05/08', label: 'semester' },
    { value: '13', label: 'labs and projects' },
    { value: '3', label: 'roles' },
    { value: 'VP', label: 'Cyber Cafe Club' },
  ],
}

export const brief = [
  'Honours BIT, Cybersecurity, Seneca Polytechnic, semester 5 (expected Aug 2028)',
  'Hands-on network segmentation, firewall automation, vulnerability assessment, DFIR and Entra ID IAM',
  'Applied AI research: LLM-powered Python data pipelines with Seneca CIAIT and Spatial Laser',
  'Front-line IT support at Seneca ITS: classroom tech, HyFlex, incident logging and escalation',
  'Vice President of the Cyber Cafe Club',
]

export const projects = [
  {
    id: 'phish-check',
    code: 'TOOL',
    term: 'Personal project · 2026',
    title: 'phish-check: phishing email triage',
    oneLiner: 'A live web tool that takes a suspicious email apart and shows who really sent it, where its links go and what it hides.',
    tags: ['TypeScript', 'React', 'Cloudflare Workers', 'Email security', 'Threat intel'],
    details: [
      "Paste an email's source or drop the file (.eml or Outlook .msg) to get a verdict with plain-English reasons. Its X-ray lens shows the real sender, where each link really goes and hidden trackers.",
      'A TypeScript engine combines provider spam verdicts, SPF/DKIM/DMARC, sender and link forensics, attachment inspection (PDFs, archives, macros, HTML) and scam wording in seven languages. On real phishing it never saw while being tuned, it catches 90.6%, with 0.7% false positives on legitimate mail.',
      'The email never leaves the browser. Its DKIM signatures are verified there against keys from DNS (RSA and Ed25519), so a forged "pass" header is caught. Other online checks (domain age, OpenPhish, URLhaus, MalwareBazaar) run on a Cloudflare Worker with a strict CSP and no request logs.',
    ],
    link: 'https://phish.abdullah1.dev',
    badge: 'live',
    linkLabel: 'Open the live tool',
    featured: true,
  },
  {
    id: 'spr500',
    code: 'SPR500',
    term: 'Fall 2026',
    title: 'Secure enterprise network architecture',
    oneLiner: 'Rebuilt a flat company network as VLAN security zones with dynamic routing and a stateful internal firewall.',
    tags: ['VLANs', 'OSPF', 'FRRouting', 'Split DNS', 'Ansible', 'NIST 800-30'],
    details: [
      'Designing and deploying secure infrastructure for a fictitious Canadian mid-sized company: corporate and e-commerce sites, an internal HR/ERP system, file-sharing storage and Active Directory.',
      'Migrating a flat network into VLAN-based security zones with OSPF dynamic routing (FRRouting), split DNS (private and public) and a stateful internal L3 firewall. Host firewalls are automated with Ansible and Python.',
      'Producing OSINT-based specifications, RBAC and network access policies mapped to CIS Critical Security Controls, plus TVRA risk assessments (NIST SP 800-30r1) and multi-tool vulnerability scans.',
    ],
    featured: true,
  },
  {
    id: 'srt521',
    code: 'SRT521',
    term: 'Fall 2026',
    title: 'Building secure LLM agents',
    oneLiner: 'Python AI agents with tool calling, RAG and MCP, held in check by allowlists, permission gates and sandboxing.',
    tags: ['Python', 'ReAct', 'RAG', 'MCP', 'OWASP Agentic Top 10'],
    details: [
      'Building Python AI agents with structured tool calling, a ReAct control loop, memory and retrieval (RAG and embeddings), and Model Context Protocol (MCP) servers and clients.',
      'Implementing harness controls: tool allowlists, permission gates, sandboxing, and step and cost caps.',
      'Evaluating agents with code-graded task sets and studying prompt-injection defenses from the OWASP Agentic Top 10.',
    ],
    featured: true,
  },
  {
    id: 'agent-skills',
    code: 'OSS',
    term: 'Open source',
    title: 'Agent skills for homelabs',
    oneLiner: 'Open-source skills that let AI agents run Proxmox and VMware labs from plain-language requests.',
    tags: ['AI agents', 'Proxmox', 'VMware', 'VLANs', 'iptables'],
    details: [
      'proxmox-lab: VMs, LXC containers, cloud-init templates, snapshots, host bridges and VLANs, SDN, and whole multi-machine labs built from one prompt.',
      'vmware-lab-ops: vmrun VM lifecycle and snapshots, .vmx tuning, VMnet and LAN segments, 802.1Q VLAN trunks, SSH pivoting between hosts, stateless iptables firewalls and disaster-recovery triage.',
      'MIT licensed and works with Claude Code, the Claude apps and other agents that load SKILL.md skills.',
    ],
    link: 'https://github.com/Abdullah-365/Agent_skills',
    featured: true,
  },
  {
    id: 'spr400',
    code: 'SPR400',
    term: 'Semester 4',
    title: 'Digital forensics and incident response',
    oneLiner: 'Ran simulated incidents through the full NIST lifecycle and hunted persistence in memory, logs and the registry.',
    tags: ['DFIR', 'NIST IR', 'Memory forensics', 'Chain of custody'],
    details: [
      'Applied the full NIST incident response lifecycle, from preparation through recovery, to simulated security incidents.',
      'Acquired and preserved evidence with forensically sound tools and chain of custody.',
      'Analyzed file systems, event logs, memory dumps and Windows registry artifacts to uncover persistence and privilege escalation.',
    ],
    featured: true,
  },
  {
    id: 'iam500',
    code: 'IAM500',
    term: 'Fall 2026',
    title: 'Identity and access management in Entra ID',
    oneLiner: 'Configured MFA, Conditional Access, PIM and federated identity for a Microsoft Entra ID tenant.',
    tags: ['Entra ID', 'MFA', 'Conditional Access', 'PIM', 'SSPR'],
    details: [
      'Configured user roles, group-based licensing, guest and B2B collaboration, and federated identity providers.',
      'Implemented MFA, self-service password reset, Conditional Access, smart lockout and Privileged Identity Management (PIM).',
    ],
    featured: true,
  },
  {
    id: 'ris430',
    code: 'RIS430',
    term: 'Semester 4',
    title: 'Vulnerability assessment and management program',
    oneLiner: 'Assessed infrastructure and web apps in an isolated lab, scored findings with CVSS and proposed a remediation program.',
    tags: ['Nessus', 'OpenVAS', 'OWASP ZAP', 'CVE', 'CVSS'],
    details: [
      'Performed infrastructure and web application vulnerability assessments on virtual machines in an isolated security lab.',
      'Classified findings with industry standards (CVE and CVSS) and traced root causes.',
      'Co-authored assessment reports with prioritized mitigations and a proposed vulnerability management program.',
    ],
    featured: true,
  },
  {
    id: 'ris440',
    code: 'RIS440',
    term: 'Semester 4',
    title: 'Network attacks and defense lab series',
    oneLiner: 'Executed and defended against ARP, TCP/UDP, DNS and BGP attacks, and wrote a simple protocol analyzer.',
    tags: ['Wireshark', 'VPN', 'TLS/PKI', 'Firewalls'],
    details: [
      'Executed and defended against ARP/MAC-layer, TCP/UDP, DNS and BGP attacks in a lab network. Configured firewalls, VPN tunnels and TLS/PKI.',
      'Developed a simple protocol analyzer and used Wireshark to analyze traffic, inventory services and identify data exposure.',
    ],
  },
  {
    id: 'spr320',
    code: 'SPR320 · SRT205',
    term: 'Semesters 2–3',
    title: 'Endpoint hardening and CIS benchmark automation',
    oneLiner: 'Ansible playbooks that check CIS Benchmarks and harden Ubuntu and Windows hosts.',
    tags: ['Ansible', 'Vault', 'CIS Benchmarks'],
    details: [
      'Wrote Ansible playbooks (variables, templates, Vault) to automate CIS Benchmark checks and harden Ubuntu and Windows hosts.',
      'Investigated endpoints for compromise and remediated issues.',
    ],
  },
  {
    id: 'srt411',
    code: 'SRT411',
    term: 'Semester 4',
    title: 'Security data analytics',
    oneLiner: 'Collected, cleaned and statistically analyzed security logs to detect threats.',
    tags: ['Logging', 'Statistics', 'Visualization'],
    details: [
      'Configured logging sources, then collected, cleaned and statistically analyzed security data to detect threats.',
      'Visualized findings for technical and non-technical audiences.',
    ],
  },
  {
    id: 'ops300',
    code: 'OPS300',
    term: 'Semester 3',
    title: 'Secure virtualized enterprise infrastructure',
    oneLiner: 'Deployed and secured VMs, containers, virtual networks and storage with automation.',
    tags: ['Docker', 'Podman', 'Kubernetes'],
    details: [
      'Deployed and secured virtualized infrastructure using VMs, containers (Docker, Podman, Kubernetes), virtual networks and storage, applying automation and software-defined infrastructure practices.',
    ],
  },
  {
    id: 'ris330',
    code: 'RIS330',
    term: 'Semester 3',
    title: 'Secure database design',
    oneLiner: 'Relational database for a real estate system, with roles, replication, backup and data protection.',
    tags: ['SQL', 'RBAC', 'Backup'],
    details: [
      'Designed a relational SQL database for properties and clients, with user roles and privileges, replication, backup and recovery, and protection of sensitive data.',
    ],
  },
  {
    id: 'dcn',
    code: 'DCN230 · DCN330',
    term: 'Semesters 2–3',
    title: 'Cisco network design and configuration',
    oneLiner: 'Hierarchical LANs on Cisco gear: VLSM, VLANs, trunking, inter-VLAN routing, STP and OSPF.',
    tags: ['Cisco IOS', 'VLSM', 'STP', 'OSPF'],
    details: [
      'Designed hierarchical LANs and configured Cisco routers and switches with subnetting and VLSM, VLANs, trunking, inter-VLAN routing, STP and OSPF.',
    ],
  },
]

export const experience = [
  {
    start: '2026-09',
    end: 'now',
    level: 'ACTIVE',
    role: 'ITS Student Lab Monitor and HyFlex Ambassador',
    org: 'Seneca Polytechnic · Information Technology Services',
    place: 'Toronto, ON',
    details: [
      'First-line support for classroom computers, logins, touch panels, podium controls, projectors, microphones and cameras, keeping lectures on schedule.',
      'Set up and troubleshoot Zoom and MS Teams sessions, classroom AV and network connectivity for HyFlex (in-person and remote) classes.',
      'Log and route incidents, document every troubleshooting step, escalate complex issues and close the loop with users.',
    ],
  },
  {
    start: '2025-09',
    end: '2026-04',
    level: 'INFO',
    role: 'Research Assistant',
    org: 'Seneca Applied Research (CIAIT) × Spatial Laser',
    place: 'Toronto, ON',
    details: [
      'Worked with the Principal Investigator and Spatial Laser engineers on "Using AI for Document Processing in Real Estate".',
      'Engineered a Python data-extraction tool (openpyxl, pandas) that parses complex Excel documents and loads sanitized records into a structured database.',
      'Integrated LLM-generated configuration files to map and extract real estate financial fields, and validated output against source documents to build ground-truth datasets.',
    ],
  },
  {
    start: '2025-09',
    end: 'now',
    level: 'ACTIVE',
    role: 'Vice President',
    org: 'Cyber Cafe Club · Seneca Polytechnic',
    place: 'Toronto, ON',
    details: [
      'Organize meetups, cybersecurity challenges and networking events.',
      'Mentor new members on security fundamentals and tools.',
    ],
  },
  {
    start: '2024-01',
    end: '2024-08',
    level: 'INFO',
    role: 'Device Test Engineer',
    org: 'Ecordia · PAK project (Xiaomi vendor devices)',
    place: '',
    details: [
      'Device flashing, sanity and network performance testing across 2G/3G/LTE/5G and IMS (VoLTE and VoWiFi).',
      'Logged bugs and maintained daily reports and trackers.',
    ],
  },
]

export const education = [
  {
    when: '2024 – 2028',
    title: 'Honours Bachelor of Information Technology, Cybersecurity',
    org: 'Seneca Polytechnic, Newnham Campus · semester 5',
  },
  {
    when: '2021 – 2023',
    title: 'A-Levels',
    org: 'Army Burn Hall College',
  },
]

// Rendered as an nmap scan. Ports are picked to match the service.
export const skills = [
  { port: '443/tcp', service: 'https', label: 'Security and analysis', items: ['Wireshark', 'Nmap', 'Metasploit', 'BloodHound', 'Nessus', 'OpenVAS', 'OWASP ZAP', 'Splunk', 'ELK Stack', 'Velociraptor', 'CVE/CVSS'] },
  { port: '53/udp', service: 'domain', label: 'Networking and infrastructure', items: ['Cisco IOS', 'VLANs', 'STP', 'OSPF (FRRouting)', 'Firewalls', 'VPN', 'TLS/PKI', 'DNS/DHCP', 'Active Directory', 'Linux Server', 'Windows Server'] },
  { port: '389/tcp', service: 'ldap', label: 'Identity and cloud', items: ['Microsoft Entra ID', 'MFA', 'Conditional Access', 'PIM', 'SSPR', 'Azure Key Vault', 'Defender for Cloud Apps'] },
  { port: '22/tcp', service: 'ssh', label: 'Automation and programming', items: ['Python', 'Bash', 'Ansible', 'SQL', 'Git', 'Docker', 'Podman', 'Kubernetes'] },
  { port: '8080/tcp', service: 'http-proxy', label: 'AI and data', items: ['LLM APIs', 'AI agents', 'Tool calling', 'RAG', 'MCP', 'pandas', 'Data visualization'] },
  { port: '514/udp', service: 'syslog', label: 'Frameworks', items: ['NIST SP 800-30r1', 'NIST IR lifecycle', 'CIS Controls', 'CIS Benchmarks', 'OWASP Top 10'] },
  { port: '3389/tcp', service: 'ms-wbt-server', label: 'IT support', items: ['Windows', 'macOS', 'Classroom AV', 'Zoom', 'MS Teams', 'Ticketing and escalation'] },
]

// The orbiting files in the 3D core. Order matters: it matches the page sections.
export const files = [
  { id: 'about', file: 'about.enc', dir: 'about/' },
  { id: 'projects', file: 'projects.enc', dir: 'projects/' },
  { id: 'experience', file: 'experience.enc', dir: 'experience/' },
  { id: 'skills', file: 'skills.enc', dir: 'skills/' },
  { id: 'contact', file: 'contact.enc', dir: 'contact/' },
]
