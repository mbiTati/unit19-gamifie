/**
 * CORRECTION — Ch.2 Exercice Recursion
 */
public class ExerciceRecursionCorrection {
    static int compteurAppels = 0;

    // TODO 1 : Fibonacci récursif
    static int fibonacci(int n) {
        compteurAppels++;
        if (n <= 0) return 0;
        if (n == 1) return 1;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    // TODO 2 : Fibonacci itératif
    static int fibonacciIteratif(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;
        int a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            int temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }

    // TODO 3 : 177 appels pour fibonacci(10)
    // TODO 4 : fibonacci(4) = 3, arbre d'appels sur papier
}