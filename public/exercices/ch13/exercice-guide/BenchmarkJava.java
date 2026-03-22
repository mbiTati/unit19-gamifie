/**
 * EXERCICE GUIDÉ — Ch.13 : Mesurer l'efficacité (P7)
 * Benchmark : comparer ArrayList vs LinkedList vs HashMap
 * SCORING : 80 pts | DURÉE : 25 min
 */
import java.util.*;

public class BenchmarkJava {

    // TODO 1 (+20 pts) : Remplir une ArrayList de n éléments et mesurer le temps
    static long benchArrayListAdd(int n) {
        ArrayList<Integer> list = new ArrayList<>();
        long start = System.nanoTime();
        // TODO : boucle for de 0 à n, list.add(i)
        long end = System.nanoTime();
        return (end - start) / 1_000_000; // ms
    }

    // TODO 2 (+20 pts) : Mesurer le temps de get(n/2) sur ArrayList vs LinkedList
    static long benchArrayListGet(ArrayList<Integer> list) {
        long start = System.nanoTime();
        // TODO : 1000 appels à list.get(list.size() / 2)
        long end = System.nanoTime();
        return (end - start) / 1_000_000;
    }

    static long benchLinkedListGet(LinkedList<Integer> list) {
        long start = System.nanoTime();
        // TODO : 1000 appels à list.get(list.size() / 2)
        long end = System.nanoTime();
        return (end - start) / 1_000_000;
    }

    // TODO 3 (+20 pts) : Mesurer HashMap.get() vs ArrayList.contains()
    static long benchHashMapGet(HashMap<Integer, String> map, int n) {
        long start = System.nanoTime();
        // TODO : 1000 appels à map.get(n/2)
        long end = System.nanoTime();
        return (end - start) / 1_000_000;
    }

    static long benchArrayListContains(ArrayList<Integer> list, int n) {
        long start = System.nanoTime();
        // TODO : 1000 appels à list.contains(n/2)
        long end = System.nanoTime();
        return (end - start) / 1_000_000;
    }

    // TODO 4 (+20 pts) : Expliquer les résultats
    static String explication = "";
    // Attendu : "ArrayList.get() est O(1) vs LinkedList.get() O(n).
    //            HashMap.get() est O(1) vs ArrayList.contains() O(n)."

    public static void main(String[] args) {
        int n = 100000;
        int score = 0;

        System.out.println("=== Benchmark avec n = " + n + " ===");
        long t = benchArrayListAdd(n);
        if (t >= 0) { score += 20; System.out.println("✅ TODO 1 : ArrayList.add = " + t + " ms (+20)"); }

        // Préparer les structures
        ArrayList<Integer> al = new ArrayList<>();
        LinkedList<Integer> ll = new LinkedList<>();
        HashMap<Integer, String> hm = new HashMap<>();
        for (int i = 0; i < n; i++) { al.add(i); ll.add(i); hm.put(i, "val" + i); }

        long tAL = benchArrayListGet(al);
        long tLL = benchLinkedListGet(ll);
        System.out.printf("ArrayList.get(n/2) x1000 = %d ms%n", tAL);
        System.out.printf("LinkedList.get(n/2) x1000 = %d ms%n", tLL);
        if (tAL >= 0 && tLL >= 0) { score += 20; System.out.println("✅ TODO 2 (+20)"); }

        long tHM = benchHashMapGet(hm, n);
        long tALC = benchArrayListContains(al, n);
        System.out.printf("HashMap.get() x1000 = %d ms%n", tHM);
        System.out.printf("ArrayList.contains() x1000 = %d ms%n", tALC);
        if (tHM >= 0 && tALC >= 0) { score += 20; System.out.println("✅ TODO 3 (+20)"); }

        if (explication.length() > 30) { score += 20; System.out.println("✅ TODO 4 : explication rédigée (+20)"); }

        System.out.printf("\nSCORE : %d / 80 pts\n", score);
    }
}