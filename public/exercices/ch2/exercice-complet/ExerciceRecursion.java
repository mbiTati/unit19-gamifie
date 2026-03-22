/**
 * EXERCICE COMPLET — Ch.2 : Memory Stack (P2)
 * Fibonacci récursif : tracer le call stack et compter les appels
 * SCORING : 80 pts | DURÉE : 30-45 min
 *
 * CONTEXTE : Vous devez implémenter la suite de Fibonacci et analyser
 * le comportement du call stack.
 *
 * TODO 1 : Implémenter fibonacci(n) récursif
 * TODO 2 : Implémenter fibonacciIteratif(n) avec une boucle
 * TODO 3 : Compter le nombre d'appels récursifs pour fibonacci(n)
 * TODO 4 : Dessiner le call stack pour fibonacci(4) sur papier
 */
public class ExerciceRecursion {

    static int compteurAppels = 0;

    // TODO 1 (+20 pts) : Implémenter fibonacci récursif
    // fib(0)=0, fib(1)=1, fib(n)=fib(n-1)+fib(n-2)
    static int fibonacci(int n) {
        compteurAppels++;
        // TODO : Complétez
        return 0;
    }

    // TODO 2 (+20 pts) : Implémenter fibonacci itératif (boucle)
    static int fibonacciIteratif(int n) {
        // TODO : Complétez avec une boucle for
        return 0;
    }

    // TODO 3 (+20 pts) : Combien d'appels pour fibonacci(10) ?
    static int reponse_TODO3 = 0; // Remplacez après test

    // TODO 4 (+20 pts) : Sur papier, dessiner l'arbre d'appels de fibonacci(4)
    // Réponse attendue : fibonacci(4) = 3

    public static void main(String[] args) {
        int score = 0;
        // Test TODO 1
        compteurAppels = 0;
        if (fibonacci(6) == 8) { score += 20; System.out.println("✅ TODO 1 : fibonacci(6)=8 (+20)"); }
        else System.out.println("❌ TODO 1 : fibonacci(6) devrait être 8");
        // Test TODO 2
        if (fibonacciIteratif(6) == 8) { score += 20; System.out.println("✅ TODO 2 : fibIteratif(6)=8 (+20)"); }
        else System.out.println("❌ TODO 2 : fibIteratif(6) devrait être 8");
        // Test TODO 3
        compteurAppels = 0; fibonacci(10);
        System.out.println("Nombre d'appels pour fib(10) : " + compteurAppels);
        if (reponse_TODO3 == compteurAppels) { score += 20; System.out.println("✅ TODO 3 correct (+20)"); }
        else System.out.println("❌ TODO 3 : Exécutez et comptez !");
        // TODO 4 : vérification manuelle sur papier
        if (fibonacci(4) == 3) { score += 20; System.out.println("✅ TODO 4 : fibonacci(4)=3, arbre sur papier (+20)"); }
        System.out.printf("\nSCORE : %d / 80 pts\n", score);
    }
}