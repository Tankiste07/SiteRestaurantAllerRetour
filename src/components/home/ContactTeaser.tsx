import type { ReactNode } from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';
import { CONTACT, OPENING_HOURS, PLACEHOLDERS } from '@/data/site';
import { ReservationButton } from '../ReservationButton';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { SectionTitle } from '../ui/SectionTitle';

/**
 * Bloc pratique de fin de page d'accueil.
 * Les informations non communiquées restent des emplacements réservés :
 * ni adresse, ni téléphone, ni horaires ne sont inventés.
 */
export function ContactTeaser() {
  const knownHours = OPENING_HOURS.filter((day) => day.hours);

  return (
    <Section id="venir" spacing="lg" textured className="bg-noir">
      <div className="u-container relative z-10">
        <SectionTitle
          eyebrow="Nous rendre visite"
          title="Venir à L'Aller Retour"
          size="lg"
          align="center"
        />

        <div className="mx-auto mt-14 grid max-w-4xl gap-px border border-or/12 bg-or/12 sm:grid-cols-3">
          <InfoCell icon={MapPin} label="Adresse" delay={0}>
            {CONTACT.address.street ? (
              <>
                {CONTACT.address.street}
                <br />
                {CONTACT.address.postalCode} {CONTACT.address.city}
              </>
            ) : (
              <span className="text-cendre">{PLACEHOLDERS.address}</span>
            )}
          </InfoCell>

          <InfoCell icon={Phone} label="Téléphone" delay={110}>
            {CONTACT.phone ? (
              <a href={`tel:${CONTACT.phone}`} className="link-quiet hover:text-creme">
                {CONTACT.phoneDisplay ?? CONTACT.phone}
              </a>
            ) : (
              <span className="text-cendre">{PLACEHOLDERS.phone}</span>
            )}
          </InfoCell>

          <InfoCell icon={Clock} label="Horaires" delay={220}>
            {knownHours.length > 0 ? (
              <span className="flex flex-col gap-1">
                {knownHours.map((day) => (
                  <span key={day.day}>
                    {day.day} · {day.hours}
                  </span>
                ))}
              </span>
            ) : (
              <span className="text-cendre">{PLACEHOLDERS.hours}</span>
            )}
          </InfoCell>
        </div>

        <Reveal delay={280}>
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <ReservationButton size="lg">Réserver une table</ReservationButton>
            <Button to="/contact" variant="outline" size="lg">
              Toutes les informations
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */

interface InfoCellProps {
  icon: typeof MapPin;
  label: string;
  children: ReactNode;
  delay: number;
}

function InfoCell({ icon: Icon, label, children, delay }: InfoCellProps) {
  return (
    <Reveal delay={delay} className="bg-charbon">
      <div className="flex h-full flex-col items-center gap-4 px-6 py-10 text-center">
        <Icon size={18} strokeWidth={1.2} aria-hidden="true" className="text-or/70" />
        <h3 className="eyebrow">{label}</h3>
        <p className="text-sm leading-relaxed text-ivoire/85">{children}</p>
      </div>
    </Reveal>
  );
}
