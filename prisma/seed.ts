import { PrismaClient, PageKey, ProgrammeStatus, ProgrammeCategory, ArticleStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding EduLead Network database...");

  // Site Settings
  const existingSettings = await prisma.siteSetting.findFirst();
  if (!existingSettings) {
    await prisma.siteSetting.create({
      data: {
        organisationName: "EduLead Network",
        tagline: "Education for Leadership and Change",
        logoUrl: "/logo.jpeg",
        defaultSeoTitle: "EduLead Network | Education for Leadership and Change",
        defaultSeoDescription:
          "EduLead Network bridges the gap between education and leadership by equipping young people with mentorship, policy exposure, and career guidance.",
        footerText:
          "EduLead Network exists to bridge the gap between education and leadership by providing structured mentorship, policy exposure, and career development support to young people.",
      },
    });
  }

  // Announcement Bar
  await prisma.pageContent.upsert({
    where: { pageKey_sectionKey: { pageKey: PageKey.ANNOUNCEMENT, sectionKey: "main" } },
    update: {},
    create: {
      pageKey: PageKey.ANNOUNCEMENT,
      sectionKey: "main",
      heading: "Join our growing leadership community — applications opening soon",
      buttonUrl: "/join",
      visible: true,
      published: true,
    },
  });

  // Homepage sections
  const homeSections = [
    {
      sectionKey: "hero",
      heading: "Preparing Young Leaders to Shape Policy, Governance and Society.",
      body: "EduLead Network bridges the gap between education and leadership by equipping young people with mentorship, policy exposure, career guidance and the confidence to lead.",
    },
    {
      sectionKey: "why-edulead",
      heading: "Education Should Prepare Young People to Lead.",
      body: "Across many countries, a persistent gap exists between education and leadership readiness. Students gain academic qualifications but often lack structured pathways into policy, governance, and high-impact careers.",
    },
    {
      sectionKey: "vision-mission",
      metadata: {
        vision:
          "To develop a generation of young leaders who are equipped with skills, confidence, and networks to shape policy, governance, and societal transformation.",
        mission:
          "EduLead Network exists to bridge the gap between education and leadership by providing structured mentorship, policy exposure, and career development support to young people transitioning from education into public service, governance, and impact-driven careers.",
      },
    },
  ];

  for (const [i, section] of homeSections.entries()) {
    await prisma.pageContent.upsert({
      where: { pageKey_sectionKey: { pageKey: PageKey.HOME, sectionKey: section.sectionKey } },
      update: {},
      create: {
        pageKey: PageKey.HOME,
        sortOrder: i,
        published: true,
        visible: true,
        ...section,
      },
    });
  }

  // Founder message — CMS draft only; hidden until verified founder details are added in admin
  await prisma.pageContent.upsert({
    where: { pageKey_sectionKey: { pageKey: PageKey.HOME, sectionKey: "founder-message" } },
    update: {
      visible: false,
      published: false,
      requiresConfirmation: true,
    },
    create: {
      pageKey: PageKey.HOME,
      sectionKey: "founder-message",
      sortOrder: homeSections.length,
      heading: null,
      subheading: null,
      body: "Draft founder message — add verified founder details in the admin dashboard before publishing this section.",
      visible: false,
      published: false,
      requiresConfirmation: true,
    },
  });

  // About page sections
  const aboutSections = [
    {
      sectionKey: "story",
      heading: "Our Story",
      body: "EduLead Network is a newly established organisation founded on the belief that education must go beyond certification. We are being built to actively prepare young people to lead, govern, and transform society — connecting academic achievement with practical leadership readiness.",
    },
    {
      sectionKey: "objectives",
      heading: "Our Objectives",
      body: "EduLead Network seeks to strengthen the leadership and civic capacity of young people through structured mentorship and training, support access to scholarships and fellowships, and equip students with practical skills in policy writing, research, public speaking, and critical thinking.",
    },
    {
      sectionKey: "approach",
      heading: "Our Approach",
      body: "We operate through a hybrid model combining online and in-person engagement — mentorship and coaching, policy and leadership training, youth policy dialogue series, and career guidance support.",
    },
  ];

  for (const [i, section] of aboutSections.entries()) {
    await prisma.pageContent.upsert({
      where: { pageKey_sectionKey: { pageKey: PageKey.ABOUT, sectionKey: section.sectionKey } },
      update: {},
      create: {
        pageKey: PageKey.ABOUT,
        sortOrder: i,
        published: true,
        visible: true,
        ...section,
      },
    });
  }

  // Core values as page content
  const coreValues = [
    "Leadership", "Integrity", "Service", "Excellence", "Inclusion", "Civic Responsibility", "Lifelong Learning",
  ];
  await prisma.pageContent.upsert({
    where: { pageKey_sectionKey: { pageKey: PageKey.ABOUT, sectionKey: "core-values" } },
    update: {},
    create: {
      pageKey: PageKey.ABOUT,
      sectionKey: "core-values",
      heading: "Core Values",
      metadata: { values: coreValues },
      published: true,
      visible: true,
    },
  });

  // Article categories
  const categories = [
    "Leadership", "Public Policy", "Governance", "Scholarships",
    "Career Development", "Civic Engagement", "Communication", "Research",
  ];

  for (const [i, name] of categories.entries()) {
    await prisma.articleCategory.upsert({
      where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        sortOrder: i,
      },
    });
  }

  // Sample planned programme
  await prisma.programme.upsert({
    where: { slug: "youth-leadership-mentorship-programme" },
    update: {},
    create: {
      title: "Youth Leadership Mentorship Programme",
      slug: "youth-leadership-mentorship-programme",
      excerpt:
        "A structured mentorship programme connecting young people with experienced leaders in policy, governance, and public service.",
      description:
        "<p>EduLead Network is developing a comprehensive mentorship programme designed to guide young people through their leadership journey. Participants will be matched with mentors who provide career guidance, leadership coaching, and support navigating opportunities in public service and governance.</p><h2>Programme Objectives</h2><ul><li>Connect young people with experienced mentors</li><li>Provide structured career guidance and leadership coaching</li><li>Support navigation of policy and governance career pathways</li></ul>",
      category: ProgrammeCategory.MENTORSHIP_COACHING,
      format: "Hybrid (Online & In-person)",
      targetAudience: "University students and young professionals",
      status: ProgrammeStatus.PLANNED,
      featured: true,
      published: true,
      interestFormEnabled: true,
      objectives: "Connect young people with mentors and provide structured leadership development support.",
      expectations: "Regular mentorship sessions, career guidance workshops, and access to leadership resources.",
      whoIsItFor: "University students, graduates, and young professionals interested in policy and governance careers.",
    },
  });

  await prisma.programme.upsert({
    where: { slug: "youth-policy-dialogue-series" },
    update: {},
    create: {
      title: "Youth Policy Dialogue Series",
      slug: "youth-policy-dialogue-series",
      excerpt:
        "Conversations with policymakers, academics, and development practitioners on education, governance, and youth inclusion.",
      description:
        "<p>The Youth Policy Dialogue Series will bring together young people and experienced practitioners for meaningful conversations about policy, governance, and societal transformation.</p>",
      category: ProgrammeCategory.YOUTH_POLICY_DIALOGUE,
      format: "Virtual and In-person Forums",
      targetAudience: "Senior high school to young professional",
      status: ProgrammeStatus.COMING_SOON,
      featured: true,
      published: true,
      interestFormEnabled: true,
    },
  });

  // Sample article
  await prisma.article.upsert({
    where: { slug: "bridging-the-leadership-readiness-gap" },
    update: {},
    create: {
      title: "Bridging the Leadership Readiness Gap",
      slug: "bridging-the-leadership-readiness-gap",
      excerpt:
        "Why education alone is not enough to prepare young people for leadership in policy, governance, and public service.",
      content:
        "<p>Across many African countries, thousands of young people graduate each year with strong academic qualifications. Yet a significant proportion lack structured pathways into policy, governance, civic leadership, and high-impact professional careers.</p><p>This gap is not merely academic — it is systemic. Students are often equipped with theoretical knowledge but have limited exposure to real-world policy thinking, governance structures, and career navigation strategies.</p><h2>What EduLead Network Is Building</h2><p>EduLead Network is being created as a structured response to this critical gap. Our goal is to ensure that learning is directly connected to leadership, governance, and societal impact.</p>",
      authorName: "EduLead Network",
      categoryLabel: "Leadership",
      readingTime: 4,
      status: ArticleStatus.PUBLISHED,
      featured: true,
      publishedAt: new Date(),
    },
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
