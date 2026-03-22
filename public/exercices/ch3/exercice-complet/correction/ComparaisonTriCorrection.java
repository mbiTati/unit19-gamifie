/**
 * CORRECTION — Ch.3 Comparaison de tris
 */
public class ComparaisonTriCorrection {
    static int compBubble = 0, compQuick = 0;

    static void bubbleSort(int[] arr) {
        compBubble = 0;
        for (int i = 0; i < arr.length - 1; i++)
            for (int j = 0; j < arr.length - 1 - i; j++) {
                compBubble++;
                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = tmp;
                }
            }
    }

    static void quickSort(int[] a, int lo, int hi) {
        if (lo < hi) {
            int p = partition(a, lo, hi);
            quickSort(a, lo, p - 1);
            quickSort(a, p + 1, hi);
        }
    }
    static int partition(int[] a, int lo, int hi) {
        int pivot = a[hi]; int i = lo;
        for (int j = lo; j < hi; j++) {
            compQuick++;
            if (a[j] < pivot) { int t = a[i]; a[i] = a[j]; a[j] = t; i++; }
        }
        int t = a[i]; a[i] = a[hi]; a[hi] = t;
        return i;
    }
}