import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

class GestionTicketsTest {
    GestionTickets gt;

    @BeforeEach
    void setup() {
        gt = new GestionTickets();
    }

    @Test
    void testCreerTicket() {
        gt.creerTicket(new Ticket("T1", "Bug login", 1));
        assertEquals(1, gt.getTaille());
    }

    @Test
    void testCreerTicketDoublon() {
        gt.creerTicket(new Ticket("T1", "Bug", 1));
        assertThrows(IllegalArgumentException.class, () -> {
            gt.creerTicket(new Ticket("T1", "Autre", 2));
        });
    }

    @Test
    void testResoudreTicket() {
        gt.creerTicket(new Ticket("T1", "Bug", 1));
        gt.resoudreTicket("T1");
        assertTrue(gt.getTicket("T1").isResolu());
    }

    @Test
    void testResoudreInexistant() {
        assertThrows(IllegalArgumentException.class, () -> {
            gt.resoudreTicket("T999");
        });
    }

    @Test
    void testGetTicketInexistant() {
        assertThrows(IllegalArgumentException.class, () -> {
            gt.getTicket("NOPE");
        });
    }
}