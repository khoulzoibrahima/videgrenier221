package sn.vg221.auth;

public class InvalidIdentityTokenException extends RuntimeException {
    public InvalidIdentityTokenException() {
        super("Invalid Firebase identity token");
    }

    public InvalidIdentityTokenException(Throwable cause) {
        super("Invalid Firebase identity token", cause);
    }
}
