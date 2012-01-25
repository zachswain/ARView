package gov.ic.nga.arview;

public final class Orientation {
	private static Float x;
	private static Float y;
	private static Float z;
	
	public Orientation() {
		x = null;
		y = null;
		z = null;
	}
	
	public static void setOrientation(float newX, float newY, float newZ) {
		x = newX;
		y = newY;
		z = newZ;
	}

	public static Float getX() {
		return x;
	}

	public static Float getY() {
		return y;
	}

	public static Float getZ() {
		return z;
	}
}
