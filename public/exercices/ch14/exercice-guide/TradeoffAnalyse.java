/**
 * EXERCICE GUIDÉ — Ch.14 : Trade-offs (M5/D4)
 * Analyser les trade-offs et l'indépendance d'implémentation
 * SCORING : 70 pts | DURÉE : 25 min
 */
public class TradeoffAnalyse {

    // TODO 1 (+15 pts) : Pour chaque scénario, choisir le bon ADT et justifier
    // Scénario A : Stocker 1M de contacts avec recherche par email
    static String choixA = ""; // "ArrayList", "LinkedList", "HashMap", "TreeMap"
    static String justifA = ""; // Pourquoi ?

    // Scénario B : Stocker des événements triés par date
    static String choixB = "";
    static String justifB = "";

    // Scénario C : Historique de navigation (bouton retour)
    static String choixC = "";
    static String justifC = "";

    // TODO 2 (+15 pts) : Identifier le trade-off
    // "ArrayList vs LinkedList pour une liste de 100K éléments avec beaucoup d'insertions au milieu"
    static String tradeoff = ""; // Décrivez le trade-off

    // TODO 3 (+20 pts) : 3 avantages de l'indépendance d'implémentation
    static String avantage1 = ""; // Optimisation transparente
    static String avantage2 = ""; // Testabilité
    static String avantage3 = ""; // Réutilisabilité

    // TODO 4 (+20 pts) : Montrer l'indépendance en Java
    // Écrire 2 lignes de code qui montrent le changement d'implémentation
    static String code_avant = ""; // ex: "List<String> list = new ArrayList<>();"
    static String code_apres = ""; // ex: "List<String> list = new LinkedList<>();"

    public static void main(String[] args) {
        int score = 0;

        if ("HashMap".equals(choixA) && justifA.length() > 10) { score += 5; System.out.println("✅ Scénario A (+5)"); }
        else System.out.println("❌ A : HashMap — recherche O(1) par clé email");
        if ("TreeMap".equals(choixB) && justifB.length() > 10) { score += 5; System.out.println("✅ Scénario B (+5)"); }
        else System.out.println("❌ B : TreeMap — trié par clé (date)");
        if (choixC.toLowerCase().contains("stack") && justifC.length() > 10) { score += 5; System.out.println("✅ Scénario C (+5)"); }
        else System.out.println("❌ C : Stack — LIFO pour le bouton retour");

        if (tradeoff.length() > 20) { score += 15; System.out.println("✅ TODO 2 : trade-off identifié (+15)"); }
        else System.out.println("❌ TODO 2 : ArrayList accès O(1) mais insert O(n) vs LinkedList inverse");

        if (avantage1.length() > 10 && avantage2.length() > 10 && avantage3.length() > 10) {
            score += 20; System.out.println("✅ TODO 3 : 3 avantages rédigés (+20)");
        } else System.out.println("❌ TODO 3 : Rédigez les 3 avantages");

        if (code_avant.contains("new") && code_apres.contains("new")) {
            score += 20; System.out.println("✅ TODO 4 : code d'indépendance (+20)");
        } else System.out.println("❌ TODO 4 : Montrez le changement d'implémentation");

        System.out.printf("\nSCORE : %d / 70 pts\n", score);
    }
}