package sn.vg221.profile;

public final class SenegalPhoneNumber {
    private SenegalPhoneNumber() {}

    public static String normalize(String input) {
        if (input == null || input.isBlank()) {
            throw new IllegalArgumentException("Le numéro WhatsApp est obligatoire.");
        }

        var compact = input.trim().replaceAll("[\\s.\\-()]", "");
        if (compact.startsWith("+221")) {
            compact = compact.substring(4);
        } else if (compact.startsWith("221") && compact.length() == 12) {
            compact = compact.substring(3);
        }

        if (!compact.matches("\\d{9}")) {
            throw new IllegalArgumentException("Entrez un numéro sénégalais de 9 chiffres.");
        }
        return "+221" + compact;
    }
}
