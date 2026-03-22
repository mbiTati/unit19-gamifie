/**
 * EXERCICE GUIDÉ — Ch.7 : ADT base de la POO (D2)
 * Construire une argumentation structurée
 * SCORING : 60 pts | DURÉE : 25 min
 *
 * Complétez les String ci-dessous avec vos arguments.
 * Le programme vérifie que vous avez écrit quelque chose pour chaque partie.
 */
public class ArgumentationADT {

    // TODO 1 (+10 pts) : Thèse (1-2 phrases)
    static String these = "";
    // Exemple : "Les ADT impératifs constituent la base de la POO car..."

    // TODO 2 (+15 pts) : Argument 1 — Encapsulation
    static String arg1_adt = "";  // Le concept dans les ADT
    static String arg1_poo = "";  // Comment ça se retrouve en POO
    static String arg1_exemple = ""; // Exemple Java concret

    // TODO 3 (+15 pts) : Argument 2 — Abstraction
    static String arg2_adt = "";
    static String arg2_poo = "";
    static String arg2_exemple = "";

    // TODO 4 (+10 pts) : Ce que la POO AJOUTE (héritage, polymorphisme)
    static String poo_ajoute = "";

    // TODO 5 (+10 pts) : Conclusion
    static String conclusion = "";

    public static void main(String[] args) {
        int score = 0;
        if (these.length() > 20) { score += 10; System.out.println("✅ TODO 1 : Thèse rédigée (+10)"); }
        else System.out.println("❌ TODO 1 : Rédigez votre thèse (min 20 caractères)");

        if (arg1_adt.length() > 10 && arg1_poo.length() > 10 && arg1_exemple.length() > 10) {
            score += 15; System.out.println("✅ TODO 2 : Argument 1 complet (+15)");
        } else System.out.println("❌ TODO 2 : Complétez les 3 parties de l'argument 1");

        if (arg2_adt.length() > 10 && arg2_poo.length() > 10 && arg2_exemple.length() > 10) {
            score += 15; System.out.println("✅ TODO 3 : Argument 2 complet (+15)");
        } else System.out.println("❌ TODO 3 : Complétez les 3 parties de l'argument 2");

        if (poo_ajoute.length() > 20) { score += 10; System.out.println("✅ TODO 4 : POO ajoute rédigé (+10)"); }
        else System.out.println("❌ TODO 4 : Mentionnez héritage et polymorphisme");

        if (conclusion.length() > 20) { score += 10; System.out.println("✅ TODO 5 : Conclusion rédigée (+10)"); }
        else System.out.println("❌ TODO 5 : Rédigez votre conclusion");

        System.out.printf("\nSCORE : %d / 60 pts\n", score);
    }
}