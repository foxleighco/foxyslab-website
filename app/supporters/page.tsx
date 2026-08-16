import { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { supportOptions } from "@/lib/support";
import { siteConfig } from "@/site.config";
import styles from "./styles.module.css";

const title = "Memberships and Support | Foxy's Lab";
const description =
  "The ways you can support Foxy's Lab — a one-off tip on Ko-fi, a YouTube channel membership, or a Patreon tier — and exactly what you get from each.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/supporters",
});

/** Tick used in perk lists. Decorative — the list itself carries the meaning. */
function PerkIcon() {
  return (
    <svg
      className={styles.perkIcon}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.2 7.3a1 1 0 0 1-1.42.006l-3.8-3.75a1 1 0 1 1 1.406-1.424l3.089 3.049 6.494-6.585a1 1 0 0 1 1.425-.01z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function SupportersPage() {
  return (
    <div className={`container ${styles.page}`}>
      <PageHeader
        title={
          <>
            Memberships and <span className="gradient-text">Support</span>
          </>
        }
        subtitle="Three ways to back the channel, and exactly what each one gets you"
      />

      {/* Intro */}
      <section className={styles.intro}>
        <p className={styles.introLead}>
          Everything here is free, and it&apos;s staying that way.
        </p>
        <p>
          Support just lets me be more ambitious with it: bigger builds, kit
          I&apos;d otherwise never get near, and the room to do a job properly
          instead of quickly. If the channel&apos;s been useful to you and you
          fancy chipping in, here&apos;s what&apos;s on offer and what each one
          gets you. Thanks to everyone who already has — some of the bigger
          projects only happen because of you.
        </p>
      </section>

      <p className={styles.priceDisclaimer}>
        All prices on this page are in <strong>GBP</strong>. What you actually
        pay depends on where you are — currency conversion, local taxes and
        regional pricing all vary, so check the figure on Ko-fi, YouTube or
        Patreon before you commit to anything.
      </p>

      {/* Support options */}
      {supportOptions.map((option) => (
        <section
          key={option.id}
          className={styles.option}
          aria-labelledby={`${option.id}-heading`}
        >
          <div className={styles.optionHeader}>
            <div>
              <span className={styles.kind}>{option.kind}</span>
              <h2 id={`${option.id}-heading`} className={styles.optionTitle}>
                {option.name}
              </h2>
              <p className={styles.optionHeadline}>{option.headline}</p>
            </div>
            <a
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-primary ${styles.optionCta}`}
            >
              {option.ctaLabel}
            </a>
          </div>

          <p className={styles.optionSummary}>{option.summary}</p>

          {option.body?.map((paragraph, i) => (
            <p key={`${option.id}-body-${i}`} className={styles.optionBody}>
              {paragraph}
            </p>
          ))}

          {/* Flat perk list, for options without tiers */}
          {option.perks && option.perks.length > 0 && (
            <>
              <h3 className={styles.perksTitle}>What you get</h3>
              <ul className={styles.perks}>
                {option.perks.map((perk) => (
                  <li key={perk} className={styles.perk}>
                    <PerkIcon />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          {option.perksNote && (
            <p className={styles.perksNote}>{option.perksNote}</p>
          )}

          {/* Tiered options */}
          {option.tiers && option.tiers.length > 0 && (
            <>
              <div className={styles.tiers}>
                {option.tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`${styles.tier} ${tier.popular ? styles.tierPopular : ""}`}
                  >
                    {tier.popular && (
                      <span className={styles.popularBadge}>Most popular</span>
                    )}
                    <h3 className={styles.tierName}>{tier.name}</h3>
                    {/* Not every tier has a headline price worth showing */}
                    {tier.price && (
                      <p className={styles.tierPrice}>
                        <span className={styles.tierAmount}>{tier.price}</span>
                        {tier.cadence && (
                          <span className={styles.tierCadence}>
                            {tier.cadence}
                          </span>
                        )}
                      </p>
                    )}
                    <p className={styles.tierSummary}>{tier.summary}</p>
                    {tier.perks && tier.perks.length > 0 && (
                      <ul className={styles.perks}>
                        {tier.perks.map((perk) => (
                          <li key={perk} className={styles.perk}>
                            <PerkIcon />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
              {option.tiersNote && (
                <p className={styles.perksNote}>{option.tiersNote}</p>
              )}
            </>
          )}
        </section>
      ))}

      {/* Free ways to help */}
      <section className={styles.closing}>
        <h2 className={styles.closingTitle}>Not in a position to chip in?</h2>
        <p>
          That&apos;s completely fine, and it always will be. Watching to the
          end, leaving a comment, and passing a video on to someone who&apos;d
          find it useful all genuinely help — the algorithm pays attention to
          that sort of thing far more than it pays attention to me.
        </p>
        <p className={styles.closingShop}>
          There&apos;s also{" "}
          <a
            href={siteConfig.social.shop}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.inlineLink}
          >
            the shop
          </a>
          , if you&apos;d rather get something for your money. That&apos;s more
          buying a thing you want than supporting the channel, but it does help
          all the same.
        </p>
      </section>
    </div>
  );
}
