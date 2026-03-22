import java.util.HashMap;
import java.util.LinkedList;

public class GestionTickets {
    private HashMap<String, Ticket> tickets = new HashMap<>();

    public void creerTicket(Ticket t) throws IllegalArgumentException {
        if (t == null || t.getId() == null)
            throw new IllegalArgumentException("Ticket ou ID null");
        if (tickets.containsKey(t.getId()))
            throw new IllegalArgumentException("Ticket " + t.getId() + " existe déjà");
        tickets.put(t.getId(), t);
    }

    public void resoudreTicket(String id) throws IllegalArgumentException {
        Ticket t = getTicket(id);
        if (t.isResolu())
            throw new IllegalStateException("Ticket déjà résolu");
        t.setResolu(true);
    }

    public Ticket getTicket(String id) throws IllegalArgumentException {
        if (!tickets.containsKey(id))
            throw new IllegalArgumentException("Ticket " + id + " inexistant");
        return tickets.get(id);
    }

    public int getTaille() { return tickets.size(); }
}