import type { ReactNode } from 'react';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { IMAGES } from '@/data/images';
import { CONTACT, OPENING_HOURS, PLACEHOLDERS } from '@/data/site';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { ReservationButton } from '@/components/ReservationButton';
import { Ornament } from '@/components/ui/Ornament';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';

export default function Contact() {
  useSeo({
    title: 'Contact',
    description:
      "Adresse, horaires et réservation du restaurant L'Aller Retour — viandes rouges et vins.",
  });

  const hasHours = OPENING_HOURS.some((day) => day.hours || day.closed);

  return (
    <>
      <PageHero
        eyebrow="Nous rendre visite"
        title="Venir à L'Aller Retour"
        image={IMAGES.heroRestaurant}
        size="sm"
      >
        <ReservationButton size="lg">Réserver une table</ReservationButton>
      </PageHero>

      <Section spacing="lg" textured className="bg-noir">
        <div className="u-container relative z-10 grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
          {/* ------------------------ Coordonnées ------------------------ */}
          <div>
            <Reveal>
              <h2 className="eyebrow">Coordonnées</h2>
            </Reveal>

            <dl className="mt-8 space-y-8">
              <Field icon={MapPin} label="Adresse" delay={60}>
                {CONTACT.address.street ? (
                  <address className="not-italic">
                    {CONTACT.address.street}
                    <br />
                    {CONTACT.address.postalCode} {CONTACT.address.city}
                    <br />
                    {CONTACT.address.country}
                  </address>
                ) : (
                  <Missing>{PLACEHOLDERS.address}</Missing>
                )}
              </Field>

              <Field icon={Phone} label="Téléphone" delay={120}>
                {CONTACT.phone ? (
                  <a href={`tel:${CONTACT.phone}`} className="link-quiet hover:text-creme">
                    {CONTACT.phoneDisplay ?? CONTACT.phone}
                  </a>
                ) : (
                  <Missing>{PLACEHOLDERS.phone}</Missing>
                )}
              </Field>

              <Field icon={Mail} label="E-mail" delay={180}>
                {CONTACT.email ? (
                  <a href={`mailto:${CONTACT.email}`} className="link-quiet hover:text-creme">
                    {CONTACT.email}
                  </a>
                ) : (
                  <Missing>{PLACEHOLDERS.email}</Missing>
                )}
              </Field>

              <Field icon={Clock} label="Horaires" delay={240}>
                {hasHours ? (
                  <ul className="space-y-1.5">
                    {OPENING_HOURS.map((day) => (
                      <li key={day.day} className="flex items-baseline gap-3">
                        <span className="w-24 shrink-0 text-sable">{day.day}</span>
                        <span className="text-ivoire">
                          {day.closed ? 'Fermé' : (day.hours ?? '—')}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Missing>{PLACEHOLDERS.hours}</Missing>
                )}
              </Field>
            </dl>

            <Reveal delay={300}>
              <Ornament className="my-10" />
              <p className="text-sm leading-relaxed text-sable">
                Pour réserver une table, une seule adresse : le bouton ci-dessous.
              </p>
              <div className="mt-6">
                <ReservationButton>Réserver une table</ReservationButton>
              </div>
            </Reveal>
          </div>

          {/* --------------------------- Plan --------------------------- */}
          <Reveal variant="right" delay={140}>
            <h2 className="eyebrow">Le plan</h2>
            <div className="mt-8 aspect-[4/3] w-full border border-or/18 lg:aspect-[4/5]">
              {CONTACT.mapEmbedUrl ? (
                <iframe
                  src={CONTACT.mapEmbedUrl}
                  title="Plan d'accès au restaurant L'Aller Retour"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full grayscale-[35%]"
                />
              ) : (
                /* TODO — Renseigner `CONTACT.mapEmbedUrl` dans `src/data/site.ts`
                   pour afficher la carte Google Maps du restaurant. */
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-charbon/50 px-6 text-center">
                  <MapPin size={24} strokeWidth={1} aria-hidden="true" className="text-or/60" />
                  <p className="font-sans text-xs tracking-[0.22em] text-cendre uppercase">
                    {PLACEHOLDERS.map}
                  </p>
                  <p className="max-w-xs text-xs leading-relaxed text-cendre">
                    Le plan s'affichera ici dès que l'adresse du restaurant sera renseignée.
                  </p>
                </div>
              )}
            </div>

            {CONTACT.mapDirectionsUrl && (
              <a
                href={CONTACT.mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-quiet mt-5 inline-block font-sans text-[0.6875rem] tracking-[0.2em] text-or uppercase hover:text-or-clair"
              >
                Itinéraire
              </a>
            )}
          </Reveal>
        </div>
      </Section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

interface FieldProps {
  icon: typeof MapPin;
  label: string;
  children: ReactNode;
  delay: number;
}

function Field({ icon: Icon, label, children, delay }: FieldProps) {
  return (
    <Reveal delay={delay} className="border-t border-or/10 pt-6">
      <dt className="flex items-center gap-3">
        <Icon size={15} strokeWidth={1.3} aria-hidden="true" className="text-or/70" />
        <span className="font-sans text-[0.6875rem] font-medium tracking-[0.22em] text-ivoire uppercase">
          {label}
        </span>
      </dt>
      <dd className="mt-3 pl-6 text-[0.9375rem] leading-relaxed text-ivoire/85">{children}</dd>
    </Reveal>
  );
}

/** Information non communiquée — affichée telle quelle, jamais remplacée par une invention. */
function Missing({ children }: { children: ReactNode }) {
  return <span className="text-cendre">{children}</span>;
}
