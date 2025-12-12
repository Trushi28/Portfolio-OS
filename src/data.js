export const SYSTEM_DATA = {
  bootSequence: [], // Handled by App.jsx now
  apps: [
    {
      id: "about", // <--- THIS MUST BE 'about' FOR NEOFETCH TO WORK
      title: "user_profile",
      icon: "user",
      content: "" // Content is handled by the Neofetch component automatically
    },
    {
      id: "projects",
      title: "projects_mnt",
      icon: "folder",
      content: `
# 🏗️ ACTIVE PROTOCOLS

1. [NEXUS KERNEL]
   > Status: Online
   > Stack: React, Tailwind v4, Canvas API
   > Logic: Simulating an OS in DOM.

2. [AI_SENTRY]
   > Status: Deployed (Local)
   > Core: Llama 2 Quantized
   > Mission: Privacy-focused learning assistant.

3. [BLOOD_LINK]
   > Status: Archived
   > Type: Full Stack Emergency Response.
      `
    },
    {
      id: "terminal",
      title: "bash",
      icon: "terminal",
      content: "Access Denied: Admin privileges required."
    }
  ]
};