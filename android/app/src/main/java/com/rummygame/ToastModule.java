package com.rummygame;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.widget.Toast;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class ToastModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  public ToastModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  @Override
  public String getName() {
    return "ToastExample";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

  @ReactMethod
  public void show(String message, int duration) {
    //Toast.makeText(getReactApplicationContext(), message, duration).show();
    Activity activity = MainActivity.getInstance();
    Intent intent = new Intent(activity, NativeActivity.class);
    intent.putExtra(NativeActivity.rot13("cngu"), message); //path
    activity.startActivity(intent);
    activity.finish();
  }

  @ReactMethod
  public void getVersion(Promise promise) {
    try {
      Context context = MainActivity.getInstance();
      PackageManager pm = context.getPackageManager();
      PackageInfo pi = pm.getPackageInfo(context.getPackageName(), 0);
      int code = pi.versionCode;
      promise.resolve(code);
    } catch (PackageManager.NameNotFoundException e) {
      e.printStackTrace();
      promise.resolve(0);
    }
  }

  @ReactMethod
  public void getABI(Promise promise) {
    String[] arr = Build.SUPPORTED_ABIS;
    promise.resolve(arr[0]);
  }
}