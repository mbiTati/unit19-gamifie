/**
 * EXERCICE GUIDÉ — Ch.5 : Notation formelle (P3)
 * Spécifier un ADT Queue en notation impérative
 * SCORING : 60 pts | DURÉE : 20 min
 *
 * TODO : Complétez la spécification ci-dessous en commentaires,
 * puis implémentez-la en Java.
 */
public class SpecQueue {
    /*
     * ADT : Queue<E>
     * Description : TODO 1 (+10 pts) — décrivez la Queue en une phrase
     *
     * OPERATIONS :
     *   enqueue(e: E) -> void
     *     PRE:  TODO 2 (+10 pts)
     *     POST: TODO 2 (+10 pts)
     *
     *   dequeue() -> E
     *     PRE:  TODO 3 (+10 pts)
     *     POST: TODO 3 (+10 pts)
     *
     *   peek() -> E
     *     PRE:  TODO 4 (+10 pts)
     *     POST: TODO 4 (+10 pts)
     *
     * INVARIANTS : TODO 5 (+10 pts) — listez au moins 2 invariants
     *
     * AXIOMES : TODO 6 (+10 pts) — listez au moins 2 axiomes
     */

    // Implémentation pour vérifier votre spec
    private Object[] data = new Object[100];
    private int head = 0, tail = 0, size = 0;

    public void enqueue(Object e) { data[tail] = e; tail = (tail + 1) % data.length; size++; }
    public Object dequeue() { Object e = data[head]; head = (head + 1) % data.length; size--; return e; }
    public Object peek() { return data[head]; }
    public boolean isEmpty() { return size == 0; }
    public int size() { return size; }

    public static void main(String[] args) {
        SpecQueue q = new SpecQueue();
        q.enqueue("A"); q.enqueue("B"); q.enqueue("C");
        System.out.println(q.dequeue()); // A (FIFO)
        System.out.println(q.peek());    // B
        System.out.println(q.size());    // 2
        System.out.println("Vérifiez que votre spec correspond au comportement !");
    }
}