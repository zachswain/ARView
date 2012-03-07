package gov.ic.nga.arview;

import org.json.JSONArray;
import org.json.JSONException;

import android.graphics.Color;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.widget.RelativeLayout;

import com.phonegap.DroidGap;

public class ARViewActivity extends DroidGap {
	private SensorManager mSensorManager;

	// NFC
	final int matrix_size = 16;
	float[] mGravs = new float[3];
	float[] mGeoMags = new float[3];
	private float[] mOrientation = new float[3];
	private float[] mRotationM = new float[matrix_size];
	private float[] mRemapedRotationM = new float[matrix_size];

	private final SensorEventListener sel = new SensorEventListener() {
		public void onSensorChanged(SensorEvent event) {
			switch (event.sensor.getType()) {
			case Sensor.TYPE_ACCELEROMETER:
				System.arraycopy(event.values, 0, mGravs, 0, 3);
				break;
			case Sensor.TYPE_MAGNETIC_FIELD:
				for (int i = 0; i < 3; i++)
					mGeoMags[i] = event.values[i];
				break;
			default:
				return;
			}
			
//			Log.d("ARViewActivity","sensor change");

			if (SensorManager.getRotationMatrix(mRotationM, null, mGravs,
					mGeoMags)) {
				SensorManager.remapCoordinateSystem(mRotationM,
						SensorManager.AXIS_X, SensorManager.AXIS_Z,
						mRemapedRotationM);
				SensorManager.getOrientation(mRemapedRotationM, mOrientation);

				float x = (float) Math
						.round((Math.toDegrees(mOrientation[0])) * 2) / 2;
				x = (x + 360) % 360;

				float y = (float) Math
						.round((Math.toDegrees(mOrientation[1])) * 2) / 2;
				y = (y + 360) % 360;

				float z = (float) Math
						.round((Math.toDegrees(mOrientation[2])) * 2) / 2;
				z = (z + 360) % 360;

				Orientation.setOrientation(x, y, z);
			}
		}

		public void onAccuracyChanged(Sensor sensor, int accuracy) {
		}
	};

	protected void onResume() {
		super.onResume();
		mSensorManager.registerListener(sel,
				mSensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD),
				SensorManager.SENSOR_DELAY_NORMAL);
		mSensorManager.registerListener(sel,
				mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),
				SensorManager.SENSOR_DELAY_NORMAL);
	}

	protected void onPause() {
		super.onPause();
		mSensorManager.unregisterListener(sel);
	}

	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {

		String userData = null;

		/*
		 * Register a listener for sensor data
		 */
		mSensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);

		/*
		 * Register the listeners
		 */
		mSensorManager.registerListener(sel,
				mSensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD),
				SensorManager.SENSOR_DELAY_NORMAL);
		mSensorManager.registerListener(sel,
				mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),
				SensorManager.SENSOR_DELAY_NORMAL);

		/*
		 * See if we have any data that's been passed in
		 */
		try {
			Bundle b = getIntent().getExtras();
			userData = b.getString("userdata");

			try {
				Log.d("ARViewActity", "JSON: " + userData);
				JSONArray json = new JSONArray(userData);
				UserData.data = json;
			} catch (JSONException e) {
				Log.e("ARViewActivity", e.toString());
				// invalid JSON, drop
				userData = null;
			}
		} catch (Exception e) {
			Log.e("ARViewActivity",
					"Error unbundling parameters: " + e.toString());
		}

		super.onCreate(savedInstanceState);

		super.loadUrl("file:///android_asset/www/index.html");

		setContentView(R.layout.main);
		RelativeLayout view = (RelativeLayout) findViewById(R.id.phonegap_container);

		View html = (View) appView.getParent();
		html.setBackgroundColor(Color.TRANSPARENT);
		view.addView(html, new LayoutParams(LayoutParams.FILL_PARENT,
				LayoutParams.FILL_PARENT));

		appView.setBackgroundColor(Color.TRANSPARENT);
		appView.setFocusable(false);
	}

}