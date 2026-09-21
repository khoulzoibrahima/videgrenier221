package sn.vg221.auth;

public interface IdentityTokenVerifier {
    FirebaseIdentity verify(String token);
}
