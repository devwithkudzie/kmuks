// Client testimonials shown in "What clients say" on the homepage.
//
// How to update:
//   - Use the client's own words, with their permission to publish them.
//   - Set `published: true` once the quote is final — unpublished entries never show.
//   - The section is hidden entirely while nothing is published.
//   - `logo` is optional: put the file in public/clients/ and use e.g. "/clients/victor-holdings.png".

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  logo?: string;
  published: boolean;
};

export const testimonials: Testimonial[] = [
  {
    company: "Victors Holdings",
    // TODO: paste the quote Victors Holdings approved, then set published: true.
    quote: "",
    name: "",
    role: "",
    published: false,
  },
];
