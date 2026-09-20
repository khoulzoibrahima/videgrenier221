# VideGrenier221 — Référence de conception MVP

## Sources de vérité

- PRD fourni le 20 septembre 2026 : `PRD_Vide_Grenier_221.docx`.
- Maquette 1 : détection IA d'une pièce et sélection des objets.
- Maquette 2 : accueil et découverte des annonces.
- Maquette 3 : boutique publique et fiche article.
- Décisions explicites prises pendant le cadrage, prioritaires sur le PRD en cas de divergence.

## Décisions prioritaires

- Produit : application web responsive et mobile-first nommée **VideGrenier221**.
- Authentification du MVP : compte Google via Firebase Authentication, et non code SMS.
- Territoire produit : les 14 régions du Sénégal dès le lancement.
- Acquisition pilote : concentration initiale à Dakar, Mbour et Saly pour créer de la densité.
- Analyse d'une pièce : une fiche distincte par objet détecté.
- Contrôle : aucune publication automatique ; le vendeur choisit, corrige et valide chaque fiche.
- Vente : contact et réservation via WhatsApp ; aucun paiement ni livraison intégrés au MVP.
- Partage : chaque boutique et chaque article disposent d'une URL publique partageable.
- Réservation : confirmation du vendeur et expiration après 24 heures.
- Langue initiale : français simple ; wolof différé après validation du pilote.

## Parcours principal

1. Le vendeur se connecte avec Google.
2. Il crée sa boutique avec un nom, une ville, un quartier facultatif et une couverture.
3. Il choisit « Photographier une pièce » ou « Vendre un objet ».
4. Il téléverse une à cinq photos.
5. L'analyse asynchrone détecte les objets et produit des suggestions.
6. Le vendeur sélectionne les objets à vendre et corrige chaque fiche.
7. Il prévisualise puis publie explicitement.
8. Il partage sa boutique ou un article par WhatsApp, Facebook ou copie de lien.
9. L'acheteur consulte sans compte et contacte ou réserve via WhatsApp.
10. Le vendeur maintient le statut disponible, réservé, vendu ou retiré.

## Limites du MVP

Le paiement intégré, la livraison, la messagerie interne, les enchères, les comptes professionnels et l'application native sont exclus. L'estimation de prix reste indicative et ne doit jamais inventer une marque, un âge, une matière ou un état.

## Direction visuelle

- Palette : vert profond, crème chaud et jaune solaire.
- Univers : chaleureux, local, durable et digne de confiance.
- Priorité : usage sur téléphone Android et connexion mobile moyenne.
- Références fonctionnelles : accueil de la maquette 2, analyse de la maquette 1, boutique et article de la maquette 3.

## Critères de lancement

- Cinq objets peuvent être publiés depuis des photos sans assistance humaine.
- Chaque contenu IA reste un brouillon avant validation explicite.
- Les pages publiques sont utilisables sans compte et ne révèlent aucune adresse exacte.
- Le partage WhatsApp inclut le nom et le lien de la boutique ou de l'article.
- Un objet vendu n'accepte plus de réservation.
- Les signalements et suspensions sont opérationnels.
- Le tunnel mesure activation, analyse, publication, partage, contact, réservation et vente déclarée.

