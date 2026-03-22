public class CompteBancaire {
    private String numero;
    private String titulaire;
    private double solde;

    public CompteBancaire(String numero, String titulaire, double soldeInitial) {
        this.numero = numero;
        this.titulaire = titulaire;
        this.solde = Math.max(0, soldeInitial);
    }

    public String getNumero() { return numero; }
    public String getTitulaire() { return titulaire; }
    public double getSolde() { return solde; }

    public boolean deposer(double montant) {
        if (montant <= 0) return false;
        this.solde += montant;
        return true;
    }

    public boolean retirer(double montant) {
        if (montant <= 0 || montant > solde) return false;
        this.solde -= montant;
        return true;
    }

    public String toString() {
        return String.format("[%s] %s — %.2f EUR", numero, titulaire, solde);
    }
}