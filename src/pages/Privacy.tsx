import { CONTACT, PLACEHOLDERS } from '@/data/site';
import { useSeo } from '@/hooks/useSeo';
import { LegalLayout, LegalBlock } from '@/components/layout/LegalLayout';

/**
 * Politique de confidentialité.
 * Le site ne collecte, en l'état, aucune donnée personnelle : ni formulaire,
 * ni compte, ni mesure d'audience. Le texte décrit donc la réalité technique
 * actuelle et signale les points à compléter le jour où un module de
 * réservation ou un outil de statistiques sera ajouté.
 */
export default function Privacy() {
  useSeo({
    title: 'Politique de confidentialité',
    description:
      "Politique de confidentialité du site du restaurant L'Aller Retour : données collectées, cookies et droits des utilisateurs.",
  });

  return (
    <LegalLayout eyebrow="Vos données" title="Politique de confidentialité">
      <LegalBlock title="Données collectées">
        <p>
          En l'état actuel, ce site est un site vitrine : il ne comporte ni formulaire de
          contact, ni création de compte, et ne collecte aucune donnée personnelle auprès des
          visiteurs.
        </p>
      </LegalBlock>

      <LegalBlock title="Cookies et mesure d'audience">
        <p>
          Aucun cookie de mesure d'audience ni de publicité n'est déposé par ce site.
        </p>
        <p className="text-cendre">
          [À COMPLÉTER si un outil de statistiques ou un traceur est ajouté ultérieurement.]
        </p>
      </LegalBlock>

      <LegalBlock title="Réservation en ligne">
        <p>
          La réservation d'une table peut être confiée à un service externe. Dans ce cas, les
          informations saisies sont traitées par ce prestataire, selon sa propre politique de
          confidentialité.
        </p>
        <p className="text-cendre">[NOM DU PRESTATAIRE DE RÉSERVATION — LIEN VERS SA POLITIQUE]</p>
      </LegalBlock>

      <LegalBlock title="Vos droits">
        <p>
          Conformément au Règlement général sur la protection des données (RGPD) et à la loi
          « Informatique et Libertés », vous disposez d'un droit d'accès, de rectification,
          d'effacement, de limitation et d'opposition sur les données vous concernant.
        </p>
        <p>
          Ces droits s'exercent auprès du restaurant :{' '}
          {CONTACT.email ?? <span className="text-cendre">{PLACEHOLDERS.email}</span>}
        </p>
      </LegalBlock>

      <LegalBlock title="Responsable du traitement">
        <p className="text-cendre">[RAISON SOCIALE]</p>
        <p className="text-cendre">{PLACEHOLDERS.address}</p>
      </LegalBlock>
    </LegalLayout>
  );
}
