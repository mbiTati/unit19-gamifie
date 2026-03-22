/**
 * CORRECTION — Classe Livre
 */
public class Livre {
    private String isbn;
    private String titre;
    private String auteur;
    private boolean emprunte;

    public Livre(String isbn, String titre, String auteur) {
        this.isbn = isbn;
        this.titre = titre;
        this.auteur = auteur;
        this.emprunte = false; // Par défaut, disponible
    }

    // Getters
    public String getIsbn() { return isbn; }
    public String getTitre() { return titre; }
    public String getAuteur() { return auteur; }
    public boolean isEmprunte() { return emprunte; }

    // Setter pour le statut
    public void setEmprunte(boolean emprunte) {
        this.emprunte = emprunte;
    }

    @Override
    public String toString() {
        String statut = emprunte ? "EMPRUNTÉ" : "DISPONIBLE";
        return "[" + isbn + "] " + titre + " - " + auteur + " (" + statut + ")";
    }
}
