/**
 * Classe Etudiant — Exercice guidé Ch.1
 * Représente un étudiant avec matricule, nom, prenom, classe
 */
public class Etudiant {
    private String matricule;
    private String nom;
    private String prenom;
    private String classe;

    public Etudiant(String matricule, String nom, String prenom, String classe) {
        this.matricule = matricule;
        this.nom = nom;
        this.prenom = prenom;
        this.classe = classe;
    }

    public String getMatricule() { return matricule; }
    public String getNom() { return nom; }
    public String getPrenom() { return prenom; }
    public String getClasse() { return classe; }

    @Override
    public String toString() {
        return "[" + matricule + "] " + prenom + " " + nom + " (" + classe + ")";
    }
}
