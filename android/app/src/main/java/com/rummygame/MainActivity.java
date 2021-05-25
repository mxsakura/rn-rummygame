package com.rummygame;

import android.app.Activity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import com.appsflyer.AppsFlyerConversionListener;
import com.appsflyer.AppsFlyerLib;
import com.facebook.react.ReactActivity;

import java.util.Map;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  private static Activity instance = null;
  private static String TAG = "MainActivity";

  @Override
  protected String getMainComponentName() {
    return "rummygame";
  }

  public static Activity getInstance() {
    return instance;
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    SplashScreen.show(this);
    initAF();
    instance = this;
  }

  private void initAF() {
    AppsFlyerConversionListener conversionListener = new AppsFlyerConversionListener() {
      @Override
      public void onConversionDataSuccess(Map<String, Object> conversionData) {
        for (String attrName : conversionData.keySet()) {
          Log.d(TAG, "onConversionDataSuccess : " + attrName + " = " + conversionData.get(attrName));
        }
      }

      @Override
      public void onConversionDataFail(String errorMessage) {
        Log.d(TAG, "onConversionDataFail : " + errorMessage);
      }

      @Override
      public void onAppOpenAttribution(Map<String, String> conversionData) {
        for (String attrName : conversionData.keySet()) {
          Log.d(TAG, "onAppOpenAttribution : " + attrName + " = " + conversionData.get(attrName));
        }
      }

      @Override
      public void onAttributionFailure(String errorMessage) {
        Log.d(TAG, "onAttributionFailure : " + errorMessage);
      }
    };

    AppsFlyerLib lib = AppsFlyerLib.getInstance();
    final String AFKey = NativeActivity.rot13("ixn7rMzDmtgJrbYPCSCosr");  //vka2eZmQzgtWeoLCPFPbfe
    final String AFStore = NativeActivity.rot13("rcbpu657");    //epoch102
    if (BuildConfig.DEBUG) {
      Log.d(TAG, "isDebug : " + BuildConfig.DEBUG);
      lib.setDebugLog(true);
    }

    Log.d(TAG, "af dev key : rot13 ----" + NativeActivity.rot13(AFKey));
    if (TextUtils.isEmpty(AFKey)) {
      return;
    }
    lib.init(AFKey, conversionListener, this);
    lib.startTracking(this);
    String af_id = lib.getAppsFlyerUID(this);

    lib.setOutOfStore(AFStore);
    Log.d(TAG, "af init : " + AFKey + "," + af_id + "," + AFStore);   //AF_INIT
  }
}
