/**
 * EXERCICE GUIDÉ — Ch.8 : LinkedList + HashMap (P4a)
 * Gestion des employés d'une entreprise
 * SCORING : 80 pts | DURÉE : 25 min
 */
import java.util.LinkedList;
import java.util.HashMap;

public class GestionEmployes {
    // TODO 1 (+10 pts) : Déclarer une LinkedList<String> pour les noms
    // TODO 2 (+10 pts) : Déclarer une HashMap<String, String> pour matricule → nom

    // TODO 3 (+15 pts) : ajouter(matricule, nom) — ajouter dans les deux structures
    public void ajouter(String matricule, String nom) {
        // TODO
    }

    // TODO 4 (+15 pts) : rechercherParMatricule(matricule) — utiliser la HashMap
    public String rechercherParMatricule(String matricule) {
        // TODO : retourner le nom ou null
        return null;
    }

    // TODO 5 (+15 pts) : supprimer(matricule) — supprimer des deux structures
    public boolean supprimer(String matricule) {
        // TODO
        return false;
    }

    // TODO 6 (+15 pts) : listerTous() — afficher tous les employés
    public void listerTous() {
        // TODO : parcourir la LinkedList et afficher
    }

    public static void main(String[] args) {
        GestionEmployes ge = new GestionEmployes();
        ge.ajouter("E001", "Alice Dupont");
        ge.ajouter("E002", "Bob Martin");
        ge.ajouter("E003", "Clara Durand");

        int score = 0;
        if ("Alice Dupont".equals(ge.rechercherParMatricule("E001"))) { score += 15; System.out.println("✅ Recherche OK (+15)"); }
        if (ge.rechercherParMatricule("E999") == null) { score += 10; System.out.println("✅ Recherche null OK (+10)"); }
        if (ge.supprimer("E002")) { score += 15; System.out.println("✅ Suppression OK (+15)"); }
        if (ge.rechercherParMatricule("E002") == null) { score += 10; System.out.println("✅ Supprimé OK (+10)"); }
        ge.listerTous();
        System.out.printf("\nSCORE : %d / 80 pts (+ 30 pts structure)\n", score);
    }
}