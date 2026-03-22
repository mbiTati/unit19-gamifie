/**
 * CORRECTION — GestionBibliotheque
 * Implémentation de l'ADT Bibliothèque avec LinkedList
 *
 * Invariants :
 *  - nombreLivres() >= 0
 *  - Pas de doublons d'ISBN
 *  - Un livre emprunté ne peut pas être emprunté à nouveau
 */
import java.util.LinkedList;

public class GestionBibliotheque {
    private LinkedList<Livre> livres;

    public GestionBibliotheque() {
        this.livres = new LinkedList<>();
    }

    // ═══ CREATE ═══
    // Pré  : l != null, l.getIsbn() != null
    // Post : si ISBN unique -> ajouté, return true ; sinon false
    public boolean ajouterLivre(Livre l) {
        if (l == null || l.getIsbn() == null) {
            return false; // Précondition
        }
        if (rechercherParISBN(l.getIsbn()) != null) {
            return false; // Invariant : pas de doublons
        }
        livres.add(l);
        return true; // Postcondition : ajouté
    }

    // ═══ READ ═══
    // Pré  : isbn != null
    // Post : retourne le Livre ou null
    public Livre rechercherParISBN(String isbn) {
        if (isbn == null) return null;
        for (Livre l : livres) {
            if (l.getIsbn().equals(isbn)) {
                return l;
            }
        }
        return null;
    }

    // ═══ UPDATE ═══
    // Pré  : isbn != null, le livre existe, le livre est disponible
    // Post : livre.emprunte = true, return true
    public boolean emprunterLivre(String isbn) {
        Livre l = rechercherParISBN(isbn);
        if (l == null) return false;         // Livre non trouvé
        if (l.isEmprunte()) return false;    // Déjà emprunté (invariant)
        l.setEmprunte(true);
        return true;
    }

    // ═══ UPDATE ═══
    // Pré  : isbn != null, le livre existe, le livre est emprunté
    // Post : livre.emprunte = false, return true
    public boolean retournerLivre(String isbn) {
        Livre l = rechercherParISBN(isbn);
        if (l == null) return false;
        if (!l.isEmprunte()) return false;   // Pas emprunté
        l.setEmprunte(false);
        return true;
    }

    // ═══ READ ═══
    // Post : retourne uniquement les livres non empruntés
    public LinkedList<Livre> listerDisponibles() {
        LinkedList<Livre> dispo = new LinkedList<>();
        for (Livre l : livres) {
            if (!l.isEmprunte()) {
                dispo.add(l);
            }
        }
        return dispo;
    }

    // ═══ DELETE ═══
    // Pré  : isbn != null
    // Post : si trouvé -> supprimé, size -= 1, return true
    public boolean supprimerLivre(String isbn) {
        Livre l = rechercherParISBN(isbn);
        if (l != null) {
            livres.remove(l);
            return true;
        }
        return false;
    }

    // ═══ UTILITAIRES ═══
    public int nombreLivres() {
        return livres.size();
    }

    public LinkedList<Livre> getLivres() {
        return livres;
    }
}
