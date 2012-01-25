package gov.ic.nga.arview.plugins;

import gov.ic.nga.arview.Orientation;

import org.json.JSONArray;
import org.json.JSONObject;

import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;

public class OrientationPlugin extends Plugin {

	@Override
	public PluginResult execute(String action, JSONArray args, String callbackId) {
		try {
			if( "getOrientation".equalsIgnoreCase(action) ) {
				// do something with options eventually
				JSONObject result = new JSONObject();
				result.put("x", Orientation.getX());
				result.put("y", Orientation.getY());
				result.put("z", Orientation.getZ());
				
				return new PluginResult(PluginResult.Status.OK, result);
			} else {
				return new PluginResult(PluginResult.Status.ERROR, "Unknown function: " + action);
			}
		} catch( Exception e ) {
			return new PluginResult(PluginResult.Status.ERROR, e.getMessage());
		}
	}
}
