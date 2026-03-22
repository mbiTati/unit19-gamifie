/**
 * EXERCICE GUIDÉ — Ch.10 : Exceptions + JUnit (P5)
 * Ajouter la gestion d'erreurs à un programme existant
 * SCORING : 70 pts | DURÉE : 20 min
 */
import java.util.Scanner;

public class ExceptionsGuide {

    // TODO 1 (+10 pts) : Ajouter throws à cette méthode
    static int diviser(int a, int b) {
        // TODO 2 (+10 pts) : Lancer une exception si b == 0
        // throw new ArithmeticException("Division par zéro !");
        return a / b;
    }

    // TODO 3 (+15 pts) : Entourer l'appel de try-catch
    static void calculerAvecSaisie() {
        Scanner sc = new Scanner(System.in);
        System.out.print("Entrez a : ");
        int a = sc.nextInt(); // Peut lancer InputMismatchException
        System.out.print("Entrez b : ");
        int b = sc.nextInt();
        int resultat = diviser(a, b); // Peut lancer ArithmeticException
        System.out.println("Résultat : " + resultat);
    }

    // TODO 4 (+15 pts) : Ajouter un finally qui affiche "Calcul terminé"

    // TODO 5 (+10 pts) : Créer une exception personnalisée
    // static class AgeInvalideException extends Exception { ... }

    // TODO 6 (+10 pts) : Méthode setAge qui lance AgeInvalideException si age < 0
    static void setAge(int age) {
        // TODO : if age < 0 → throw new AgeInvalideException(...)
        System.out.println("Âge défini : " + age);
    }

    public static void main(String[] args) {
        int score = 0;
        // Test diviser
        try {
            diviser(10, 0);
            System.out.println("❌ TODO 1-2 : Pas d'exception lancée");
        } catch (ArithmeticException e) {
            score += 20;
            System.out.println("✅ TODO 1-2 : Exception attrapée (+20)");
        }
        // Test try-catch
        try {
            diviser(10, 2);
            score += 15;
            System.out.println("✅ TODO 3 : Division OK (+15)");
        } catch (Exception e) {
            System.out.println("❌ TODO 3");
        }
        System.out.printf("\nSCORE : %d / 70 pts\n", score);
    }
}