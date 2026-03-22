public class Medicament {
    private String code, nom;
    private double prix;
    private int quantite;

    public Medicament(String code, String nom, double prix, int quantite) {
        this.code = code; this.nom = nom; this.prix = prix; this.quantite = quantite;
    }
    public String getCode() { return code; }
    public String getNom() { return nom; }
    public double getPrix() { return prix; }
    public int getQuantite() { return quantite; }
    public void setQuantite(int q) { this.quantite = q; }
    public String toString() { return "["+code+"] "+nom+" - "+prix+"€ (qté: "+quantite+")"; }
}