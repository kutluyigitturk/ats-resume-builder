// Sample CV data used in template previews when user has no data yet

const sampleCV = {
  name: "John Doe",
  title: "Software Engineer",
  phone: "+1 408 555 0192",
  email: "johndoe@gmail.com",
  location: "Cupertino, CA",
  linkedin: "linkedin.com/in/johndoe",
  website: "johndoe.dev",
  summary:
    "Software Engineer with a strong foundation in computer science from MIT and hands-on experience at Google and Apple. Skilled in building high-performance, user-facing applications across iOS and web platforms. Passionate about creating elegant solutions to complex engineering problems, with expertise spanning mobile development, distributed systems, and machine learning.",

  experiences: [
    {
      id: "sample-exp-1",
      company: "Apple",
      position: "Software Engineer",
      location: "Cupertino, CA",
      startDate: "07/2023",
      endDate: "Present",
      bullets: [
        "Developed and shipped core features for iOS system applications used by 1B+ devices worldwide, collaborating with cross-functional teams of designers, PMs, and engineers.",
        "Architected a new SwiftUI-based module that reduced UI rendering time by 35%, improving user experience across iPhone and iPad platforms.",
        "Designed and implemented RESTful APIs and backend services using Python and AWS, supporting real-time data synchronization for iCloud-connected features.",
        "Led performance optimization efforts using Instruments and XCTest, reducing app launch time by 20% and memory footprint by 15%.",
      ],
    },
    {
      id: "sample-exp-2",
      company: "Google",
      position: "Software Engineering Intern",
      location: "Mountain View, CA",
      startDate: "06/2022",
      endDate: "09/2022",
      bullets: [
        "Built an internal analytics dashboard using React and Python Flask, enabling product teams to visualize A/B test results 3x faster.",
        "Implemented data pipeline optimizations on Google Cloud Platform, reducing BigQuery processing costs by 25% for a high-traffic service.",
        "Collaborated with senior engineers to design and test a new caching layer for a microservices architecture serving 50M+ daily requests.",
      ],
    },
  ],

  education: [
    {
      id: "sample-edu-1",
      degree: "B.Sc. in Electrical Engineering and Computer Science",
      school: "Massachusetts Institute of Technology (MIT)",
      location: "Cambridge, MA",
      startDate: "09/2019",
      endDate: "06/2023",
      additionalInfo: "GPA: 4.8/5.0 — Dean's List, MIT Undergraduate Research Opportunities Program (UROP)",
    },
  ],

  skills: [
    { id: "sample-skill-1", category: "Languages", items: "Python, C++, Swift, Java, JavaScript, SQL" },
    { id: "sample-skill-2", category: "Frameworks", items: "React, Node.js, SwiftUI, UIKit, TensorFlow" },
    { id: "sample-skill-3", category: "Infrastructure & Cloud", items: "AWS, GCP, Docker, Kubernetes, CI/CD Pipelines" },
    { id: "sample-skill-4", category: "Tools & Methodology", items: "Git, Xcode, Jira, Agile/Scrum, Unit Testing" },
  ],

  projects: [],
  volunteering: [],
  certifications: [],
  languages: [],
  references: [],
};

export default sampleCV;