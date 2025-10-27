import { Metadata } from "next";
import Image from "next/image";
import { Newsletter } from "@/components/Newsletter";

export const metadata: Metadata = {
  title: "About | Foxy's Lab",
  description: "Learn more about Foxy's Lab and our mission to make smart home technology accessible to everyone.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="mb-8 flex justify-center">
          <div className="relative w-32 h-32">
            <Image
              src="/images/foxys-lab-logo-round.png"
              alt="Foxy's Lab"
              fill
              className="rounded-full object-cover ring-4 ring-primary/50"
            />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About <span className="gradient-text">Foxy&apos;s Lab</span>
        </h1>
        <p className="text-xl text-white/70">
          Making smart home technology accessible to everyone
        </p>
      </div>

      {/* Mission */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-white/80 leading-relaxed mb-4">
            At Foxy&apos;s Lab, we believe that smart home technology should be accessible,
            understandable, and fun for everyone. Whether you&apos;re just getting started
            with your first smart bulb or building complex home automation systems,
            we&apos;re here to guide you every step of the way.
          </p>
          <p className="text-lg text-white/80 leading-relaxed">
            Our goal is to demystify smart home technology through clear, practical
            tutorials that you can follow along with. We focus on real-world applications,
            security best practices, and helping you make informed decisions about the
            technology you bring into your home.
          </p>
        </div>
      </section>

      {/* What We Cover */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">What We Cover</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-secondary/50 border border-primary/20 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-primary">Smart Home Platforms</h3>
            <p className="text-white/70">
              Home Assistant, SmartThings, Google Home, Amazon Alexa, and more.
            </p>
          </div>
          <div className="bg-secondary/50 border border-primary/20 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-primary">Device Reviews</h3>
            <p className="text-white/70">
              Honest reviews of smart devices, sensors, and automation hardware.
            </p>
          </div>
          <div className="bg-secondary/50 border border-primary/20 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-primary">Automation Tutorials</h3>
            <p className="text-white/70">
              Step-by-step guides for creating useful automations and integrations.
            </p>
          </div>
          <div className="bg-secondary/50 border border-primary/20 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-primary">Security & Privacy</h3>
            <p className="text-white/70">
              Best practices for keeping your smart home secure and private.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">50K+</div>
            <div className="text-white/60">Subscribers</div>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">150+</div>
            <div className="text-white/60">Videos</div>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">2M+</div>
            <div className="text-white/60">Views</div>
          </div>
          <div>
            <div className="text-4xl font-bold gradient-text mb-2">100%</div>
            <div className="text-white/60">Passion</div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
        <div className="bg-secondary/50 border border-primary/20 rounded-xl p-8">
          <p className="text-lg text-white/80 mb-6">
            We&apos;re more than just a YouTube channel - we&apos;re a community of smart
            home enthusiasts sharing knowledge, troubleshooting together, and pushing
            the boundaries of home automation.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://www.youtube.com/@foxyslab"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 gradient-primary rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Subscribe on YouTube
            </a>
            <a
              href="https://twitter.com/foxyslab"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              Follow on Twitter
            </a>
            <a
              href="https://github.com/foxleigh81"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section>
        <Newsletter />
      </section>
    </div>
  );
}
