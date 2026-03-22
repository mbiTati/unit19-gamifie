/**
 * ============================================================
 *  CORRECTION — Exercice guidé Ch.1 : StudentDirectory
 * ============================================================
 */

import java.util.LinkedList;

public class StudentDirectoryCorrection {

    private LinkedList<Etudiant> etudiants;

    public StudentDirectoryCorrection() {
        this.etudiants = new LinkedList<>();
    }

    // OPÉRATION 1 : INSCRIRE (CREATE)
    public boolean inscrire(Etudiant e) {
        // TODO 1 : Vérifier la précondition
        if (e == null || e.getMatricule() == null) {
            return false;
        }
        // TODO 2 : Vérifier l'invariant (pas de doublon)
        if (rechercherParMatricule(e.getMatricule()) != null) {
            return false;
        }
        // TODO 3 : Ajouter et retourner true
        etudiants.add(e);
        return true;
    }

    // OPÉRATION 2 : RECHERCHER (READ)
    public Etudiant rechercherParMatricule(String matricule) {
        // TODO 4 : Parcourir et chercher
        for (Etudiant e : etudiants) {
            if (e.getMatricule().equals(matricule)) {
                return e;
            }
        }
        return null;
    }

    // OPÉRATION 3 : LISTER PAR CLASSE (READ)
    public LinkedList<Etudiant> listerParClasse(String classe) {
        // TODO 5 : Filtrer par classe
        LinkedList<Etudiant> resultat = new LinkedList<>();
        for (Etudiant e : etudiants) {
            if (e.getClasse().equals(classe)) {
                resultat.add(e);
            }
        }
        return resultat;
    }

    // OPÉRATION 4 : SUPPRIMER (DELETE)
    public boolean supprimer(String matricule) {
        // TODO 6 : Rechercher puis supprimer
        Etudiant e = rechercherParMatricule(matricule);
        if (e != null) {
            etudiants.remove(e);
            return true;
        }
        return false;
    }

    // TODO 7
    public int nombreEtudiants() {
        return etudiants.size();
    }

    // TODO 8
    public boolean estVide() {
        return etudiants.isEmpty();
    }
}
