import { CONTACT, PLACEHOLDERS } from '@/data/site';
import { useSeo } from '@/hooks/useSeo';
import { LegalLayout, LegalBlock } from '@/components/layout/LegalLayout';

/**
 * Mentions légales.
 * Les éléments juridiques (raison sociale, SIRET, hébergeur, directeur de
 * publication…) n'ont pas été communiqués : ils restent des emplacements
 * réservés. Aucune information juridique n'est inventée.
 */
export default function Legal() {
  useSeo({
    title: 'Mentions légales',
    description: "Mentions légales du site du restaurant L'Aller Retour.",
  });

  return (
    <LegalLayout eyebrow="Informations" title="Mentions légales">
      <LegalBlock title="Éditeur du site">
        <p>
          <strong className="font-medium text-creme">L'Aller Retour</strong>
        </p>
        <p className="text-cendre">[RAISON SOCIALE]</p>
        <p className="text-cendre">[FORME JURIDIQUE — CAPITAL SOCIAL]</p>
        <p className="text-cendre">{PLACEHOLDERS.address}</p>
        <p className="text-cendre">[SIRET] — [RCS] — [N° TVA INTRACOMMUNAUTAIRE]</p>
        <p>
          Téléphone :{' '}
          {CONTACT.phoneDisplay ?? <span className="text-cendre">{PLACEHOLDERS.phone}</span>}
        </p>
        <p>
          E-mail : {CONTACT.email ?? <span className="text-cendre">{PLACEHOLDERS.email}</span>}
        </p>
      </LegalBlock>

      <LegalBlock title="Directeur de la publication">
        <p className="text-cendre">[NOM DU DIRECTEUR DE LA PUBLICATION]</p>
      </LegalBlock>

      <LegalBlock title="Hébergeur">
        <p className="text-cendre">[NOM DE L'HÉBERGEUR]</p>
        <p className="text-cendre">[ADRESSE DE L'HÉBERGEUR]</p>
        <p className="text-cendre">[TÉLÉPHONE DE L'HÉBERGEUR]</p>
      </LegalBlock>

      <LegalBlock title="Propriété intellectuelle">
        <p>
          L'ensemble des contenus présents sur ce site — textes, photographies, éléments
          graphiques et charte visuelle — est protégé par le droit de la propriété
          intellectuelle. Toute reproduction, représentation ou diffusion, totale ou partielle,
          sans autorisation écrite préalable est interdite.
        </p>
      </LegalBlock>

      <LegalBlock title="Responsabilité">
        <p>
          Les informations diffusées sur ce site sont fournies à titre indicatif. La carte, les
          prix et la disponibilité des références de la cave sont susceptibles d'évoluer.
        </p>
      </LegalBlock>

      <LegalBlock title="Crédits">
        <p className="text-cendre">[CRÉDITS PHOTOGRAPHIQUES]</p>
        <p className="text-cendre">[CONCEPTION ET RÉALISATION DU SITE]</p>
      </LegalBlock>
    </LegalLayout>
  );
}
