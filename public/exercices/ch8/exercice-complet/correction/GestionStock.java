import java.util.LinkedList;

public class GestionStock {
    private LinkedList<Medicament> medicaments = new LinkedList<>();

    public boolean ajouter(Medicament m) {
        if (m == null || rechercherParCode(m.getCode()) != null) return false;
        medicaments.add(m);
        return true;
    }
    public Medicament rechercherParCode(String code) {
        for (Medicament m : medicaments)
            if (m.getCode().equals(code)) return m;
        return null;
    }
    public boolean mettreAJourQuantite(String code, int qte) {
        Medicament m = rechercherParCode(code);
        if (m == null) return false;
        m.setQuantite(qte);
        return true;
    }
    public boolean supprimer(String code) {
        Medicament m = rechercherParCode(code);
        if (m != null) { medicaments.remove(m); return true; }
        return false;
    }
    public void listerTous() {
        for (Medicament m : medicaments) System.out.println(m);
    }
    public LinkedList<Medicament> rechercherParNom(String nom) {
        LinkedList<Medicament> res = new LinkedList<>();
        for (Medicament m : medicaments)
            if (m.getNom().toLowerCase().contains(nom.toLowerCase())) res.add(m);
        return res;
    }
    public int getTaille() { return medicaments.size(); }
}