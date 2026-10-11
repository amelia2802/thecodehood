// Verified community directory source of truth for grounding AI matchmaker
// Matches the approved listings in src/data.js

export const VERIFIED_COMMUNITIES = [
  {
    name: "Boston React & Frontend Collective",
    city: "Boston",
    state: "MA",
    postal_code: "02210",
    technologies: ["React", "JavaScript", "career development"],
    format: "in_person",
    description: "A community for developers passionate about React, Next.js, and modern JavaScript, meeting for workshops, lightning talks, and networking.",
    website_url: "https://example.com/boston-react"
  },
  {
    name: "Randstad Digital | Torc",
    city: "Boston",
    state: "MA",
    postal_code: "02210",
    technologies: ["career development", "JavaScript", "Python"],
    format: "hybrid",
    description: "Torc.dev is a community-first talent platform that matches tech professionals directly with Fortune 500 job opportunities using verified skills.",
    website_url: "https://discord.com/invite/E3NXKRjErh"
  },
  {
    name: "Women Coders Network",
    city: "Los Angeles",
    state: "CA",
    postal_code: "90012",
    technologies: ["career development", "JavaScript", "React", "open source"],
    format: "online",
    description: "A global community dedicated to uniting, supporting, and empowering women and gender minorities in the technology sector.",
    website_url: "https://discord.com/invite/YpaJ3JckNM"
  },
  {
    name: "SoCal Python & Machine Learning Guild",
    city: "Los Angeles",
    state: "CA",
    postal_code: "90012",
    technologies: ["Python", "AI/ML", "open source"],
    format: "in_person",
    description: "A vibrant group of data scientists, software engineers, and Python hobbyists exploring deep learning, automation, and AI workflows.",
    website_url: "https://example.com/socal-python"
  },
  {
    name: "NYC Java User Group",
    city: "New York",
    state: "NY",
    postal_code: "10001",
    technologies: ["Java", "open source", "career development"],
    format: "hybrid",
    description: "Connecting enterprise and backend engineers across the tri-state area. Discussions cover Java 21+, Spring Boot, JVM performance, and microservices.",
    website_url: "https://example.com/nyc-jug"
  },
  {
    name: "Austin AI Innovators",
    city: "Austin",
    state: "TX",
    postal_code: "78701",
    technologies: ["AI/ML", "Python"],
    format: "in_person",
    description: "Exploring frontier foundation models, LLM agents, and open-source AI tooling through hackathons, show-and-tells, and tech discussions.",
    website_url: "https://example.com/austin-ai"
  },
  {
    name: "Seattle Open Source Collective",
    city: "Seattle",
    state: "WA",
    postal_code: "98101",
    technologies: ["open source", "JavaScript", "React", "Python"],
    format: "hybrid",
    description: "Dedicated to building, maintaining, and contributing to open-source software across JavaScript, React, Python, and cloud infrastructure.",
    website_url: "https://example.com/seattle-oss"
  },
  {
    name: "Global Cloud Java & Spring Community",
    city: "",
    state: "",
    postal_code: "",
    technologies: ["Java", "open source"],
    format: "online",
    description: "An inclusive worldwide online community sharing architectural patterns, Spring Boot best practices, and enterprise Java tips.",
    website_url: "https://example.com/cloud-java"
  }
];

export function findMatchingDirectoryCommunities(interest = '', location = '') {
  const normInterest = (interest || '').toLowerCase();
  const normLoc = (location || '').toLowerCase();

  return VERIFIED_COMMUNITIES.filter(comm => {
    let matchInterest = false;
    if (normInterest) {
      matchInterest = comm.technologies.some(t => t.toLowerCase().includes(normInterest) || normInterest.includes(t.toLowerCase())) ||
        comm.name.toLowerCase().includes(normInterest) ||
        comm.description.toLowerCase().includes(normInterest);
    }

    let matchLoc = false;
    if (normLoc) {
      matchLoc = (comm.city && comm.city.toLowerCase().includes(normLoc)) ||
        (comm.state && comm.state.toLowerCase().includes(normLoc)) ||
        (comm.postal_code && comm.postal_code.includes(normLoc));
    }

    return matchInterest || matchLoc;
  });
}
