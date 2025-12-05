import { Metadata } from "next";
import { EnquiryForm } from "@/components/EnquiryForm";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Business Enquiries | Foxy's Lab",
  description:
    "Get in touch with Foxy's Lab for product reviews, sponsorships, collaborations, and business partnerships.",
};

export default function EnquiriesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Business <span className="gradient-text">Enquiries</span>
        </h1>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Interested in working together? I&apos;m always open to discussing
          partnerships, collaborations, and opportunities that benefit the smart
          home community.
        </p>
      </div>

      {/* Partnership Types */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Ways We Can Work Together</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-secondary/50 border border-primary/20 rounded-xl p-6">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-primary">
              Product Reviews
            </h3>
            <p className="text-white/70 text-sm">
              Send me smart home devices, sensors, or automation hardware for
              honest, in-depth reviews. Software and service access is also
              welcome.
            </p>
          </div>

          <div className="bg-secondary/50 border border-primary/20 rounded-xl p-6">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-primary">Sponsorships</h3>
            <p className="text-white/70 text-sm">
              Sponsor a video or series to reach an engaged audience of smart
              home enthusiasts and tech-savvy viewers.
            </p>
          </div>

          <div className="bg-secondary/50 border border-primary/20 rounded-xl p-6">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-primary">
              Collaborations
            </h3>
            <p className="text-white/70 text-sm">
              Partner on content, cross-promotions, or joint projects that bring
              value to both our audiences.
            </p>
          </div>

          <div className="bg-secondary/50 border border-primary/20 rounded-xl p-6">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-primary">
              Media & Press
            </h3>
            <p className="text-white/70 text-sm">
              Press enquiries, interviews, and media opportunities related to
              smart home technology and content creation.
            </p>
          </div>
        </div>
      </section>

      {/* Product Review Guidelines */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Product Review Guidelines</h2>
        <div className="bg-secondary/50 border border-primary/20 rounded-xl p-8">
          <p className="text-white/80 mb-6">
            I love testing new smart home and homelab tech. Cameras, sensors,
            servers, dashboards, Home Assistant gear, Zigbee and Matter devices,
            plus the software and services that tie it all together. If
            you&apos;re building something that solves a real problem (or is at least a ton of fun), I want
            to try it!
          </p>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-white/70">
                <strong className="text-white">Honest Reviews:</strong> Reviews
                on Foxy&apos;s Lab are always honest. If something impresses me,
                I&apos;ll show you why. If something annoys me or falls short,
                I&apos;ll talk about that too. Long term reliability matters
                more than launch day sparkle.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-white/70">
                <strong className="text-white">Real-World Testing:</strong>{" "}
                Everything gets used in my actual home for real world testing.
                Support for open protocols like MQTT, local control, proper Home
                Assistant integration and decent longevity are big wins for me.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-white/70">
                <strong className="text-white">No Guaranteed Coverage:</strong>{" "}
                Sending a product or providing a licence does not guarantee
                coverage. If it doesn&apos;t fit the channel or I cannot
                recommend it to my audience, it will not appear. Sponsorships
                and affiliate partnerships are welcome when they make sense, and
                they will always be disclosed clearly.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-green-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-white/70">
                <strong className="text-white">Long-Term Testing:</strong>{" "}
                Review hardware is normally kept for long term testing so I can
                follow up on updates and reliability. If a product must be
                returned, that needs to be agreed up front because limited
                testing time can affect the depth and final verdict of the
                review.
              </p>
            </div>
          </div>

          {/* Cloud-Only Disclaimer */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <p className="font-semibold text-yellow-400 mb-1">
                  A Note on Cloud-Only Products
                </p>
                <p className="text-white/70 text-sm">
                  Purely cloud locked devices are treated with caution because
                  companies can flip a switch and ruin a product overnight. I
                  will look at cloud focused tools if the cloud genuinely
                  provides unique value such as AI processing or features that
                  cannot exist locally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Response Time Notice */}
      <section className="mb-12">
        <div className="bg-secondary/30 border border-white/10 rounded-lg p-4 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-primary mt-0.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-white/60 text-sm">
            <strong className="text-white/80">Response Time:</strong> I try to
            respond to all genuine enquiries within 5-7 business days. Due to
            the volume of messages I receive, I may not be able to respond to
            every request, particularly unsolicited pitches that don&apos;t
            align with my content focus.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
        <div className="bg-secondary/50 border border-primary/20 rounded-xl p-8">
          <EnquiryForm />
        </div>
      </section>

      {/* Alternative Contact */}
      <section className="mt-12 text-center">
        <p className="text-white/60 text-sm mb-4">
          Prefer to reach out on social media?
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={siteConfig.social.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-primary/30 text-primary rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors"
          >
            X (Twitter)
          </a>
          <a
            href={siteConfig.social.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-primary/30 text-primary rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors"
          >
            Discord
          </a>
        </div>
      </section>
    </div>
  );
}
