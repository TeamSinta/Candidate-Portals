/**
 * This file contains the features data for the features page.
 *
 * @add a new feature, add a new object to the `features` array.
 * 1. Add id to the features object then use it as the id of the new feature object.
 * 2. Add title and inludedIn to the new feature object. (inludedIn is an array of pricing plan ids that include this feature)
 * 3. Add description to the new feature object.
 * 4. Add image to the new feature object.
 * 5. Add imageDark to the new feature object. (optional)
 */

export type Feature = {
    title: string;
    description: string;
    image: string;
    imageDark?: string;
};


export const features: Feature[] = [
  {
      title: "Personalized Candidate Portals",
      description:
          "Easily create tailored portals for every candidate. Embed job details, interview schedules, and onboarding documents to provide a seamless candidate experience.",
      image: "https://utfs.io/f/NyiNiWCHmEc4Y6J2Iqw1A7r2hZy65zd4Is9XVeG0SaHcltxY",
      imageDark:
          "https://utfs.io/f/NyiNiWCHmEc4Y6J2Iqw1A7r2hZy65zd4Is9XVeG0SaHcltxY",
  },
  {
      title: "Engagement Tracking",
      description:
          "Monitor how candidates interact with your portal. Track views, clicks, and time spent to measure engagement and adjust your strategy.",
      image: "https://utfs.io/f/NyiNiWCHmEc4qXySzcTpZIDGdHSjMJoVy182UetvsT6baQ9u",
      imageDark:
          "https://utfs.io/f/NyiNiWCHmEc4BfCLYM5LzSmdU0E2ntbsy4KfquR31DiJCkcT",
  },
  {
    title: "Effortless Content Management",
    description:
        "Create beautiful candidate portals in minutes by adding links, embedding docs, uploading PDFs, or crafting content directly in our intuitive markdown editor. No technical skills required.",
    image: "https://utfs.io/f/NyiNiWCHmEc4MJaC77uXjCc2YNSxlTnFMIE6Jdr5wVopPa7W",
    imageDark:
        "https://utfs.io/f/NyiNiWCHmEc4VxnWQar5Ro809z7LvWTFwgdOPhsrkfqeEa3b",
},
{
  title: "Effortless Collaboration",
  description:
      "Work together seamlessly by creating shared spaces for candidates and colleagues. Share updates, notes, and actions directly within portals, making teamwork and alignment easier than ever.",
  image: "https://utfs.io/f/72a2c035-69e0-46ca-84a8-446e4dabf77c-3koi6e.png",
  imageDark:
      "https://utfs.io/f/72a2c035-69e0-46ca-84a8-446e4dabf77c-3koi6e.png",
},

]
