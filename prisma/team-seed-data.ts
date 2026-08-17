export type TeamSeedMember = {
  slug: string;
  fullName: string;
  role: string | null;
  displayOrder: number;
  profileImage: string;
  biography: string;
  linkedinUrl?: string;
  email?: string;
  showEmail?: boolean;
};

export const TEAM_SEED_MEMBERS: TeamSeedMember[] = [
  {
    slug: "elizabeth-dansoa-osei",
    fullName: "Elizabeth Dansoa Osei",
    role: "Founder",
    displayOrder: 1,
    profileImage: "/images/team/elizabeth-dansoa-osei.jpg",
    linkedinUrl: "https://uk.linkedin.com/in/elizabeth-dansoa-osei",
    email: "eduleadnetwork@gmail.com",
    showEmail: true,
    biography: `<p>Elizabeth Dansoa Osei is a distinguished public policy professional, education governance specialist, and research practitioner whose work spans Africa, Europe, and Latin America. With a career rooted in evidence-based policymaking, equity-driven reform, and institutional transformation, she brings a decade of experience across government, international organisations, academia, and global development institutions.</p><p>She currently serves as a Research and Policy Evaluation Officer at the UK's Office for Standards in Education, where she contributes to national education quality assurance through rigorous policy analysis, evaluation design, and system-level research.</p><p>Her global policy footprint includes roles at UNESCO in Latin America where she conducted cross-national research for the Global Trends in Higher Education Report; Preston Consults, where she supported economic reforms across Nigeria's trade, investment and industry sector; and PwC Ghana, where she led mixed-methods research for UNICEF, UK's FCDO, and national ministries, contributing to major sector analyses, and STEM policy frameworks.</p><p>Earlier in her career, Elizabeth contributed to policy development and institutional strengthening within Ghana's public sector, working with the Ministry of Works and Housing and the Ministry of Communications and Digitalisation. She also served as a Youth Advisory Committee Member to Ghana's Ministry of Gender on the development of the Child and Family Welfare Policy.</p><p>Her policy insights have been featured at global platforms such as the 21st Steering Committee of the UNECE on Education for Sustainable Development (Geneva), Education World Forum (London), the Future We Want Global Initiative for Young Leaders (New York), the Downing Annual Conference (Cambridge), ECOSOC Youth Forum (New York), and the Sustainable Development in Africa Conference (Denver, USA).</p><p>Beyond her professional roles, she is a committed leader and advocate. She founded Your Child Today, Our President Tomorrow, an initiative that has provided academic support and mentorship to students in Ghana and beyond. Elizabeth is a proud scholar of H.E John Agyekum Kufuor, a Weidenfeld Hoffmann Scholar, a Clinton Global Initiative Fellow, a YALI West Africa Fellow, a UNICEF Innocenti Youth Foresight Circle Member and a UN Millennium Fellow.</p><p>She holds a master's degree in public policy from the University of Oxford and a first-class degree in Political Science and Philosophy from the University of Ghana. Recognised as a dynamic and principled voice in public policy, Elizabeth continues to shape conversations on inclusive development.</p>`,
  },
  {
    slug: "stephen-awuah-pobi",
    fullName: "Stephen Awuah-Pobi",
    role: "Partnerships and External Relations Lead",
    displayOrder: 2,
    profileImage: "/images/team/stephen-awuah-pobi.jpg",
    linkedinUrl: "https://www.linkedin.com/in/stephen-awuah-pobi-b419a2233",
    biography: `<p>Stephen Awuah-Pobi is a political scientist and emerging public policy professional with demonstrated leadership experience across academia, youth governance, and international development. He holds a Master's degree in Political Science from the University of Windsor, Canada, and has completed professional certifications in Public Policy, International Diplomacy, and Cultural Diplomacy.</p><p>He currently serves as the Deputy Vice Speaker of the Pan African Youth Parliament and is a Member of the United Nations Environment Programme (UNEP) Child and Youth Working Group, where he contributes to policy discussions on youth inclusion, environmental sustainability, and global governance.</p><p>Previously, Stephen served as the Political Science Representative on the University of Windsor Graduate Student Society Board of Directors and was a member of the university's Food Security Working Group, advocating for student welfare and institutional development.</p><p>Before relocating to Canada, Stephen served as President of the Political Science Students' Association (POSSA) and Speaker of the Student Representative Council General Assembly at the University of Ghana, leading initiatives that strengthened student representation, democratic participation, and institutional accountability.</p><p>His areas of expertise include democratic governance, public policy analysis, legislative affairs, international relations, diplomacy, youth leadership, environmental governance, and African politics. Stephen is passionate about advancing evidence-based policymaking, strengthening democratic institutions, and creating opportunities for young people to influence governance at national, continental, and global levels.</p>`,
  },
  {
    slug: "linda-ackah-mensah",
    fullName: "Linda Ackah-Mensah",
    role: null,
    displayOrder: 3,
    profileImage: "/images/team/linda-ackah-mensah.jpg",
    biography: `<p>Linda Ackah-Mensah is a graduate student at Georgia State University's Robinson College of Business, pursuing an MSIS with a concentration in AI for Business Innovation. Her background is in policy research — she's worked with PwC Ghana and the Parliament of Ghana on issues spanning education equity, climate finance, and gender analysis — and she's now transitioning that research and storytelling instinct into tech, content, and communications work.</p><p>She writes A Girl With Something to Say, a platform exploring identity, ambition, and the systems that shape women's lives. She's driven by a long-term vision of building technology and media that create real impact across Africa and underserved communities, and she brings that same lens to her communications work with EduLead Network.</p>`,
  },
  {
    slug: "christabel-gyebuaa-mensah",
    fullName: "Christabel Gyebuaa Mensah",
    role: null,
    displayOrder: 4,
    profileImage: "/images/team/christabel-gyebuaa-mensah.jpg",
    biography: `<p>Christabel Gyebuaa Mensah is a Registered Midwife and an emerging Public Health professional. She holds a Bachelor of Science in Midwifery from the University of Ghana and is currently pursuing an MPH in Sexual and Reproductive Health at the Liverpool School of Tropical Medicine in the United Kingdom, alongside an MPhil in Field Epidemiology and Applied Biostatistics at Kwame Nkrumah University of Science and Technology in Ghana.</p><p>Leadership and community engagement have also been important parts of her journey. She served as Vice President of the University of Ghana Nursing and Midwifery Students' Association (UGHANMSA), contributing to student leadership and representation. She currently serves as a Student Ambassador at the Liverpool School of Tropical Medicine and has participated in community initiatives focused on blood and organ donation, climate and health, and mental health awareness.</p><p>Christabel is committed to coordinating programmes that connect young people with mentorship, practical skills, career guidance, and opportunities for personal and professional growth.</p>`,
  },
  {
    slug: "hollandswell-donkor",
    fullName: "Hollandswell Donkor",
    role: "Brands & Marketing Lead",
    displayOrder: 5,
    profileImage: "/images/team/hollandswell-donkor.jpg",
    linkedinUrl: "https://www.linkedin.com/in/hollandswell-donkoh-934333281",
    email: "eduleadnetwork@gmail.com",
    showEmail: false,
    biography: `<p>Hollandswell Donkor is a multiple award-winning Graphic Designer, Brand and Marketing Strategist, and Creative Communications Professional. He holds a BA in Information Studies and History, a Master's in Brand and Communications Management, and certification in Leadership Training.</p><p>Having evolved from a creative designer into a strategic marketing professional, Hollandswell is currently pursuing Chartered Marketing qualifications with CIMG and CIM UK. He has worked with several politicians, organisations, and businesses, helping to strengthen their brands, communicate their vision, and create impactful visual identities.</p><p>Driven by creativity, strategy, and continuous growth, Hollandswell is passionate about building brands that stand out, connect with audiences, and create lasting impact.</p>`,
  },
];
