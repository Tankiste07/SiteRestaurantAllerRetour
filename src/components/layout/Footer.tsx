import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import { LEGAL_NAV } from '@/data/navigation';
import { CELLAR, CONTACT, OPENING_HOURS, PLACEHOLDERS } from '@/data/site';
import { ReservationButton } from '../ReservationButton';
import { Ornament } from '../ui/Ornament';
import { Logo } from './Logo';

const FOOTER_LINKS = [
  { label: 'La carte', to: '/la-carte' },
  { label: 'La cave', to: '/la-cave' },
  { label: 'La viande', to: '/la-viande' },
  { label: 'Le restaurant', to: '/le-restaurant' },
  { label: 'Galerie', to: '/galerie' },
  { label: 'Contact', to: '/contact' },
];

export function Footer() {
  const knownHours = OPENING_HOURS.filter((day) => day.hours || day.closed);

  return (
    <footer className="grain relative border-t border-or/12 bg-charbon">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-or/40 to-transparent"
      />

      <div className="u-container relative z-10 py-16 md:py-20">
        {/* ---------------- Bandeau haut : signature + réservation --------- */}
        <div className="flex flex-col items-center gap-8 text-center">
          <Logo asText minimal={false} />
          <p className="max-w-md text-sm leading-relaxed text-sable">
            Viandes d'exception, cave de plus de {CELLAR.announcedReferences} références.
          </p>
          <ReservationButton size="md">Réserver une table</ReservationButton>
        </div>

        <Ornament className="my-12 md:my-14" />

        {/* ---------------- Colonnes ------------------------------------- */}
        <div className="grid gap-10 sm:grid-cols-3">
          {/* Navigation */}
          <nav aria-label="Pied de page">
            <h2 className="eyebrow">Le site</h2>
            <ul className="mt-5 space-y-3">
              {FOOTER_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="link-quiet text-sm text-ivoire/80 hover:text-creme"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Coordonnées */}
          <div>
            <h2 className="eyebrow">Nous trouver</h2>
            <ul className="mt-5 space-y-4 text-sm text-ivoire/80">
              <li className="flex gap-3">
                <MapPin size={15} strokeWidth={1.3} className="mt-1 shrink-0 text-or/70" />
                {CONTACT.address.street ? (
                  <span>
                    {CONTACT.address.street}
                    <br />
                    {CONTACT.address.postalCode} {CONTACT.address.city}
                  </span>
                ) : (
                  <span className="text-cendre">{PLACEHOLDERS.address}</span>
                )}
              </li>
              <li className="flex gap-3">
                <Phone size={15} strokeWidth={1.3} className="mt-1 shrink-0 text-or/70" />
                {CONTACT.phone ? (
                  <a href={`tel:${CONTACT.phone}`} className="link-quiet hover:text-creme">
                    {CONTACT.phoneDisplay ?? CONTACT.phone}
                  </a>
                ) : (
                  <span className="text-cendre">{PLACEHOLDERS.phone}</span>
                )}
              </li>
              <li className="flex gap-3">
                <Mail size={15} strokeWidth={1.3} className="mt-1 shrink-0 text-or/70" />
                {CONTACT.email ? (
                  <a href={`mailto:${CONTACT.email}`} className="link-quiet break-all hover:text-creme">
                    {CONTACT.email}
                  </a>
                ) : (
                  <span className="text-cendre">{PLACEHOLDERS.email}</span>
                )}
              </li>
            </ul>
          </div>

          {/* Horaires */}
          <div>
            <h2 className="eyebrow">Horaires</h2>
            {knownHours.length > 0 ? (
              <ul className="mt-5 space-y-2.5 text-sm">
                {knownHours.map((day) => (
                  <li key={day.day}>
                    <p className="text-sable">{day.day}</p>
                    <p className="tnum text-ivoire/80">{day.closed ? 'Fermé' : day.hours}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-sm text-cendre">{PLACEHOLDERS.hours}</p>
            )}
          </div>
        </div>

        {/* ---------------- Bas de page ----------------------------------- */}
        <div className="mt-14 flex flex-col gap-5 border-t border-or/10 pt-7 text-xs text-cendre sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} L'Aller Retour. Tous droits réservés.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="link-quiet hover:text-ivoire">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
