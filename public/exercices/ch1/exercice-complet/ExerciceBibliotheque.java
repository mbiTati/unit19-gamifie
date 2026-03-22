/**
 * ============================================================
 *  EXERCICE COMPLET — Ch.1 : Design Specification (P1)
 *  ADT Bibliothèque — Gestion d'une bibliothèque d'entreprise
 * ============================================================
 *  
 *  CONTEXTE :
 *  Une entreprise souhaite gérer sa bibliothèque interne.
 *  Chaque livre a : un ISBN (unique), un titre, un auteur, 
 *  et un statut (disponible ou emprunté).
 *
 *  VOTRE MISSION :
 *  1. Écrire la SPÉCIFICATION de l'ADT (sur papier ou commentaires)
 *  2. Implémenter les classes Livre et GestionBibliotheque
 *  3. Exécuter les tests intégrés pour valider (scoring)
 *
 *  SCORING : 100 points au total
 *  DURÉE   : 30-45 minutes
 *  
 *  STRUCTURE :
 *  - Livre.java (classe entité) — à compléter
 *  - GestionBibliotheque.java (classe métier) — à compléter  
 *  - Menu.java (fourni, ne pas modifier)
 *  - TestsBibliotheque.java (scoring, ne pas modifier)
 *
 * ============================================================
 *
 *  SPÉCIFICATION DE L'ADT (à compléter sur papier) :
 *
 *  ADT : Bibliotheque
 *  Description : _______________________________________
 *  
 *  Type : Livre { isbn: String, titre: String, auteur: String,
 *                  emprunte: boolean }
 *
 *  Opérations :
 *    ajouterLivre(l: Livre) -> boolean
 *      Pré  : ___________________
 *      Post : ___________________
 *
 *    rechercherParISBN(isbn: String) -> Livre
 *      Pré  : ___________________
 *      Post : ___________________
 *
 *    emprunterLivre(isbn: String) -> boolean
 *      Pré  : ___________________
 *      Post : ___________________
 *
 *    retournerLivre(isbn: String) -> boolean
 *      Pré  : ___________________
 *      Post : ___________________
 *
 *    listerDisponibles() -> List<Livre>
 *    supprimerLivre(isbn: String) -> boolean
 *    nombreLivres() -> int
 *
 *  Invariants :
 *    - ___________________
 *    - ___________________
 *    - ___________________
 *
 * ============================================================
 */

// ==== Livre.java ====
// TODO : Compléter cette classe
public class Livre {
    // TODO : Attributs (isbn, titre, auteur, emprunte)
    // TODO : Constructeur (4 paramètres, emprunte = false par défaut)
    // TODO : Getters
    // TODO : setEmprunte(boolean)
    // TODO : toString()
}

// ==== GestionBibliotheque.java ====
// TODO : Compléter cette classe
// import java.util.LinkedList;
//
// public class GestionBibliotheque {
//     private LinkedList<Livre> livres;
//
//     // TODO : Constructeur
//     // TODO : ajouterLivre(Livre l) -> boolean
//     // TODO : rechercherParISBN(String isbn) -> Livre
//     // TODO : emprunterLivre(String isbn) -> boolean
//     // TODO : retournerLivre(String isbn) -> boolean
//     // TODO : listerDisponibles() -> LinkedList<Livre>
//     // TODO : supprimerLivre(String isbn) -> boolean
//     // TODO : nombreLivres() -> int
// }
