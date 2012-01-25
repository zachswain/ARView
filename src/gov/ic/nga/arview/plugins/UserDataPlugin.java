package gov.ic.nga.arview.plugins;

import gov.ic.nga.arview.UserData;

import org.json.JSONArray;
import org.json.JSONObject;

import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;

public class UserDataPlugin extends Plugin {	
	@Override
	public PluginResult execute(String action, JSONArray args, String callbackId) {
		try {
			if( "getUserData".equalsIgnoreCase(action) ) {
				JSONObject result = new JSONObject();
				result.put("data", UserData.data);
				
				return new PluginResult(PluginResult.Status.OK, result);
			} else {
				return new PluginResult(PluginResult.Status.ERROR, "Unknown function: " + action);
			}
		} catch( Exception e ) {
			return new PluginResult(PluginResult.Status.ERROR, e.getMessage());
		}
	}
}
