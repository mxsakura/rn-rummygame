package com.app;

import android.app.Activity;
import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;

public interface IGame {
    void onCreate(Bundle savedInstanceState);
    void onResume();
    void onPause();
    void onDestroy();
    void onWindowFocusChanged(boolean hasFocus);
    void onActivityResult(int requestCode, int resultCode, Intent data);
    void onNewIntent(Intent intent);
    void onRestart();
    void onStop();
    void onBackPressed();
    void onConfigurationChanged(Configuration newConfig);
    void onRestoreInstanceState(Bundle savedInstanceState);
    void onSaveInstanceState(Bundle outState);
    void onStart();
    void setProxy(Activity activity);
}