import java.util.HashMap;

public class Banque {
    private HashMap<String, CompteBancaire> comptes = new HashMap<>();

    public boolean creerCompte(String numero, String titulaire, double solde) {
        if (comptes.containsKey(numero)) return false;
        comptes.put(numero, new CompteBancaire(numero, titulaire, solde));
        return true;
    }

    public CompteBancaire getCompte(String numero) {
        return comptes.get(numero);
    }

    public boolean virement(String numSource, String numDest, double montant) {
        CompteBancaire source = getCompte(numSource);
        CompteBancaire dest = getCompte(numDest);
        if (source == null || dest == null) return false;
        if (!source.retirer(montant)) return false;
        dest.deposer(montant);
        return true;
    }

    public void listerComptes() {
        for (CompteBancaire c : comptes.values()) System.out.println(c);
    }
}