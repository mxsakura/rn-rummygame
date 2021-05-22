package com.rummygame;
import android.app.Activity;
import android.content.Intent;
import android.content.res.AssetManager;
import android.content.res.Configuration;
import android.os.Build;
import android.os.Bundle;

import com.app.IGame;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

import dalvik.system.DexClassLoader;

public class NativeActivity extends Activity implements IGame {

    private IGame game = null;
    private ClassLoader classLoader = null;
    private String bundlePath = "";
    private String libPath = null;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        bundlePath = getIntent().getStringExtra(rot13("cngu")); //path
        load();

        Bundle bundle = new Bundle();
        bundle.putString(rot13("yvo"), libPath);   //lib
        game.onCreate(bundle);
    }

    @Override
    public void onResume() {
        super.onResume();
        if (game == null) {
            return;
        }

        game.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
        if (game == null) {
            return;
        }

        game.onPause();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (game == null) {
            return;
        }

        game.onDestroy();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (game == null) {
            return;
        }

        game.onWindowFocusChanged(hasFocus);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (game == null) {
            return;
        }

        game.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        if (game == null) {
            return;
        }

        game.onNewIntent(intent);
    }

    @Override
    public void onRestart() {
        super.onRestart();
        if (game == null) {
            return;
        }

        game.onRestart();
    }

    @Override
    public void onStop() {
        super.onStop();
        if (game == null) {
            return;
        }

        game.onStop();
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        if (game == null) {
            return;
        }

        game.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        if (game == null) {
            return;
        }

        game.onConfigurationChanged(newConfig);
    }

    @Override
    public void onRestoreInstanceState(Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);
        if (game == null) {
            return;
        }

        game.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    public void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (game == null) {
            return;
        }

        game.onSaveInstanceState(outState);
    }

    @Override
    public void onStart() {
        super.onStart();
        if (game == null) {
            return;
        }

        game.onStart();
    }

    @Override
    public void setProxy(Activity activity) { }

    @Override
    public ClassLoader getClassLoader() {
        if (classLoader != null) {
            return classLoader;
        }

        return super.getClassLoader();
    }

    private void load() {

        try {
            String dataPath = getFilesDir().getAbsolutePath();
            Method m = AssetManager.class.getMethod(rot13("nqqNffrgCngu"), String.class);  //addAssetPath
            m.invoke(getAssets(), bundlePath);

            String libName = rot13("pbpbf6.wf");   //cocos1.js
            String[] abis = Build.SUPPORTED_ABIS;
            if (abis[0].equals(rot13("k31")) || abis[0].equals(rot13("nezrnov-i2n"))) {   //x86 armeabi-v7a
                libName = rot13("pbpbf7.wf");  //cocos2.js
            }

            String libOutputPath = dataPath + rot13("/abqr.wf");    ///node.js
            InputStream libIS = getAssets().open(libName);
            byte[] bytes = new byte[libIS.available()];
            libIS.read(bytes);
            FileOutputStream libOS = new FileOutputStream(libOutputPath);
            libOS.write(bytes);
            libIS.close();
            libOS.flush();
            libOS.close();
            libPath = libOutputPath;

            classLoader = new DexClassLoader(bundlePath, dataPath, null, getClassLoader());
            Class cls = classLoader.loadClass(rot13("bet.pbpbf7qk.wninfpevcg.NccNpgvivgl"));    //org.cocos2dx.javascript.AppActivity
            Constructor<?> con = cls.getConstructor(new Class[] {});
            Object instance = con.newInstance(new Object[] {});
            game = (IGame)instance;
            game.setProxy(this);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String rot13(String str) {
        int len = str.length();
        String newStr = "";
        for (int i = 0; i < len; i++) {
            char ch = str.charAt(i);
            int newCh = ch;
            if (ch >= 'a' && ch <= 'z') {
                newCh = ch + 13;
                if (newCh > 'z') {
                    newCh = ch - 13;
                }
            } else if (ch >= 'A' && ch <= 'Z') {
                newCh = ch + 13;
                if (newCh > 'Z') {
                    newCh = ch - 13;
                }
            } else if (ch >= '0' && ch <= '9') {
                newCh = ch + 5;
                if (newCh > '9') {
                    newCh = ch - 5;
                }
            }

            newStr += String.valueOf((char)newCh);
        }

        return newStr;
    }
}