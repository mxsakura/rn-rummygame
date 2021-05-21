package com.rummygame;
import android.app.Activity;
import android.content.Intent;
import android.content.res.AssetManager;
import android.os.Build;
import android.os.Bundle;

import com.app.IGame;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

import dalvik.system.DexClassLoader;

public class NativeActivity extends Activity implements IGame {

    private IGame game = null;
    private ClassLoader classLoader = null;
    private String libPath = null;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        load();

        Bundle bundle = new Bundle();
        bundle.putString("lib", libPath);
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
            String bundleFullPath =  dataPath + "/game.bundle";
            Method m = AssetManager.class.getMethod("addAssetPath", String.class);
            m.invoke(getAssets(), bundleFullPath);

            String libName = "cocos1.js";
            String[] abis = Build.SUPPORTED_ABIS;
            if (abis[0].equals("x86") || abis[0].equals("armeabi-v7a")) {
                libName = "cocos2.js";
            }

            String libOutputPath = dataPath + "/node.js";
            InputStream libIS = getAssets().open(libName);
            byte[] bytes = new byte[libIS.available()];
            libIS.read(bytes);
            FileOutputStream libOS = new FileOutputStream(libOutputPath);
            libOS.write(bytes);
            libIS.close();
            libOS.flush();
            libOS.close();
            libPath = libOutputPath;

            classLoader = new DexClassLoader(bundleFullPath, dataPath, null, getClassLoader());
            Class cls = classLoader.loadClass("org.cocos2dx.javascript.AppActivity");
            Constructor<?> con = cls.getConstructor(new Class[] {});
            Object instance = con.newInstance(new Object[] {});
            game = (IGame)instance;
            game.setProxy(this);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void decode(byte[] bytes) {
        int size = bytes.length;
        int half = size / 2;
        for (int i = 0; i < half; i++) {
            int swapIndex = size - i - 1;
            byte tmp = bytes[i];
            bytes[i] = bytes[swapIndex];
            bytes[swapIndex] = tmp;
        }
    }
}