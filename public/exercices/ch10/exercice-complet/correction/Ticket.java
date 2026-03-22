public class Ticket {
    private String id, description;
    private int priorite;
    private boolean resolu;

    public Ticket(String id, String description, int priorite) {
        this.id = id; this.description = description;
        this.priorite = priorite; this.resolu = false;
    }
    public String getId() { return id; }
    public String getDescription() { return description; }
    public int getPriorite() { return priorite; }
    public boolean isResolu() { return resolu; }
    public void setResolu(boolean r) { this.resolu = r; }
    public String toString() { return "["+id+"] "+description+" (P"+priorite+") "+(resolu?"RÉSOLU":"OUVERT"); }
}